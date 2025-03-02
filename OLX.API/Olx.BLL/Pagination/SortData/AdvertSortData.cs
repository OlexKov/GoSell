using Olx.BLL.DTOs.AdvertDtos;
using Olx.BLL.Pagination.Interfaces;
using System.Linq.Expressions;

namespace Olx.BLL.Pagination.SortData
{
    public class AdvertSortData (bool descending,string sortKey) : IPaginationSortData<AdvertDto>
    {
        public IQueryable<AdvertDto> Sort(IQueryable<AdvertDto> query)
        {
            Expression<Func<AdvertDto, object?>>? sortExpr =
                sortKey switch
                {
                    "id" => x => x.Id,
                    "price" => x => x.Price,
                    "date" => x => x.Date,
                    "categoryName" => x => x.CategoryName,
                    "phoneNumber" => x => x.PhoneNumber,
                    "contactEmail" => x => x.ContactEmail,
                    "settlementName" => x => x.SettlementName,
                    "title" => x => x.Title,
                    _ => x => x.Id,
                };
            return descending ? query.OrderByDescending(sortExpr) : query.OrderBy(sortExpr);
        }
    }
}
