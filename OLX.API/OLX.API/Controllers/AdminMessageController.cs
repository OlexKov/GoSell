using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.AdminMessage;
using Olx.BLL.Models.AdminMessageModels;

namespace OLX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminMessageController(IAdminMessageService adminMessageService) : ControllerBase
    {
        [Authorize]
        [HttpGet("get/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id) => Ok(await adminMessageService.GetById(id));

        [Authorize(Roles = Roles.Admin)]
        [HttpGet("get/admin")]
        public async Task<IActionResult> GetAdminMessages() => Ok(await adminMessageService.GetAdminMessages());

        [Authorize(Roles = Roles.User)]
        [HttpGet("get/user")]
        public async Task<IActionResult> GetUserMessages() => Ok(await adminMessageService.GetUserMessages(null));

        [Authorize(Roles = Roles.User)]
        [HttpGet("get/user/unreaded")]
        public async Task<IActionResult> GetUserUnreadedMessages() => Ok(await adminMessageService.GetUserMessages(true));

        [Authorize(Roles = Roles.Admin)]
        [HttpGet("get/deleted")]
        public async Task<IActionResult> Getdeleted() => Ok(await adminMessageService.GetDeleted());

        [Authorize]
        [HttpPost("get/page")]
        public async Task<IActionResult> GetPage([FromBody] AdminMessagePageRequest pageRequest) => Ok(await adminMessageService.GetPageAsync(pageRequest));

        [Authorize]
        [HttpPost("readed/set/{messageId:int}")]
        public async Task<IActionResult> SetReaded([FromRoute] int messageId)
        {
            await adminMessageService.SetReaded(messageId);
            return Ok();
        }

        [Authorize]
        [HttpPost("readed/set")]
        public async Task<IActionResult> SetReadedRange([FromBody] IEnumerable<int> messageIds)
        {
            await adminMessageService.SetReaded(messageIds);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPut("create/admin")]
        public async Task<IActionResult> AdminCreate([FromBody] AdminMessageCreationModel messageCreationModel) => Ok(await adminMessageService.AdminCreate(messageCreationModel));

        [Authorize(Roles = Roles.User)]
        [HttpPut("create/user")]
        public async Task<IActionResult> UserCreate([FromBody] AdminMessageCreationModel messageCreationModel) => Ok(await adminMessageService.UserCreate(messageCreationModel));

        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("delete/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            await adminMessageService.Delete(id);
            return Ok();
        }

        [Authorize]
        [HttpDelete("delete/soft/{id:int}")]
        public async Task<IActionResult> SoftDelete([FromRoute] int id)
        {
            await adminMessageService.SoftDelete(id);
            return Ok();
        }

        [Authorize]
        [HttpDelete("delete/soft")]
        public async Task<IActionResult> SoftDeleteRenge([FromBody] IEnumerable<int> ids)
        {
            await adminMessageService.SoftDeleteRange(ids);
            return Ok();
        }

    }
}
