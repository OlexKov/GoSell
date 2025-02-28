using Microsoft.EntityFrameworkCore;
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
            //using var scope = serviceScopeFactory.CreateScope();
            //var adminMessageRepo = scope.ServiceProvider.GetRequiredService<IRepository<AdminMessage>>();
            //var messageRepo = scope.ServiceProvider.GetRequiredService<IRepository<Message>>();
            //var deletedAdminMesseges = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetDeletedExpDay(messageExpDay));
           

            //if (deletedAdminMesseges.Any())
            //{
            //    adminMessageRepo.DeleteRange(deletedAdminMesseges);
            //    await adminMessageRepo.SaveAsync();
            //    var deletedMesseges = await messageRepo.GetQuery().Where(x => !x.AdminMessages.Any()).ToArrayAsync();
            //    if (deletedMesseges.Length > 0) 
            //    {
            //        messageRepo.DeleteRange(deletedMesseges);
            //        await messageRepo.SaveAsync();
            //    }
            //    Console.WriteLine($"Removed {deletedAdminMesseges.Count()} admin messages");
            //}
        }
    }
}
