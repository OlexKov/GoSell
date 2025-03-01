using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Olx.BLL.Entities.NewPost
{
    [Table("tbl_Warehouses")]
    public class Warehous : NewPostBaseEntity
    {
        public string Phone { get; set; } = string.Empty;

        [StringLength(36)]
        [Unicode(false)]
        public string SettlementRef { get; set; }
        public Settlement Settlement { get; set; }
    }
}
