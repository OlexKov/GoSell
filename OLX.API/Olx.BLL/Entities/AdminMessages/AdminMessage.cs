
using System.ComponentModel.DataAnnotations.Schema;

namespace Olx.BLL.Entities.AdminMessages
{
    [Table("tbl_AdminMessages")]
    public class AdminMessage : BaseEntity
    {
        public OlxUser? User { get; set; }
        public int? UserId { get; set; }
        public bool Readed { get; set; }
        public bool Deleted { get; set; }
        public Message Message { get; set; }
        public int MessageId { get; set; }
        public string? MessageLogo { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
    }
}
