using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Olx.BLL.Entities;
using Olx.BLL.Helpers;
namespace Olx.BLL.Hubs
{
    [Authorize]
    public class MessageHub(
        UserManager<OlxUser> userManager,
        ILogger<MessageHub> logger) : Hub
    {
        private async Task<bool> _isAdmin()
        {
            var userName = Context.User?.Identity?.Name
            ?? throw new Exception();
            var user = await userManager.FindByIdAsync(userName)
                ?? throw new Exception();
            return await userManager.IsInRoleAsync(user, Roles.Admin);
        }
        public async Task Connect()
        {
            if (await _isAdmin())
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
                logger.LogInformation("----------------- Admin SignalR connected ----------------------");
            }
            else
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "Users");
                logger.LogInformation("----------------- User  SignalR connected ----------------------");
            }

        }

        public async Task Disconnect()
        {
            if (await _isAdmin())
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Admins");
                logger.LogInformation("----------------- Admin SignalR disconnected ----------------------");
            }
            else
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Users");
                logger.LogInformation("----------------- User SignalR disconnected ----------------------");
            }

        }
    }
}
