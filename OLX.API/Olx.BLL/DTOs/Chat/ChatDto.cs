using Olx.BLL.DTOs.AdvertDtos;
using Olx.BLL.DTOs.OlxUserDtos;

namespace Olx.BLL.DTOs.Chat
{
    public class ChatDto
    {
        public int Id { get; set; }
        public ChatOlxUserDto Buyer { get; set; }
        public ChatOlxUserDto Seller { get; set; }
        public ShortAdvertDto Advert { get; set; }
        public int SellerUnreaded { get; set; }
        public int BuyerUnreaded { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
    }
}
