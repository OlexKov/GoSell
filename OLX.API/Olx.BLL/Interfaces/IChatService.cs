using Olx.BLL.DTOs.Chat;
using Olx.BLL.Entities.ChatEntities;

namespace Olx.BLL.Interfaces
{
    public interface IChatService
    {
        Task<Chat> CreateAsync(int advertId,string? message = null);
        Task SendMessageAsync(int chatId, string message);
        Task<IEnumerable<ChatDto>> GetUserChatsAsync(int? advertId);
        Task<IEnumerable<ChatMessageDto>> GetChatMessagesAsync(int chatId);
        Task RemoveForUserAsync(int chatId);
        Task RemoveForUserAsync(IEnumerable<int> chatIds);
        Task Remove(int chatId);
        Task Remove(IEnumerable<int> chatIds);
    }
}
