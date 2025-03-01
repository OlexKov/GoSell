using Ardalis.Specification;
using Olx.BLL.Entities.FilterEntities;

namespace Olx.BLL.Specifications
{
    public static class FilterSpecs
    {
        private static void SetOptions(ISpecificationBuilder<Filter> query, FilterOpt? options)
        {
            if (options is not null)
            {
                foreach (FilterOpt option in Enum.GetValues(typeof(FilterOpt)))
                {
                    if (options.Value.HasFlag(option))
                    {
                        switch(option)
                        {
                            case FilterOpt.Values: query.Include(x => x.Values); break;
                            case FilterOpt.NoTracking: query.AsNoTracking(); break;
                            case FilterOpt.Categories: query.Include(x => x.Categories); break;
                        };
                    }
                }
            }
        }
        public class GetByIds : Specification<Filter>
        {
            public GetByIds(IEnumerable<int> ids, FilterOpt? options = null)
            {
                SetOptions(Query, options);
                Query.Where(x => ids.Contains(x.Id));
            }
               
        }
        public class GetAll : Specification<Filter>
        {
            public GetAll(FilterOpt? options = null) => SetOptions(Query, options);
        }
        public class GetByNames : Specification<Filter>
        {
            public GetByNames(IEnumerable<string> names, FilterOpt? options = null)
            {
                SetOptions(Query, options);
                Query.Where(x => names.Contains(x.Name));
            }
        }
        public class GetById : Specification<Filter>
        {
            public GetById(int id, FilterOpt? options = null)
            {
                SetOptions(Query, options);
                Query.Where(x => x.Id == id);
            }
        }
    }
}
