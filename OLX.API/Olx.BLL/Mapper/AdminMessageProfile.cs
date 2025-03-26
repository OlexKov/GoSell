using AutoMapper;
using Olx.BLL.DTOs.AdminMessage;
using Olx.BLL.Entities.AdminMessages;
using Olx.BLL.Models.AdminMessage;
using Olx.BLL.Models.AdminMessageModels;
using Olx.BLL.Pagination.Filters;

namespace Olx.BLL.Mapper
{
    public class AdminMessageProfile : Profile
    {
        public AdminMessageProfile()
        {
            CreateMap<AdminMessagePageRequest, AdminMessageFilter>();
            CreateMap<AdminMessageCreationModel, AdminMessage>()
                 .ForMember(x => x.Message, opt => opt.MapFrom(x => new Message() { Content = x.Content, Subject = x.Subject }));
            CreateMap<Message, MessageDto>();
            CreateMap<AdminMessage, AdminMessageDto>()
                .ForMember(x => x.UserName, opt => opt.MapFrom(x =>
                !x.ForAdmin
                ? "Адміністратор"
                : x.User.FirstName != null || x.User.LastName != null
                ? $"{x.User.FirstName} {x.User.LastName}"
                : x.User.Email));

        }
    }
}
