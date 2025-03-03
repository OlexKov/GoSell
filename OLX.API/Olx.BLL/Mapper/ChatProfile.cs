using AutoMapper;
using Olx.BLL.DTOs.Chat;
using Olx.BLL.Entities.ChatEntities;

namespace Olx.BLL.Mapper
{
    public  class ChatProfile :Profile
    {
        public ChatProfile()
        {
            CreateMap<Chat, ChatDto>()
                .ForMember(x => x.UnreadedCount, opt => opt.MapFrom(x => x.Messages.Where(z => !z.Readed).Count()));
        }
    }
}
