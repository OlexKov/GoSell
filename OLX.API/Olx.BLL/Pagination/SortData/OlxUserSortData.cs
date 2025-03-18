using Olx.BLL.DTOs.OlxUserDtos;
using Olx.BLL.Pagination.Interfaces;
using System.Linq.Expressions;

namespace Olx.BLL.Pagination.SortData
{
    public class OlxUserSortData(bool descending, string? sortKey) : IPaginationSortData<OlxUserDto>
    {
        public IQueryable<OlxUserDto> Sort(IQueryable<OlxUserDto> query)
        {
            Expression<Func<OlxUserDto, object?>>? sortExpr =
                 sortKey switch
                 {
                     "id" => x => x.Id,
                     "email" => x => x.Email,
                     "emailConfirmed" => x => x.EmailConfirmed,
                     "phoneNumberConfirmed" => x => x.PhoneNumberConfirmed,
                     "twoFactorEnabled" => x => x.TwoFactorEnabled,
                     "phoneNumber" => x => x.PhoneNumber,
                     "firstName" => x => x.FirstName,
                     "lastName" => x => x.LastName,
                     "createdDate" => x => x.CreatedDate,
                     "lastActivity" => x => x.LastActivity,
                     "settlementRef" => x => x.SettlementRef,
                     "advertCount" => x => x.Adverts.Count(),
                     _ => x => x.Id,
                 };
            return descending ? query.OrderByDescending(sortExpr) : query.OrderBy(sortExpr);
        }
    }
}
