using AutoMapper;
using Olx.BLL.DTOs.Chat;
using Olx.BLL.Entities.ChatEntities;

namespace Olx.BLL.Mapper
{
    public class ChatMessageProfile : Profile
    {
        public ChatMessageProfile()
        {
            CreateMap<ChatMessage, ChatMessageDto>();
        }
    }
}
