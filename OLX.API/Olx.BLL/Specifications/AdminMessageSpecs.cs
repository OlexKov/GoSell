using Ardalis.Specification;
using Olx.BLL.Entities.AdminMessages;

namespace Olx.BLL.Specifications
{
    public static class AdminMessageSpecs 
    {
        public class GetMessagesForAdmin : Specification<AdminMessage>
        {
            public GetMessagesForAdmin(bool tracking = false) =>
                Query.Where(x => x.User == null && !x.Deleted)
                     .AsTracking(tracking)
                     .Include(x => x.Message);
        }

        public class GetMessagesForUser : Specification<AdminMessage>
        {
            public GetMessagesForUser(int userId,bool tracking = false) =>
                Query.Where(x => x.User != null && !x.Deleted && x.User.Id == userId)
                     .AsTracking(tracking)
                     .Include(x => x.Message);
        }

        public class GetMessagesForUserByIds : Specification<AdminMessage>
        {
            public GetMessagesForUserByIds(IEnumerable<int> userIds, bool tracking = false) =>
                Query.Where(x => x.User != null && !x.Deleted && userIds.Contains(x.Id))
                     .AsTracking(tracking)
                     .Include(x => x.Message);
        }

        public class GetById : Specification<AdminMessage>
        {
            public GetById(int? id,bool tracking = false) =>
                Query.Where(x => x.Id == id  && !x.Deleted)
                     .AsTracking(tracking)
                     .Include(x => x.Message);
        }

        public class GetUnreadedById : Specification<AdminMessage>
        {
            public GetUnreadedById(int? userId, int messageId, bool tracking = false) =>
                Query.Where(x => x.Id == messageId &&  (x.UserId == userId) && !x.Readed && !x.Deleted)
                     .AsTracking(tracking)
                     .Include(x => x.Message);
        }

        public class GetUnreadedByIds : Specification<AdminMessage>
        {
            public GetUnreadedByIds(int? userId, IEnumerable<int> messageIds, bool tracking = false) =>
                Query.Where(x => messageIds.Contains(x.Id) && (x.UserId == userId) && !x.Readed && !x.Deleted)
                     .AsTracking(tracking)
                     .Include(x => x.Message);
        }


        public class GetDeleted : Specification<AdminMessage>
        {
            public GetDeleted(bool tracking = false) =>
                Query.Where(x => x.Deleted)
                     .AsTracking(tracking)
                     .Include(x => x.Message);
        }

        public class GetDeletedExpDay : Specification<AdminMessage>
        {
            public GetDeletedExpDay(int expDays, bool tracking = false) =>
                Query.Where(x => x.Deleted && x.Created.AddDays(expDays) >= DateTime.UtcNow)
                     .AsTracking(tracking);
                     
        }

    }
}
