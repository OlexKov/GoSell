using AutoMapper;
using Olx.BLL.DTOs;
using Olx.BLL.Entities.ChatEntities;

namespace Olx.BLL.Mapper
{
    public  class ChatProfile :Profile
    {
        public ChatProfile()
        {
            CreateMap<Chat, ChatDto>()
                .ForMember(x => x.AdvertImage, opt => opt.MapFrom(z => z.Advert.Images.FirstOrDefault(y => y.Priority == 0)))
                .ForMember(x => x.SellerName, opt => opt.MapFrom(x => x.Seller.FirstName ?? x.Seller.LastName ?? x.Seller.Email))
                .ForMember(x => x.BuyerName, opt => opt.MapFrom(x => x.Buyer.FirstName ?? x.Buyer.LastName ?? x.Buyer.Email));
        }
    }
}
