using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Olx.BLL.Entities;
using Olx.BLL.Interfaces;
using Olx.BLL.Specifications;

namespace Olx.BLL.Services.BackgroundServices
{
    public class ImageCeanupService(
        IConfiguration configuration,
        IServiceScopeFactory serviceScopeFactory,
        ILogger<ImageCeanupService> logger) : BackgroundService
    {
        private readonly TimeSpan _interval = TimeSpan.FromHours(int.Parse(configuration["ImageCleanupIntervalHours"]!));
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("Image cleanup service started");
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(_interval, stoppingToken);
                await CleanupImagesAsync();
            }
        }

        private async Task CleanupImagesAsync()
        {
            using var scope = serviceScopeFactory.CreateScope();
            var imageRepo = scope.ServiceProvider.GetRequiredService<IRepository<AdvertImage>>();
            var imageService = scope.ServiceProvider.GetRequiredService<IImageService>();
            var deletedImages = await imageRepo.GetListBySpec(new ImageSpecs.GetDeleted());

            if (deletedImages.Any())
            {
                imageRepo.DeleteRange(deletedImages);
                await imageRepo.SaveAsync();
                imageService.DeleteImages(deletedImages.Select(x => x.Name));
                logger.LogInformation("Removed {Count} images", deletedImages.Count());
            }
        }
    }
}
