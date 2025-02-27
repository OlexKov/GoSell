using Olx.BLL.DTOs;
using Olx.BLL.Models.Advert;
using Olx.BLL.Models.Page;

namespace Olx.BLL.Interfaces
{
    public interface IAdvertService
    {
        Task<int> RemoveCompletedAsync();
        Task<PageResponse<AdvertDto>> GetPageAsync(AdvertPageRequest pageRequest);
        Task<IEnumerable<AdvertDto>> GetAllAsync();
        Task<IEnumerable<AdvertDto>> GetUserAdverts(bool locked = false,bool completed = false);
        Task<IEnumerable<AdvertDto>> GetByUserId(int userId);
        Task<AdvertDto> GetByIdAsync(int id);
        Task<IEnumerable<AdvertDto>> GetRangeAsync(IEnumerable<int> ids);
        Task<IEnumerable<AdvertImageDto>> GetImagesAsync(int advertId);
        Task<AdvertDto> CreateAsync(AdvertCreationModel advertModel);
        Task<AdvertDto> UpdateAsync(AdvertCreationModel advertModel);
        Task DeleteAsync(int id);
        Task ApproveAsync(int id);
        Task SetBlockedStatusAsync(int advertId,bool status);
        Task SetCompletedAsync(int advertId);
    }
}
