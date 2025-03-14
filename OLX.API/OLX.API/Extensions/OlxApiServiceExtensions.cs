using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.FileProviders;
using OLX.API.Helpers.CustomJsonConverters;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Microsoft.AspNetCore.Identity;
using Olx.BLL.Helpers.Options;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.Features;


namespace OLX.API.Extensions
{
    public static class OlxApiServiceExtensions
    {
        /// <summary>
        /// Налаштування контроллерів,JWT,Swagger,CORS
        /// </summary>
        /// <param name="services"></param>
        /// <param name="configuration"></param>
        public static void AddOlxApiConfigurations(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new FlexibleDateTimeConverter());
                options.JsonSerializerOptions.Converters.Add(new FlexibleDoubleConverter());
            });

            var jwtOpts = configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>()!;

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.IncludeErrorDetails = true;
                cfg.TokenValidationParameters = new TokenValidationParameters()
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOpts.Key)),
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = true,
                    ValidIssuer = jwtOpts.Issuer,
                    ValidateIssuerSigningKey = true,
                    NameClaimType = ClaimTypes.NameIdentifier,
                    ClockSkew = TimeSpan.FromMinutes(1)
                };
                cfg.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context => {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;

                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hub"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });
  
            services.Configure<DataProtectionTokenProviderOptions>(options =>
            {
                options.TokenLifespan = TimeSpan.FromMinutes(Double.Parse(configuration["TokenLifespanMinutes"]!)); // Термін дії токенів для відновлення та підтвердження
            });

            var assemblyName = Assembly.GetExecutingAssembly().GetName().Name;
            services.AddSwaggerGen(setup =>
            {
                var fileDoc = Path.Combine(AppContext.BaseDirectory, $"{assemblyName}.xml");
                setup.IncludeXmlComments(fileDoc);
                // Include 'SecurityScheme' to use JWT Authentication
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    BearerFormat = "JWT",
                    Name = "JWT Authentication",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",

                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };

                setup.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
                setup.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { jwtSecurityScheme, Array.Empty<string>() }
                });
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowOrigins",
                builder =>
                {
                    builder.WithOrigins("http://localhost:5173","https://gosell.itstep.click")
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials();
                });
            });
        }

        /// <summary>
        /// Створення папки для файлів та шлях до файлів
        /// </summary>
        /// <param name="app"></param>
        public static void AddStaticFiles(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var serviceProvider = scope.ServiceProvider;
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();

            string imagesDir = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!);
            string imagesPath = Path.Combine(Directory.GetCurrentDirectory(), configuration["ServerImagePath"]!);
           
            if (!Directory.Exists(imagesDir))
            {
                Directory.CreateDirectory(imagesDir);
            }
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(imagesDir),
                RequestPath = imagesPath
            });

        }

        public static void AddCultures(this WebApplication app)
        {
            var supportedCultures = new[] { "en-US", "uk-UA", "ru-RU" };
            var localizationOptions = new RequestLocalizationOptions()
                .SetDefaultCulture("en-US")
                .AddSupportedCultures(supportedCultures)
                .AddSupportedUICultures(supportedCultures);

            app.UseRequestLocalization(localizationOptions);

        }

        public static void SetMaxRequestBodySize(this WebApplication app)
        {
            app.UseWhen(context =>
             context.Request.Path.StartsWithSegments("/api/Backup/upload") ||
             context.Request.Path.StartsWithSegments("/api/Backup/add"),
             appBuilder =>
             {
                 appBuilder.Use((context, next) =>
                 {
                     context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = 200 * 1024 * 1024;
                     return next();
                 });
             });

        }
    }
}
