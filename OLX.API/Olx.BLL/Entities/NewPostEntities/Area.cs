using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Olx.BLL.Entities.NewPost
{
    [Table("tbl_Areas")]
    public class Area : NewPostBaseEntity
    {
        [StringLength(50)]
        public string RegionType { get; set; }
        public ICollection<Region> Regions { get; set; } = new HashSet<Region>();
    }
}
