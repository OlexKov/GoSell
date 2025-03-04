using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Chat;

namespace OLX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController(IChatService chatService ) : ControllerBase
    {
        [Authorize(Roles = Roles.User)]
        [HttpGet("chats")]
        public async Task<IActionResult> GetChats([FromQuery] int? advertId) => Ok(await chatService.GetUserChatsAsync(advertId));

        [Authorize(Roles = Roles.User)]
        [HttpGet("messages/{chatId:int}")]
        public async Task<IActionResult> GetChatsMessages([FromRoute]int chatId) => Ok(await chatService.GetChatMessagesAsync(chatId));

        [Authorize(Roles = Roles.User)]
        [HttpPost("send")]
        public async Task<IActionResult> Send([FromBody] ChatMessageSendModel sendModel)
        {
            await chatService.SendMessageAsync(sendModel.ChatId, sendModel.Message);
            return Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpPost("set/readed")]
        public async Task<IActionResult> SetReaded([FromBody]IEnumerable<int> messegesIds)
        {
            await chatService.SetMessegesReadedAsync(messegesIds);
            return Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpPut("create")]
        public async Task<IActionResult> Create([FromBody] ChatCreationModel creationModel)
        {
            await chatService.CreateAsync(creationModel.AdvertId,creationModel.Message);
            return Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpDelete("user/delete/{chatId:int}")]
        public async Task<IActionResult> RemoveForUser([FromRoute] int chatId)
        {
            await chatService.RemoveForUserAsync(chatId);
            return Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpDelete("user/delete")]
        public async Task<IActionResult> RemoveForUser([FromBody] IEnumerable<int> chatId)
        {
            await chatService.RemoveForUserAsync(chatId);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("delete")]
        public async Task<IActionResult> RemoveAsync([FromBody] IEnumerable<int> chatId)
        {
            await chatService.RemoveAsync(chatId);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("delete/{chatId:int}")]
        public async Task<IActionResult> RemoveAsync([FromRoute] int chatId)
        {
            await chatService.RemoveForUserAsync(chatId);
            return Ok();
        }
    }
}
