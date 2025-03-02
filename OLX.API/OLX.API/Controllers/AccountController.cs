using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;
using Olx.BLL.Models.Authentication;
using Olx.BLL.Models.User;


namespace OLX.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController(IAccountService accountService) : ControllerBase
    {
       // private readonly string _refreshTokenCookiesName = configuration["RefreshTokenCookiesName"]!;

        [Authorize(Roles = Roles.User)]
        [HttpGet("favorites")]
        public async Task<IActionResult> GetFavorites()
        {
            var favorites = await accountService.GetFavoritesAsync();
            return Ok(favorites);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest model )
        {
            var authResponse = await accountService.LoginAsync(model);
          //  SetHttpOnlyCookies(authResponse.RefreshToken);
            return Ok(authResponse);
        }

        [HttpPost("login/google")]
        public async Task<IActionResult> GoogleLogin([FromQuery] string googleAccessToken)
        {
            var authResponse = await accountService.GoogleLoginAsync(googleAccessToken);
           // SetHttpOnlyCookies(authResponse.RefreshToken);
            return Ok(authResponse);
        }

        [HttpPost("user/logout")]
        public async Task<IActionResult> LogOut([FromBody] LogoutModel? logoutModel)
        {
            //Console.WriteLine("Refresh token: " + logoutModel?.RefreshToken);
            //if (Request.Cookies.TryGetValue(_refreshTokenCookiesName, out var token))
            //{
            //    Response.Cookies.Delete(_refreshTokenCookiesName);
            //    await accountService.LogoutAsync(token);
            //}
            //else 
            if (logoutModel is not null && logoutModel.RefreshToken is not null)
            {
                await accountService.LogoutAsync(logoutModel.RefreshToken);
            }
            return Ok();
        }

        [HttpPost("user/refresh")]
        public async Task<IActionResult> RefreshTokens([FromBody] RefreshRequest? refreshRequest)
        {
            string token;
            //if (Request.Cookies.TryGetValue(_refreshTokenCookiesName, out var httpToken))
            //{
            //    token = httpToken;
            //}
            //else
            if (refreshRequest is not null && refreshRequest.RefreshToken is not null)
            {
                token = refreshRequest.RefreshToken;
            }
            else return Unauthorized();
            var authResponse = await accountService.RefreshTokensAsync(token);
            //SetHttpOnlyCookies(authResponse.RefreshToken);
            return Ok(authResponse);
        }

        [HttpPost("email/confirm")]
        public async Task<IActionResult> ConfirmEmail([FromBody] EmailConfirmationModel confirmationModel)
        {
            await accountService.EmailConfirmAsync(confirmationModel);
            return Ok();
        }

        [HttpPost("email/sendconfirm")]
        public async Task<IActionResult> SendConfirmEmail([FromQuery] string email)
        {
            await accountService.SendEmailConfirmationMessageAsync(email);
            return Ok();
        }

        [HttpPost("password/fogot")]
        public async Task<IActionResult> FogotPassword([FromQuery] string email)
        {
            await accountService.FogotPasswordAsync(email);
            return Ok();
        }

        [HttpPost("password/reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel resetPasswordModel)
        {
            await accountService.ResetPasswordAsync(resetPasswordModel);
            return Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpPost("edit/user")]
        public async Task<IActionResult> EditUser([FromForm] UserEditModel userEditModel)
        {
             var token = await accountService.EditUserAsync(userEditModel);
             return Ok( new UserEditResponse() { AccessToken = token} );
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("edit/admin")]
        public async Task<IActionResult> EditAdmin([FromForm] UserEditModel userEditModel)
        {
            var token = await accountService.EditUserAsync(userEditModel,true);
            return Ok(new UserEditResponse() { AccessToken = token });
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("block")]
        public async Task<IActionResult> BlockUser([FromBody] UserBlockModel userBlockModel)
        {
            await accountService.BlockUserAsync(userBlockModel);
            return Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpPost("favorites/add/{advertId:int}")]
        public async Task<IActionResult> AddToFavorites([FromRoute] int advertId)
        {
            await accountService.AddToFavoritesAsync(advertId);
            return Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpPost("favorites/add/range")]
        public async Task<IActionResult> AddToFavoritesRange([FromBody] IEnumerable<int> advertIds)
        {
            await accountService.AddToFavoritesRangeAsync(advertIds);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPut("register/admin")]
        public async Task<IActionResult> AddAdmin([FromForm] UserCreationModel adminModel)
        {
            await accountService.AddUserAsync(adminModel,true);
            return Ok();
        }

        [HttpPut("register/user")]
        public async Task<IActionResult> AddUser([FromForm] UserCreationModel userModel)
        {
            await accountService.AddUserAsync(userModel);
            return Ok();
        }
        
        [Authorize(Roles = Roles.User)]
        [HttpDelete("favorites/remove/{advertId:int}")]
        public async Task<IActionResult> RemoveFromFavorites([FromRoute] int advertId)
        {
            await accountService.RemoveFromFavoritesAsync(advertId);
            return Ok();
        }


        [Authorize]
        [HttpDelete("delete")]
        public async Task<IActionResult> RemoveAccount([FromQuery] int id)
        {
            await accountService.RemoveAccountAsync(id);
            return Ok();
        }

        //private void SetHttpOnlyCookies(string token)
        //{
        //    var days = double.Parse(configuration["JwtOptions:RefreshTokenLifeTimeInDays"]!);
        //    Response.Cookies.Append(_refreshTokenCookiesName, token, new CookieOptions
        //    {
        //        IsEssential = true,
        //        //  HttpOnly = true,
        //        //Domain = "localhost",
        //     //   SameSite = SameSiteMode.Strict,
        //     //   Secure = true,
        //        Path = "api/Account/user",
        //        Expires = DateTime.UtcNow.AddDays(days)
        //    });
        //}
    }
}
