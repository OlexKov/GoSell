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
using Olx.BLL.Models.AdminMessage;
using Olx.BLL.Models.AdminMessageModels;
using Olx.BLL.Models.Page;
using Olx.BLL.Pagination.Filters;
using Olx.BLL.Pagination.SortData;
using Olx.BLL.Pagination;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;


namespace Olx.BLL.Services
{
    public class AdminMessageService(
        IRepository<AdminMessage> adminMessageRepo,
        UserManager<OlxUser> userManager,
        IRepository<OlxUser> userRepo,
        IRepository<Message> messageRepo,
        IHttpContextAccessor httpContext,
        IValidator<AdminMessageCreationModel> validator,
        IMapper mapper,
        IHubContext<MessageHub> hubContext,
        RoleManager<IdentityRole<int>> roleManager,
        IRepository<IdentityUserRole<int>> userRolesRepo
        ) : IAdminMessageService
    {

        private async Task<IEnumerable<int>> _getAdminsIds()
        {
            var adminRole = await roleManager.FindByNameAsync(Roles.Admin)
                ?? throw new HttpException(Errors.InvalidRole, HttpStatusCode.InternalServerError);
            var adminIds = userRolesRepo.GetQuery()
                .Where(x => x.RoleId == adminRole.Id)
                .Select(z => z.UserId);
            return adminIds;
        }

        public async Task SendToAdmin(AdminMessageCreationModel messageCreationModel)
        {
            validator.ValidateAndThrow(messageCreationModel);
            var currentUser =  await userManager.UpdateUserActivityAsync(httpContext);
            var adminMessage = mapper.Map<AdminMessage>(messageCreationModel);
            adminMessage.MessageLogo = currentUser.Photo;
            adminMessage.User = currentUser;
            adminMessage.ForAdmin = true;
            await adminMessageRepo.AddAsync(adminMessage);
            await adminMessageRepo.SaveAsync();
            await hubContext.Clients.Group("Admins")
               .SendAsync(HubMethods.ReceiveUserMessage);
        }

        public async Task Delete(int id)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var message = await adminMessageRepo.GetByIDAsync(id)
                ?? throw new HttpException(Errors.InvalidAdminMessageId,HttpStatusCode.BadRequest);
            adminMessageRepo.Delete(message);
            await adminMessageRepo.SaveAsync();
        }

        public async Task<IEnumerable<AdminMessageDto>> GetAdminMessages(bool? unreaded)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            return await mapper.ProjectTo<AdminMessageDto>(adminMessageRepo.GetQuery().Where(x => x.ForAdmin && !x.Deleted && (!unreaded.HasValue || unreaded.Value == !x.Readed))).ToArrayAsync();
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

