﻿
using Olx.BLL.DTOs;
using Olx.BLL.Entities;
using Olx.BLL.Pagination.Interfaces;
using System.Linq.Expressions;

namespace Olx.BLL.Pagination.SortData
{
    public class OlxUserSortData(bool descending, int sortIndex) : IPaginationSortData<OlxUserDto>
    {
        public IQueryable<OlxUserDto> Sort(IQueryable<OlxUserDto> query)
        {
            Expression<Func<OlxUserDto, object?>>? sortExpr =
                 sortIndex switch
                 {
                     1 => x => x.Id,
                     2 => x => x.Email,
                     3 => x => x.EmailConfirmed,
                     4 => x => x.PhoneNumberConfirmed,
                     5 => x => x.TwoFactorEnabled,
                     6 => x => x.PhoneNumber,
                     7 => x => x.FirstName,
                     8 => x => x.LastName,
                     9 => x => x.LastName,
                     10 => x => x.CreatedDate,
                     11 => x => x.LastActivity,
                     12 => x => x.SettlementRef,
                     _ => x => x.Id,
                 };
            return descending ? query.OrderByDescending(sortExpr) : query.OrderBy(sortExpr);
        }
    }
}
