using Ardalis.Specification;
using Olx.BLL.Entities.NewPost;

namespace Olx.BLL.Specifications
{
    public static class NewPostDataSpecs
    {
        public class GetAreas : Specification<Area>
        {
            public GetAreas(bool tracking = false)
            {
                Query.Include(x => x.Regions)
                    .AsTracking(tracking);
            }
        }

        public class GetRegions : Specification<Region>
        {
            public GetRegions(bool tracking = false)
            {
                Query.AsTracking(tracking);
            }
        }

        public class GetSettlements : Specification<Settlement>
        {
            public GetSettlements(bool tracking = false)
            {
                Query.AsTracking(tracking);
            }
        }

        public class GetRegionsByArea : Specification<Region>
        {
            public GetRegionsByArea(string areaRef)
            {
                Query.AsNoTracking()
                    .Where(x => x.AreaRef == areaRef);
            }
        }

       
        public class GetSettlementsByRegion : Specification<Settlement>
        {
            public GetSettlementsByRegion(string regionRef)
            {
                Query.AsNoTracking()
                    .Where(x => x.Region == regionRef);
            }
        }

    }
}
