using Olx.BLL.Entities;
using System.Security.Claims;

namespace Olx.BLL.Interfaces
{
    public interface IJwtService
    {
        Task<IEnumerable<Claim>> GetClaimsAsync(OlxUser user);
        string CreateToken(IEnumerable<Claim> claims);
        string GetRefreshToken();
        int GetRefreshTokenLiveTime();
    }
}
