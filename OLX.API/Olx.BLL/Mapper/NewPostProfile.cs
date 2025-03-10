
using AutoMapper;
using Olx.BLL.DTOs.NewPost;
using Olx.BLL.Entities.NewPost;

namespace Olx.BLL.Mapper
{
    public class NewPostProfile : Profile
    {
        public NewPostProfile()
        {
            CreateMap<Area, Area>();
            CreateMap<Area, AreaDto>()
                .ForMember(x => x.Regions, opt => opt.MapFrom(z => z.Regions.Select(y => y.Ref)));
            CreateMap<Settlement, SettlementDto>()
                .ForMember(x => x.Area, opt => opt.MapFrom(x => x.SettlementRegion != null ? x.SettlementRegion.AreaRef : null));
            CreateMap<Region, RegionDto>();
        }
    }
}
