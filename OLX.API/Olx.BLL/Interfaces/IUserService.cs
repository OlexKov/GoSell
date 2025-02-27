using Olx.BLL.DTOs;
using Olx.BLL.Models.Page;
using Olx.BLL.Models.User;

namespace Olx.BLL.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<OlxUserDto>> Get(bool isAdmin = false);
        Task<IEnumerable<OlxUserDto>> GetLocked();
        Task<OlxUserDto> Get(int id, bool isAdmin = false);
        Task<PageResponse<OlxUserDto>> Get(UserPageRequest userPageRequest);
    }
}
