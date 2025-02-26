using Olx.BLL.DTOs.AdminMessage;
using Olx.BLL.Models;

namespace Olx.BLL.Interfaces
{
    public interface IAdminMessageService
    {
        Task<IEnumerable<AdminMessageDto>> GetAdminMessages();
        Task<IEnumerable<AdminMessageDto>> GetUserMessages(bool? unreadedOnly);
        Task<IEnumerable<AdminMessageDto>> GetDeleted();
        Task<AdminMessageDto> GetById(int id);
        Task<AdminMessageDto> UserCreate(AdminMessageCreationModel messageCreationModel);
        Task<AdminMessageDto> AdminCreate(AdminMessageCreationModel messageCreationModel);
        Task SoftDelete(int id);
        Task Delete(int id);
        Task SetReaded(int id);
        Task SetReaded(IEnumerable<int> ids);
    }
}
