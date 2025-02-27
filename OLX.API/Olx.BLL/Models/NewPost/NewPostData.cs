using Olx.BLL.Entities.NewPost;

namespace Olx.BLL.Models.NewPost
{
    public class NewPostData
    {
        public IEnumerable<Area> Areas = [];
        public IEnumerable<Settlement>  Settlements = [];
        public IEnumerable<Warehous> Warehous = [];
        public IEnumerable<Region> Regions = [];
    }
}
