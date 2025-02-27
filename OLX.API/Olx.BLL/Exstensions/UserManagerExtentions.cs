using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Olx.BLL.Entities;
using Olx.BLL.Exceptions;
using Olx.BLL.Resources;
using System.Net;

namespace Olx.BLL.Exstensions
{
    public static class UserManagerExtentions
    {
        public static async Task<OlxUser> UpdateUserActivityAsync(this UserManager<OlxUser> userManager,IHttpContextAccessor httpContext,bool save = true)
        {
            var currentUser = await userManager.GetUserAsync(httpContext.HttpContext?.User!)
              ?? throw new HttpException(Errors.ErrorAthorizedUser, HttpStatusCode.InternalServerError);
            currentUser.LastActivity = DateTime.UtcNow;
            if (save)
            {
                await userManager.UpdateAsync(currentUser);
            }
            return currentUser;
        }
    }
}
