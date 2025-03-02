using Olx.BLL.DTOs.OlxUserDtos;

namespace Olx.BLL.DTOs.Chat
{
    public class ChatMessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public ChatOlxUserDto Sender { get; set; }
        public int ChatId { get; set; }
        public bool Readed { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
