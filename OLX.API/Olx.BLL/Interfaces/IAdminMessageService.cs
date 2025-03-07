using Olx.BLL.DTOs.AdminMessage;
using Olx.BLL.Models.AdminMessage;
using Olx.BLL.Models.AdminMessageModels;
using Olx.BLL.Models.Page;

namespace Olx.BLL.Interfaces
{
    public interface IAdminMessageService
    {
        Task<IEnumerable<AdminMessageDto>> GetAdminMessages();
        Task<IEnumerable<AdminMessageDto>> GetUserMessages(bool? unreadedOnly);
        Task<PageResponse<AdminMessageDto>> GetPageAsync(AdminMessagePageRequest pageRequest);
        Task<IEnumerable<AdminMessageDto>> GetDeleted();
        Task<AdminMessageDto> GetById(int id);
        Task UserCreate(AdminMessageCreationModel messageCreationModel);
        Task AdminCreate(AdminMessageCreationModel messageCreationModel);
        Task SoftDelete(int id);
        Task SoftDeleteRange(IEnumerable<int> ids);
        Task Delete(int id);
        Task SetReaded(int id);
        Task SetReaded(IEnumerable<int> ids);
    }
}
