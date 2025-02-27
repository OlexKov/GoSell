using Olx.BLL.Models.Page;

namespace Olx.BLL.Models.AdminMessageModels
{
    public class AdminMessagePageRequest : PageRequest 
    {
        public bool? Readed { get; set; }
        public bool? Deleted { get; set; }
    }
}
