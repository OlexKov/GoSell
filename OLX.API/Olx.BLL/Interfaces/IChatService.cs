using Olx.BLL.DTOs.Chat;
using Olx.BLL.Entities.ChatEntities;
using Olx.BLL.Models.Chat;

namespace Olx.BLL.Interfaces
{
    public interface IChatService
    {
        Task SetMessegesReadedAsync(IEnumerable<int> messagesIds, int chatId);
        Task<Chat> CreateAsync(int advertId,string? message = null);
        Task SendMessageAsync(int chatId, string message);
        Task<IEnumerable<ChatDto>> GetUserChatsAsync(int? advertId);
        Task<IEnumerable<ChatMessageDto>> GetChatMessagesAsync(int chatId);
        Task RemoveForUserAsync(int chatId);
        Task RemoveForUserAsync(IEnumerable<int> chatIds);
        Task RemoveAsync(int chatId);
        Task RemoveAsync(IEnumerable<int> chatIds);
    }
}
