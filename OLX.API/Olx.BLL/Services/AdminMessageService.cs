using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.DTOs.AdminMessage;
using Olx.BLL.Entities;
using Olx.BLL.Entities.AdminMessages;
using Olx.BLL.Exceptions;
using Olx.BLL.Exstensions;
using Olx.BLL.Helpers;
using Olx.BLL.Hubs;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;


namespace Olx.BLL.Services
{
    public class AdminMessageService(
        IRepository<AdminMessage> adminMessageRepo,
        IRepository<Message> messageRepo,
        UserManager<OlxUser> userManager,
        IHttpContextAccessor httpContext,
        IValidator<AdminMessageCreationModel> validator,
        IMapper mapper,
        IHubContext<MessageHub> hubContext
        ) : IAdminMessageService
    {
        public async Task<AdminMessageDto> UserCreate(AdminMessageCreationModel messageCreationModel)
        {
            validator.ValidateAndThrow(messageCreationModel);
            var currentUser = await userManager.UpdateUserActivityAsync(httpContext,false);
            var adminMessage = mapper.Map<AdminMessage>(messageCreationModel);
            adminMessage.User = currentUser;
            currentUser.AdminMessages.Add(adminMessage);
            await userManager.UpdateAsync(currentUser);
            var messageDto = mapper.Map<AdminMessageDto>(adminMessage);
            await hubContext.Clients.Group("Admins")
               .SendAsync(HubMethods.ReceiveUserMessage, adminMessage);
            return messageDto;
        }

        public async Task Delete(int id)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var message = await adminMessageRepo.GetByIDAsync(id)
                ?? throw new HttpException(Errors.InvalidAdminMessageId,HttpStatusCode.BadRequest);
            adminMessageRepo.Delete(message);
            await adminMessageRepo.SaveAsync();
        }

        public async Task<IEnumerable<AdminMessageDto>> GetAdminMessages()
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            return await mapper.ProjectTo<AdminMessageDto>(adminMessageRepo.GetQuery().Where(x => x.User == null && !x.Deleted)).ToArrayAsync();
        }

        public async Task<AdminMessageDto> GetById(int id)
        {
            var message = await mapper.ProjectTo<AdminMessageDto>(adminMessageRepo.GetQuery().Where(x => x.Id == id && !x.Deleted)).SingleOrDefaultAsync()
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            return message;
        }

        public async Task<IEnumerable<AdminMessageDto>> GetDeleted()
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var messages = await mapper.ProjectTo<AdminMessageDto>(adminMessageRepo.GetQuery().Where(x => x.Deleted)).ToArrayAsync();
            return messages;
        }

        public async Task<IEnumerable<AdminMessageDto>> GetUserMessages()
        {
            var currentUser = await userManager.UpdateUserActivityAsync(httpContext);
            var messages = await mapper.ProjectTo<AdminMessageDto>(adminMessageRepo.GetQuery().Where(x => x.User != null && !x.Deleted && x.User.Id == currentUser.Id)).ToArrayAsync();
            return messages;
        }

        public async Task SoftDelete(int id)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var message = await adminMessageRepo.GetByIDAsync(id)
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            message.Deleted = true;
            await adminMessageRepo.SaveAsync();
        }

        public async Task<AdminMessageDto> AdminCreate(AdminMessageCreationModel messageCreationModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext, false);
            validator.ValidateAndThrow(messageCreationModel);
            var adminMessage = mapper.Map<AdminMessage>(messageCreationModel);
            if (messageCreationModel.UserId is not null)
            {
                var user = userManager.Users.FirstOrDefault(x => x.Id == messageCreationModel.UserId)
                    ?? throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
                await adminMessageRepo.AddAsync(adminMessage);
                await adminMessageRepo.SaveAsync();
                var messageDto = mapper.Map<AdminMessageDto>(adminMessage);
                await hubContext.Clients.Users(messageDto.UserId.ToString())
                 .SendAsync(HubMethods.ReceiveAdminMessage);
                return messageDto;
            }
            else 
            {
                IEnumerable<int> usersIds;
                bool allUsers = false;
                if (messageCreationModel.UserIds is null || !messageCreationModel.UserIds.Any())
                {
                    usersIds = await userManager.Users.Select(x => x.Id).ToArrayAsync();
                    allUsers = true;
                }
                else 
                {
                    usersIds = messageCreationModel.UserIds;
                }
                
                if (usersIds is not null && usersIds.Any())
                {
                    List<AdminMessage> messages = [];
                    var message = adminMessage.Message;
                    await messageRepo.AddAsync(message);
                    await messageRepo.SaveAsync();
                    foreach (var id in usersIds)
                    {
                        adminMessage = mapper.Map<AdminMessage>(messageCreationModel);
                        adminMessage.UserId = id;
                        adminMessage.Message = message;
                        messages.Add(adminMessage);
                    }
                    await adminMessageRepo.AddRangeAsync(messages);
                    await adminMessageRepo.SaveAsync();
                   
                    var messageDto = mapper.Map<AdminMessageDto>(adminMessage);
                    if (!allUsers)
                    {
                        await hubContext.Clients.Users(usersIds.Select(x => x.ToString()).ToArray())
                        .SendAsync(HubMethods.ReceiveAdminMessage);
                    }
                    else 
                    {
                        await hubContext.Clients.Group("Users")
                       .SendAsync(HubMethods.ReceiveAdminMessage);
                    }
                   
                    return messageDto;
                }
            }
            throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
        }

       
        public async Task SetReaded(int id)
        {
            var user =  await userManager.UpdateUserActivityAsync(httpContext);
            int? userId = await userManager.IsInRoleAsync(user, Roles.Admin) ? null : user.Id;
            var  adminMessage = await adminMessageRepo.GetItemBySpec(new AdminMessageSpecs.GetUnreadedById(userId, id,  true))
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            adminMessage.Readed = true;
            await adminMessageRepo.SaveAsync();
            await hubContext.Clients.Users(user.Id.ToString())
                .SendAsync(HubMethods.SetReaded, adminMessage.Id);
        }

        public async Task SetReaded(IEnumerable<int> ids)
        {
            var user = await userManager.UpdateUserActivityAsync(httpContext);
            int? userId = await userManager.IsInRoleAsync(user, Roles.Admin) ? null : user.Id;
            var messages = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetUnreadedByIds(userId, ids,  true))
                ?? throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
            foreach (var message in messages)
            {
                message.Readed = true;
            }
            await adminMessageRepo.SaveAsync();
        }
    }
}
