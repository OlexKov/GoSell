using System.ComponentModel.DataAnnotations;

namespace Olx.BLL.Entities
{
    public class BaseNamedEntity : BaseEntity
    {
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
    }
}
