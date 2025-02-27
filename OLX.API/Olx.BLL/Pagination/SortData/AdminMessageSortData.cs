using Olx.BLL.DTOs.AdminMessage;
using Olx.BLL.Pagination.Interfaces;


namespace Olx.BLL.Pagination.SortData
{
    public class AdminMessageSortData : IPaginationSortData<AdminMessageDto>
    {
        public IQueryable<AdminMessageDto> Sort(IQueryable<AdminMessageDto> query)
        {
            return query.OrderBy(x => x.Readed).ThenByDescending(x => x.Created);
        }
    }
}
