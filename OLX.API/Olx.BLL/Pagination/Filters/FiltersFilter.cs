using Olx.BLL.DTOs.FilterDtos;
using Olx.BLL.Pagination.Interfaces;

namespace Olx.BLL.Pagination.Filters
{
    public class FiltersFilter(string? searchString) : IPaginationFilter<FilterDto>
    {
        public IQueryable<FilterDto> FilterQuery(IQueryable<FilterDto> query)
        {
            if (!string.IsNullOrWhiteSpace(searchString))
            {
                query = query.Where(x => x.Name.ToLower().Contains(searchString.ToLower()));
            }

            return query;
        }
    }
}
