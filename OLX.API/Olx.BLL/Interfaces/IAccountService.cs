using Olx.BLL.DTOs;
using Olx.BLL.Models;
using Olx.BLL.Models.Authentication;
using Olx.BLL.Models.User;

namespace Olx.BLL.Interfaces
{
    public interface IAccountService
    {
        Task SendEmailConfirmationMessageAsync(string email);
        Task<AuthResponse> LoginAsync(AuthRequest model);
        Task<AuthResponse> GoogleLoginAsync(string googleAccessToken);
        Task LogoutAsync(string token);
        Task<AuthResponse> RefreshTokensAsync(string refreshToken);
        Task EmailConfirmAsync(EmailConfirmationModel confirmationModel);
        Task FogotPasswordAsync(string email);
        Task ResetPasswordAsync(ResetPasswordModel resetPasswordModel);
        Task BlockUserAsync(UserBlockModel userBlockModel);
        Task AddUserAsync(UserCreationModel userModel,bool isAdmin = false);
        Task RemoveAccountAsync(int id);
        Task<string> EditUserAsync(UserEditModel userEditModel,bool isAdmin = false);
        Task AddToFavoritesAsync(int advertId);
        Task RemoveFromFavoritesAsync(int advertId);
        Task<IEnumerable<AdvertDto>> GetFavoritesAsync();
    }
}
