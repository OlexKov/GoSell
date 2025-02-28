using AutoMapper;
using Olx.BLL.DTOs.AdvertDtos;
using Olx.BLL.Entities;
using Olx.BLL.Models.Advert;

namespace Olx.BLL.Mapper
{
    public class AdvertProfile :Profile
    {
        public AdvertProfile()
        {
            CreateMap<AdvertCreationModel,Advert>();
            CreateMap<Advert, ShortAdvertDto>()
                .ForMember(x => x.Image, opt => opt.MapFrom(z => z.Images.First(y => y.Priority == 0).Name));
            CreateMap<Advert, AdvertDto>()
                .ForMember(x => x.SettlementName, opt => opt.MapFrom(x => x.Settlement.Description))
                .ForMember(x => x.SettlementRef, opt => opt.MapFrom(x => x.Settlement.Ref))
                .ForMember(x => x.RegionRef, opt => opt.MapFrom(x => x.Settlement.Region))
                .ForMember(x => x.AreaRef, opt => opt.MapFrom(x => x.Settlement.SettlementRegion.AreaRef))
                .ForMember(x => x.CategoryName, opt => opt.MapFrom(x => x.Category.Name));
        }
    }
}
