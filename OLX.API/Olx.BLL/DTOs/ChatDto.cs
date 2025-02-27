
namespace Olx.BLL.DTOs
{
    public class ChatDto
    {
        public int Id { get; set; }
        public int AdvertId { get; set; }
        public int BuyerId { get; set; }
        public int SellerId { get; set; }
        public string AdvertImage { get; set; } = string.Empty;
        public string BuyerName { get; set; } = string.Empty;
        public string SellerName { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
    }
}
