using AutoMapper;
using Olx.BLL.DTOs.Chat;
using Olx.BLL.Entities.ChatEntities;
using Olx.BLL.Exstensions;

namespace Olx.BLL.Mapper
{
    public  class ChatProfile :Profile
    {
        public ChatProfile()
        {
            CreateMap<Chat, ChatDto>();
        }
    }
}
