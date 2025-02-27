using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Olx.BLL.Entities.FilterEntities
{
    [Table("tbl_FilterValues")]
    public class FilterValue : BaseEntity
    {
        [StringLength(100)]
        public string Value { get; set; } = string.Empty;
        public int FilterId { get; set; }
        public Filter Filter { get; set; }
        public ICollection<Advert> Adverts { get; set; } = new HashSet<Advert>();
    }
}
