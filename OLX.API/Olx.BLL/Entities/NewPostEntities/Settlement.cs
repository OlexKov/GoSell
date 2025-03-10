using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Olx.BLL.Entities.NewPost
{
    [Table("tbl_Settlements")]
    public class Settlement : NewPostBaseEntity
    {
        [StringLength(100)]
        public string SettlementTypeDescription { get; set; } = string.Empty;

        [StringLength(36)]
        [Unicode(false)]
        public string? Region { get; set; }
        public int Warehouse { get; set; }
        public Region? SettlementRegion { get; set; }
        public ICollection<OlxUser> Users { get; set; } = new HashSet<OlxUser>();
        public ICollection<Advert> Adverts { get; set; } = new HashSet<Advert>();
    }
}
