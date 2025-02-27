using Olx.BLL.DTOs.CategoryDtos;
using Olx.BLL.Pagination.Interfaces;

namespace Olx.BLL.Pagination.Filters
{
    public class CategoryFilter(string? searchName,string? parentName) : IPaginationFilter<CategoryDto>
    {
        public IQueryable<CategoryDto> FilterQuery(IQueryable<CategoryDto> query)
        {
            if (!String.IsNullOrWhiteSpace(searchName))
            {
                query = query.Where(x => x.Name.ToLower().Contains(searchName.ToLower()));
            }

            if (!String.IsNullOrWhiteSpace(parentName))
            {
                query = query.Where(x => x.ParentName != null && x.ParentName.ToLower().Contains(parentName.ToLower()));
            }

            return query;
        }
    }
}
