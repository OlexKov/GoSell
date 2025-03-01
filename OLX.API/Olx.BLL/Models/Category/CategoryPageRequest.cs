using Olx.BLL.Models.Page;

namespace Olx.BLL.Models.Category
{
    public class CategoryPageRequest : PageRequest
    {
        public string? SearchName { get; init; }
        public string? ParentName { get; init; }
    }
}
