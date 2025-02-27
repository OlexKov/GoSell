using Ardalis.Specification;
using Olx.BLL.Entities.FilterEntities;

namespace Olx.BLL.Specifications
{
    public static class FilterValueSpecs
    {
        public class GetByIds : Specification<FilterValue>
        {
            public GetByIds(IEnumerable<int> ids, bool tracking = false) =>
                Query.Where(x => ids.Contains(x.Id))
                     .AsTracking(tracking);
        }
        public class GetAll : Specification<FilterValue>
        {
            public GetAll(bool tracking = false) =>
                Query.AsTracking(tracking);
        }
    }
}
