using Olx.BLL.DTOs.AdminMessage;
using Olx.BLL.Pagination.Interfaces;


namespace Olx.BLL.Pagination.Filters
{
    public class AdminMessageFilter : IPaginationFilter<AdminMessageDto>
    {
        public bool? Readed { get; set; }
        public bool? Deleted { get; set; }
        public IQueryable<AdminMessageDto> FilterQuery(IQueryable<AdminMessageDto> query)
        {
            if (Readed.HasValue)
            {
                query = query.Where(x => x.Readed == Readed.Value);
            }
            if (Deleted.HasValue)
            {
                query = query.Where(x => x.Deleted == Deleted.Value);
            }

            return query;

        }
    }
}
