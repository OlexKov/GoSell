using Olx.BLL.Models.Page;

namespace Olx.BLL.Models.Advert
{
    public class AdvertPageRequest : PageRequest
    {
        public decimal PriceFrom { get; init; }
        public decimal PriceTo { get; init; }
        public string? Search { get; init; }
        public string? CategorySearch { get; init; }
        public string? PhoneSearch { get; init; }
        public string? EmailSearch { get; init; }
        public string? SettlementSearch { get; init; }
        public string? SettlementRef { get; init; }
        public string? RegionRef { get; init; }
        public string? AreaRef { get; init; }
        public bool? IsContractPrice { get; init; } 
        public bool? Approved { get; init; } 
        public bool? Blocked { get; init; }
        public bool? Archived { get; init; }
        public IEnumerable<int>? CategoryIds { get; init; }
        public IEnumerable<IEnumerable<int>>? Filters { get; init; }
    }
}
