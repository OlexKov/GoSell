using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Olx.BLL.Entities;
using Olx.BLL.Interfaces;
using Olx.DAL.Data;
using Olx.DAL.Repositories;

namespace Olx.DAL.Exstension
{
    public static class OlxDALServiceExtensions
    {
        public static void AddOlxDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<OlxDbContext>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddIdentity<OlxUser, IdentityRole<int>>(options =>
            {
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(Double.Parse(configuration["LockoutTimeSpanMinutes"]!)); // Тривалість блокування
                options.Lockout.MaxFailedAccessAttempts = int.Parse(configuration["MaxFailedAccessAttempts"]!); // Кількість спроб
                options.Lockout.AllowedForNewUsers = true; // Дозволити блокування нових користувачів
              
                options.Stores.MaxLengthForKeys = 128;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 5;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
            })
               .AddDefaultTokenProviders()
               .AddEntityFrameworkStores<OlxDbContext>();
        }

        public static void DataBaseMigrate(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var serviceProvider = scope.ServiceProvider;
            var context = serviceProvider.GetRequiredService<OlxDbContext>();
            context.Database.Migrate();
        }
    }
}
