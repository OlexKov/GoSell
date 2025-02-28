using AutoMapper;
using Olx.BLL.DTOs.OlxUserDtos;
using Olx.BLL.Entities;
using Olx.BLL.Exstensions;
using Olx.BLL.Helpers;
using Olx.BLL.Models.User;
using Olx.BLL.Pagination.Filters;

namespace Olx.BLL.Mapper
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<OlxUser,ChatOlxUserDto>()
               .ForMember(x => x.Description, opt => opt.MapFrom(x => x.GetUserDescription()));

            CreateMap<UserCreationModel, OlxUser>()
                .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.Email));

            CreateMap<GoogleUserInfo, OlxUser>()
                .ForMember(x => x.FirstName, opt => opt.MapFrom(x => x.Given_Name))
                .ForMember(x => x.LastName, opt => opt.MapFrom(x => x.Family_Name))
                .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.Email))
                .ForMember(x => x.Email, opt => opt.MapFrom(x => x.Email))
                .ForMember(x => x.EmailConfirmed, opt => opt.MapFrom(x => x.Email_Verified));

            CreateMap<OlxUser, OlxUserDto>()
                .ForMember(x => x.SettlementDescrption, opt => opt.MapFrom(z => z.Settlement != null ? z.Settlement.Description : null))
                .ForMember(x => x.Adverts, opt => opt.MapFrom(z => z.Adverts.Select(y => y.Id)))
                .ForMember(x => x.FavoriteAdverts, opt => opt.MapFrom(z => z.FavoriteAdverts.Select(y => y.Id)));

            CreateMap<UserEditModel, OlxUser>();

            CreateMap<OlxUser, OlxUserShortDto>()
                 .ForMember(x => x.SettlementDescrption, opt => opt.MapFrom(z => z.Settlement != null ? z.Settlement.Description : null));

            CreateMap<UserPageRequest, OlxUserFilter>();
        }
    }
}
