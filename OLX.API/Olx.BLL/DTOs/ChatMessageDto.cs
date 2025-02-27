
namespace Olx.BLL.DTOs
{
    public class ChatMessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public int SenderId { get; set; }
        public int SenderName { get; set; }
        public int ChatId { get; set; }
        public bool Readed { get; set; }
    }
}
