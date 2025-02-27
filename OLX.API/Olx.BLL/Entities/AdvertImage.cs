using System.ComponentModel.DataAnnotations.Schema;

namespace Olx.BLL.Entities
{
    [Table("tbl_AdvertImages")]
    public class AdvertImage : BaseNamedEntity
    {
        public int? AdvertId { get; set; }
        public Advert? Advert { get; set; }
        public int Priority { get; set; }
    }
}
