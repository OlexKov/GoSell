using Olx.BLL.DTOs.CategoryDtos;
using Olx.BLL.Pagination.Interfaces;
using System.Linq.Expressions;

namespace Olx.BLL.Pagination.SortData
{
    public class CategorySortData(bool descending,string? sortKey) : IPaginationSortData<CategoryDto>
    {
        public IQueryable<CategoryDto> Sort(IQueryable<CategoryDto> query)
        {
            Expression<Func<CategoryDto, object?>>? sortExpr =
                sortKey switch
                {
                    "id" => x => x.Id,
                    "name" => x => x.Name,
                    "parentName" => x => x.ParentName,
                    _ => x => x.Id,
                };
            return descending ? query.OrderByDescending(sortExpr) : query.OrderBy(sortExpr);
        }
    }
}
