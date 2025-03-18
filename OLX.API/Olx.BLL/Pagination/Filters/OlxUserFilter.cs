using Olx.BLL.DTOs.OlxUserDtos;
using Olx.BLL.Pagination.Interfaces;

namespace Olx.BLL.Pagination.Filters
{
    public class OlxUserFilter : IPaginationFilter<OlxUserDto>
    {
        public string? EmailSearch { get; init; }
        public string? PhoneNumberSearch { get; init; }
        public string? FirstNameSearch { get; init; }
        public string? LastNameSearch { get; init; }
        public string? WebSiteSearch { get; init; }
        public string? SettlementSearch { get; init; }

        public IQueryable<OlxUserDto> FilterQuery(IQueryable<OlxUserDto> query)
        {
            if (!String.IsNullOrWhiteSpace(EmailSearch))
            {
                query = query.Where(x => x.Email != null && x.Email.ToLower().Contains(EmailSearch.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(PhoneNumberSearch))
            {
                query = query.Where(x => x.PhoneNumber != null && x.PhoneNumber.ToLower().Contains(PhoneNumberSearch.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(FirstNameSearch))
            {
                query = query.Where(x => x.FirstName != null && x.FirstName.ToLower().Contains(FirstNameSearch.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(LastNameSearch))
            {
                query = query.Where(x => x.LastName != null && x.LastName.ToLower().Contains(LastNameSearch.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(WebSiteSearch))
            {
                query = query.Where(x => x.WebSite != null && x.WebSite.ToLower().Contains(WebSiteSearch.ToLower()));
            }
            if (!String.IsNullOrWhiteSpace(SettlementSearch))
            {
                query = query.Where(x => x.SettlementDescrption != null && x.SettlementDescrption.ToLower().Contains(SettlementSearch.ToLower()));
            }
            return query;
        }
    }
}
