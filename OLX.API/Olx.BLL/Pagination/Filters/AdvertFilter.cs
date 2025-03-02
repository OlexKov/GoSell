using Olx.BLL.DTOs.AdvertDtos;
using Olx.BLL.Pagination.Interfaces;

namespace Olx.BLL.Pagination.Filters
{
    public class AdvertFilter : IPaginationFilter<AdvertDto>
    {
        public decimal PriceFrom { get; init; }
        public decimal PriceTo { get; init; }
        public string? Search { get; init; }
        public bool? IsContractPrice { get; init; }
        public bool? Approved { get; init; }
        public bool? Blocked { get; init; }
        public bool? Completed { get; init; }
        public string? CategorySearch { get; init; }
        public string? PhoneSearch { get; init; }
        public string? EmailSearch { get; init; }
        public string? SettlementSearch { get; init; }
        public string? SettlementRef { get; init; }
        public string? RegionRef { get; init; }
        public string? AreaRef { get; init; }
        public IEnumerable<int>? CategoryIds { get; init; }
        public IEnumerable<IEnumerable<int>>? Filters { get; init; }
        public IQueryable<AdvertDto> FilterQuery(IQueryable<AdvertDto> query)
        {
            if (CategoryIds is not null && CategoryIds.Any())
            {
                query = query.Where(x => CategoryIds.Any(z => z == x.CategoryId));
            }

            if (Filters is not null && Filters.Any())
            {
                foreach (var filter in Filters) 
                {
                    query = query.Where(x => filter.Any(z => x.FilterValues.Any(y => y.Id == z)));
                }
            }

            if (PriceFrom > 0)
            {
                query = query.Where(x => x.Price >= PriceFrom);
            }

            if (PriceTo > PriceFrom)
            {
                query = query.Where(x => x.Price <= PriceTo);
            }
            if (!String.IsNullOrWhiteSpace(Search))
            {
                query = query.Where(x => x.Title.ToLower().Contains(Search.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(CategorySearch))
            {
                query = query.Where(x => x.CategoryName.ToLower().Contains(CategorySearch.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(PhoneSearch))
            {
                query = query.Where(x => x.PhoneNumber.Contains(PhoneSearch));
            }
            if (!String.IsNullOrWhiteSpace(EmailSearch))
            {
                query = query.Where(x => x.ContactEmail.ToLower().Contains(EmailSearch.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(SettlementSearch))
            {
                query = query.Where(x => x.SettlementName.ToLower().Contains(SettlementSearch.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(SettlementRef))
            {
                query = query.Where(x => x.SettlementRef == SettlementRef);
            }
            if (!String.IsNullOrWhiteSpace(RegionRef))
            {
                query = query.Where(x => x.RegionRef == RegionRef);
            }
            if (!String.IsNullOrWhiteSpace(AreaRef))
            {
                query = query.Where(x => x.AreaRef == AreaRef);
            }
            if (IsContractPrice.HasValue)
            {
                query = query.Where(x => x.IsContractPrice == IsContractPrice);
            }
            if (Approved.HasValue)
            {
                query = query.Where(x => x.Approved == Approved);
            }
            if (Blocked.HasValue)
            {
                query = query.Where(x => x.Blocked == Blocked);
            }
            if (Completed.HasValue)
            {
                query = query.Where(x => x.Completed == Completed);
            }

            return query;
        }
    }
}
