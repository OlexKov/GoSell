using Olx.BLL.DTOs.FilterDtos;
using Olx.BLL.Pagination.Interfaces;
using System.Linq.Expressions;

namespace Olx.BLL.Pagination.SortData
{
    public class FilterSortData(bool descending, string sortKey) : IPaginationSortData<FilterDto>
    {
        public IQueryable<FilterDto> Sort(IQueryable<FilterDto> query)
        {
            Expression<Func<FilterDto, object?>>? sortExpr =
                sortKey switch
                {
                    "id" => x => x.Id,
                    "name" => x => x.Name,
                    _ => x => x.Id,
                };
            return descending ? query.OrderByDescending(sortExpr) : query.OrderBy(sortExpr);
        }
    }
}
