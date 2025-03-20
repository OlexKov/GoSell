using Microsoft.AspNetCore.Http.Features;
using Olx.BLL.Exstensions;
using Olx.BLL.Hubs;
using Olx.DAL.Exstension;
using OLX.API.Extensions;
using OLX.API.Middlewares;
using System.Globalization;


var defaultCulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentCulture = defaultCulture;
CultureInfo.DefaultThreadCurrentUICulture = defaultCulture;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOlxDbContext(builder.Configuration);
builder.Services.AddOlxBLLServices(builder.Configuration);
builder.Services.AddOlxApiConfigurations(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();


var app = builder.Build();
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
app.UseHttpsRedirection();
app.AddCultures();
app.UseSwagger();
app.UseSwaggerUI();
//app.UseCookiePolicy(new CookiePolicyOptions
//{
//    MinimumSameSitePolicy = SameSiteMode.Strict,
//    HttpOnly = HttpOnlyPolicy.Always,
//    Secure = CookieSecurePolicy.Always,
//});

app.AddStaticFiles();
app.UseCors("AllowOrigins");
app.UseAuthentication();
app.UseAuthorization();
app.SetMaxRequestBodySize();
app.MapHub<MessageHub>("/hub");
app.MapControllers();
app.DataBaseMigrate();
await app.SeedDataAsync();
await app.RunAsync();
