using System.ComponentModel.DataAnnotations.Schema;

namespace Olx.BLL.Entities.ChatEntities
{
    [Table("tbl_Chats")]
    public class Chat : BaseEntity
    {
        public int AdvertId { get; set; }
        public int BuyerId { get; set; }
        public int SellerId { get; set; }
        public Advert Advert { get; set; }
        public OlxUser Buyer { get; set; }
        public OlxUser Seller { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
        public bool IsDeletedForBuyer { get; set; } = false;
        public bool IsDeletedForSeller { get; set; } = false;
        public ICollection<ChatMessage> Messages { get; set; } = new HashSet<ChatMessage>();
    }
}