        public async Task<IEnumerable<AdminMessageDto>> GetUserMessages(bool? unreaded)
        {
            var currentUser = await userManager.UpdateUserActivityAsync(httpContext);
            var messages = await mapper.ProjectTo<AdminMessageDto>(adminMessageRepo.GetQuery()
                .Where(x => !x.ForAdmin && !x.Deleted && x.User.Id == currentUser.Id && (!unreaded.HasValue || unreaded.Value == !x.Readed)))
                .ToArrayAsync();
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

        public async Task SendToUser(AdminMessageCreationModel messageCreationModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext, false);
            validator.ValidateAndThrow(messageCreationModel);
            var adminMessage = mapper.Map<AdminMessage>(messageCreationModel);
            if (messageCreationModel.UserId != null)
            {
                var user = userManager.Users.Include(x => x.AdminMessages).FirstOrDefault(x => x.Id == messageCreationModel.UserId)
                    ?? throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
                user.AdminMessages.Add(adminMessage);
                await userManager.UpdateAsync(user);
                string userId = adminMessage.UserId.ToString();
                await hubContext.Clients.Users(userId)
                   .SendAsync(HubMethods.ReceiveAdminMessage);
                return;
            }
            else 
            {
                IEnumerable<int>? usersIds = messageCreationModel.UserIds is not null && messageCreationModel.UserIds.Any()
                    ? messageCreationModel.UserIds
                    : await userRepo.GetQuery().Select(x => x.Id).ToArrayAsync();
                

                if (usersIds is not null && usersIds.Any())
                {
                    var adminsIds = await _getAdminsIds();
                    usersIds = usersIds.Where(x => !adminsIds.Contains(x));
                    var messsage = adminMessage.Message;
                    await messageRepo.AddAsync(messsage);
                    await messageRepo.SaveAsync();
                    List<AdminMessage> messeges = [];
                    foreach (var userId in usersIds)
                    {
                        adminMessage = mapper.Map<AdminMessage>(messageCreationModel);
                        adminMessage.Message = messsage;
                        adminMessage.UserId = userId;
                        messeges.Add(adminMessage);
                    }
                    await adminMessageRepo.AddRangeAsync(messeges);
                    await adminMessageRepo.SaveAsync();

                    await hubContext.Clients.Users(usersIds.Select(x => x.ToString()))
                     .SendAsync(HubMethods.ReceiveAdminMessage);

                    return;
                }
            }
            throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
        }

       
        public async Task SetReaded(int id)
        {
            var user =  await userManager.UpdateUserActivityAsync(httpContext);
            int? userId = await userManager.IsInRoleAsync(user, Roles.Admin) ? null : user.Id;
            var adminMessage = await userManager.IsInRoleAsync(user, Roles.Admin)
                ? await adminMessageRepo.GetItemBySpec(new AdminMessageSpecs.GetAdminUnreadedById(id, true))
                : await adminMessageRepo.GetItemBySpec(new AdminMessageSpecs.GetUnreadedById(userId, id, true));
            if (adminMessage != null) 
            {
                adminMessage.Readed = true;
                await adminMessageRepo.SaveAsync();
                return;
            }
            throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
        }

        public async Task SetReaded(IEnumerable<int> ids)
        {
            var user = await userManager.UpdateUserActivityAsync(httpContext);
            int? userId = await userManager.IsInRoleAsync(user, Roles.Admin) ? null : user.Id;

            var messages = await userManager.IsInRoleAsync(user, Roles.Admin)
                ? await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetAdminUnreadedByIds(ids, true))
                : await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetUnreadedByIds(userId, ids, true));
            
            if (messages.Any())
            {
                foreach (var message in messages)
                {
                    message.Readed = true;
                }
                await adminMessageRepo.SaveAsync();
                return;
            }
            throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest);
        }

        public async Task SoftDeleteRange(IEnumerable<int> ids)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var messages = await adminMessageRepo.GetListBySpec(new AdminMessageSpecs.GetMessagesForUserByIds(ids));
            if (!messages.Any())
            { 
                throw new HttpException(Errors.InvalidAdminMessageId, HttpStatusCode.BadRequest); 
            }
            foreach (var message in messages) 
            {
                message.Deleted = true;
            }
            await adminMessageRepo.SaveAsync();
        }

        public async Task<PageResponse<AdminMessageDto>> GetPageAsync(AdminMessagePageRequest pageRequest,bool forAdmin = false)
        {
            var currentUser = await userManager.UpdateUserActivityAsync(httpContext);
            var query = mapper.ProjectTo<AdminMessageDto>(adminMessageRepo.GetQuery()
                .Where(x => x.ForAdmin == forAdmin && x.User.Id == currentUser.Id != forAdmin)
                .AsNoTracking());
            var paginationBuilder = new PaginationBuilder<AdminMessageDto>(query);
            var adminMessageFilter = mapper.Map<AdminMessageFilter>(pageRequest);
            var page = await paginationBuilder.GetPageAsync(pageRequest.Page, pageRequest.Size, adminMessageFilter, new AdminMessageSortData());
            return new()
            {
                Total = page.Total,
                Items = page.Items
            };
        }
    }
}
