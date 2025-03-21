using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Olx.BLL.Entities;
using Olx.BLL.Interfaces;
using Olx.BLL.Specifications;

namespace Olx.BLL.Services.BackgroundServices
{
    public class TokenCleanupService(
        IConfiguration configuration,
        IServiceScopeFactory serviceScopeFactory,
        ILogger<TokenCleanupService> logger) : BackgroundService
    {
        private readonly TimeSpan _interval = TimeSpan.FromHours(int.Parse(configuration["RefreshTokenCleanupIntervalHours"]!)); 
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("Token cleanup service started");
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(_interval, stoppingToken);
                await CleanupExpiredTokensAsync();
            }
        }

        private async Task CleanupExpiredTokensAsync()
        {
            using var scope = serviceScopeFactory.CreateScope();
            var refreshToketRepo = scope.ServiceProvider.GetRequiredService<IRepository<RefreshToken>>();
            var expiredTokens = await refreshToketRepo.GetListBySpec(new RefreshTokenSpecs.GetExpired(true));

            if (expiredTokens.Any())
            {
                refreshToketRepo.DeleteRange(expiredTokens);
                await refreshToketRepo.SaveAsync();
                logger.LogInformation("Removed {Count} expired tokens",expiredTokens.Count());
            }
        }
    }
}
