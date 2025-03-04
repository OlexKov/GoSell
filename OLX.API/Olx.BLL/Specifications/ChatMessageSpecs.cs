

using Ardalis.Specification;
using Olx.BLL.Entities.ChatEntities;

namespace Olx.BLL.Specifications
{
    public static class ChatMessageSpecs
    {
        public class GetMesssegesById : Specification<ChatMessage>
        {
            public GetMesssegesById(IEnumerable<int> messegeIsd,bool tracking = false)  =>
             Query.Where(x=>messegeIsd.Contains(x.Id))
                .AsTracking(tracking);
        }
    }
}
