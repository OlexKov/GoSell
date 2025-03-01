using Ardalis.Specification;
using Olx.BLL.Entities.ChatEntities;

namespace Olx.BLL.Specifications
{
    public static class ChatSpecs
    {
        private static void SetOptions(ISpecificationBuilder<Chat> query, ChatOpt? options)
        {
            if (options is not null)
            {
                foreach (ChatOpt option in Enum.GetValues(typeof(ChatOpt)))
                {
                    if (options.Value.HasFlag(option))
                    {
                        switch(option)
                        {
                            case ChatOpt.Messages_Sender: query.Include(x => x.Messages).ThenInclude(x => x.Sender); break;
                            case ChatOpt.Advert_Images: query.Include(x => x.Advert).ThenInclude(x => x.Images); break;
                            case ChatOpt.Buyer: query.Include(x => x.Buyer); break;
                            case ChatOpt.NoTracking: query.AsNoTracking(); break;
                            case ChatOpt.Advert: query.Include(x => x.Advert); break;
                            case ChatOpt.Messages: query.Include(x => x.Messages); break;
                        };
                    }
                }
            }
        }
        public class GetById : Specification<Chat>
        {
            public GetById(int id, ChatOpt? options = null)
            {
                SetOptions(Query,options);
                Query.Where(x => x.Id == id);
            }
        }

        public class FindExisting : Specification<Chat>
        {
            public FindExisting(int advertId,int userId, ChatOpt? options = null)
            {
                SetOptions(Query, options);
                Query.Where(x => x.Advert.Id == advertId && (x.Buyer.Id == userId || x.Seller.Id == userId));
            }
        }

        public class GetUserChats : Specification<Chat>
        {
            public GetUserChats(int userId, ChatOpt? options = null)
            {
                SetOptions(Query, options);
                Query.Where(x => x.Buyer.Id == userId || x.Seller.Id == userId);
            }
        }

        public class GetByIds : Specification<Chat>
        {
            public GetByIds(IEnumerable<int> ids, ChatOpt? options = null)
            {
                SetOptions(Query, options);
                Query.Where(x => ids.Contains(x.Id));
            }
        }

    }
}
