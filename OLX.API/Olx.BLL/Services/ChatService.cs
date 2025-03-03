using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.DTOs.AdminMessage;
using Olx.BLL.DTOs.Chat;
using Olx.BLL.Entities;
using Olx.BLL.Entities.ChatEntities;
using Olx.BLL.Exceptions;
using Olx.BLL.Exstensions;
using Olx.BLL.Helpers;
using Olx.BLL.Hubs;
using Olx.BLL.Interfaces;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;

namespace Olx.BLL.Services
{
    public class ChatService(
        UserManager<OlxUser> userManager,
        IHttpContextAccessor httpContext,
        IRepository<Chat> chatRepository,
        IRepository<Advert> advertRepository,
        IMapper mapper,
        IHubContext<MessageHub> hubContext
        ) : IChatService
    {
        public async Task<Chat> CreateAsync(int advertId, string? message = null)
        {
            var user = await userManager.UpdateUserActivityAsync(httpContext);
            var advert = await advertRepository.GetItemBySpec( new AdvertSpecs.GetById(advertId))
                ?? throw new HttpException(Errors.InvalidAdvertId,HttpStatusCode.BadRequest);
            var chat = await chatRepository.GetItemBySpec(new ChatSpecs.FindExisting(advertId, user.Id))
                ?? new Chat()
                {
                    Advert = advert,
                    Buyer = user,
                    SellerId = advert.UserId
                };
            if (message is not null)
            {
                chat.Messages.Add(new()
                {
                    Content = message,
                    Sender = user
                });
            }
            chat.IsDeletedForSeller = false;
            if (chat.Id == 0) 
            {
                await chatRepository.AddAsync(chat);
            }
            await chatRepository.SaveAsync();
            await hubContext.Clients.Users(advert.UserId.ToString())
                .SendAsync(HubMethods.CreateChat);
            return chat;
        }

        public async Task<IEnumerable<ChatMessageDto>> GetChatMessagesAsync(int chatId)
        {
            var chat = await chatRepository.GetItemBySpec(new ChatSpecs.GetById(chatId, ChatOpt.NoTracking | ChatOpt.Messages_Sender))
                ?? throw new HttpException(Errors.InvalidChatId, HttpStatusCode.BadRequest);
            return mapper.Map<IEnumerable<ChatMessageDto>>(chat.Messages);
        }

        public async Task<IEnumerable<ChatDto>> GetUserChatsAsync()
        {
            var user =  await userManager.UpdateUserActivityAsync(httpContext);
            var chats = await mapper.ProjectTo<ChatDto>(chatRepository.GetQuery()
                .Where(x => (x.Buyer.Id == user.Id && !x.IsDeletedForBuyer) || (x.Seller.Id == user.Id && !x.IsDeletedForSeller)))
                .ToArrayAsync();
            return chats;
        }

        public async Task Remove(int chatId)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var chat = await chatRepository.GetItemBySpec(new ChatSpecs.GetById(chatId))
                ?? throw new HttpException(Errors.InvalidChattId, HttpStatusCode.BadRequest);
            chatRepository.Delete(chat);
            await chatRepository.SaveAsync();
        }
        public async Task Remove(IEnumerable<int> chatIds)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var chats = await chatRepository.GetListBySpec(new ChatSpecs.GetByIds(chatIds))
                ?? throw new HttpException(Errors.InvalidChattId, HttpStatusCode.BadRequest);
            chatRepository.DeleteRange(chats);
            await chatRepository.SaveAsync();
        }

        public async Task RemoveForUserAsync(int chatId)
        {
            var user = await userManager.UpdateUserActivityAsync(httpContext);
            var chat = await chatRepository.GetItemBySpec(new ChatSpecs.GetById(chatId))
                ?? throw new HttpException(Errors.InvalidChatId, HttpStatusCode.BadRequest);
            if (chat.BuyerId == user.Id)
            {
                chat.IsDeletedForBuyer = true;
            }
            else chat.IsDeletedForSeller = true;
            await chatRepository.SaveAsync();
        }

        public async Task RemoveForUserAsync(IEnumerable<int> chatIds)
        {
            var user = await userManager.UpdateUserActivityAsync(httpContext);
            var chats = await chatRepository.GetListBySpec(new ChatSpecs.GetByIds(chatIds))
                ?? throw new HttpException(Errors.InvalidChattId, HttpStatusCode.BadRequest);

            foreach (var chat in chats)
            {
                if (chat.BuyerId == user.Id)
                {
                    chat.IsDeletedForBuyer = true;
                }
                else chat.IsDeletedForSeller = true;
            }
            await chatRepository.SaveAsync();
        }

        public async Task SendMessageAsync(int chatId, string message)
        {
            var user = await userManager.UpdateUserActivityAsync(httpContext);
            var chat = await chatRepository.GetItemBySpec(new ChatSpecs.GetById(chatId))
                ?? throw new HttpException(Errors.InvalidChattId, HttpStatusCode.BadRequest);
            chat.Messages.Add(new() 
            {
                Content = message,
                Sender = user
            });

            var receiverUserId = chat.SellerId == user.Id ? chat.BuyerId : chat.SellerId;

            var buyerRestore = receiverUserId == chat.BuyerId && chat.IsDeletedForBuyer;
            var sellerRestore = receiverUserId == chat.SellerId && chat.IsDeletedForSeller;
            if (buyerRestore || sellerRestore)
            {
                chat.IsDeletedForBuyer = !buyerRestore;
                chat.IsDeletedForSeller = !sellerRestore;
                await hubContext.Clients.Users(receiverUserId.ToString())
                  .SendAsync(HubMethods.CreateChat);
            }
            await chatRepository.SaveAsync();
            await hubContext.Clients.Users(receiverUserId.ToString())
             .SendAsync(HubMethods.ReceiveChatMessage);
        }
    }
}
