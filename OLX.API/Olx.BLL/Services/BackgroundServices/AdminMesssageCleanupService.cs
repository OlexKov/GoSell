
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Olx.BLL.Entities.AdminMessages;
using Olx.BLL.Interfaces;
using Olx.BLL.Specifications;


namespace Olx.BLL.Services.BackgroundServices
{
    public class AdminMesssageCleanupService(
        IConfiguration configuration,
        IServiceScopeFactory serviceScopeFactory) : BackgroundService
    {
        private readonly TimeSpan _interval = TimeSpan.FromHours(int.Parse(configuration["AdminMessageCleanupIntervalHours"]!));
        private readonly int messageExpDay = int.Parse(configuration["AdminMessageExpDays"]!);
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            Console.WriteLine("Admin message cleanup service started");
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(_interval, stoppingToken);
                await CleanupAdminMessagesAsync();
            }
        }

        private async Task CleanupAdminMessagesAsync()
        {
            using var scope = serviceScopeFactory.CreateScope();
            var adminMessageRepo = scope.ServiceProvider.GetRequiredService<IRepository<AdminMessage>>();
            var deletedMesseges = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetDeletedExpDay(messageExpDay));

            if (deletedMesseges.Any())
            {
                adminMessageRepo.DeleteRange(deletedMesseges);
                await adminMessageRepo.SaveAsync();
                Console.WriteLine($"Removed {deletedMesseges.Count()} admin messages");
            }
        }
    }
}
