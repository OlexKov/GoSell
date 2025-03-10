using Olx.BLL.DTOs.NewPost;
using Olx.BLL.Entities.NewPost;

namespace Olx.BLL.Interfaces
{
    public interface INewPostService : IDisposable
    {
        Task<IEnumerable<Area>> GetAreasDataAsync() ;
        Task<IEnumerable<Settlement>> GetSettlementsDataAsync(IEnumerable<Region> regions);
        Task<IEnumerable<Region>> GetRegionsDataAsync(IEnumerable<string> areaRefs);
        Task<IEnumerable<AreaDto>> GetAreasAsync();
        Task<IEnumerable<WarehousDto>> GetWarehousesBySettlementAsync(string settlementRef);
        Task<IEnumerable<SettlementDto>> GetSettlementsByRegionAsync(string regionRef);
        Task<IEnumerable<RegionDto>> GetRegionsAsync();
        Task<IEnumerable<RegionDto>> GetRegionsByAreaAsync(string areaRef);
        Task<SettlementDto> GetSettlement(string settlementRef);
        Task UpdateNewPostData();
    }
}
