using AutoMapper;
using Olx.BLL.DTOs;
using Olx.BLL.Entities;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Advert;
using Olx.BLL.Pagination.SortData;
using Olx.BLL.Pagination;
using Olx.BLL.Pagination.Filters;
using Olx.BLL.Models.Page;
using Olx.BLL.Exceptions;
using Olx.BLL.Resources;
using System.Net;
using Olx.BLL.Specifications;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Olx.BLL.Exstensions;
using Olx.BLL.Entities.NewPost;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.DTOs.AdvertDtos;
using Olx.BLL.Models.AdminMessage;
using Olx.BLL.Helpers;
using NETCore.MailKit.Core;
using Olx.BLL.Helpers.Email;
using Microsoft.AspNetCore.SignalR;
using Olx.BLL.Hubs;


namespace Olx.BLL.Services
{
    public class AdvertService(
        IRepository<Advert> advertRepository,
        IRepository<Category> categorytRepository,
        IRepository<Settlement> settlementRepository,
        IRepository<AdvertImage> imageRepository,
        UserManager<OlxUser> userManager,
        IFilterValueService filterValueService,
        IImageService imageService,
        IHttpContextAccessor httpContext,
        IAdminMessageService adminMessageService,
        IEmailService emailService,
        IMapper mapper,
        IHubContext<MessageHub> hubContext,
        IValidator<AdvertCreationModel> advertCreationModelValidator) : IAdvertService
    {
       
        public async Task<AdvertDto> CreateAsync(AdvertCreationModel advertModel)
        {
            advertCreationModelValidator.ValidateAndThrow(advertModel);
            var curentUser = await userManager.UpdateUserActivityAsync(httpContext);
            if (curentUser.Id != advertModel.UserId)
            {
                throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
            }
            if (!await categorytRepository.AnyAsync(x => x.Id == advertModel.CategoryId))
            {
                throw new HttpException(Errors.InvalidCategoryId, HttpStatusCode.BadRequest);
            }
            if (!await settlementRepository.AnyAsync(x => x.Ref == advertModel.SettlementRef))
            {
                throw new HttpException(Errors.InvalidSettlementId, HttpStatusCode.BadRequest);
            }

            var advert = mapper.Map<Advert>(advertModel);
            var images = advertModel.ImageFiles.Select(async (x, index) => new AdvertImage()
            {
                Priority = index,
                Name = await imageService.SaveImageAsync(x)
            });

            advert.Images = await Task.WhenAll(images);
            if (advertModel.FilterValueIds.Count != 0)
            {
                var values = await filterValueService.GetByIdsAsync(advertModel.FilterValueIds);
                advert.FilterValues = values.ToList();
            }

            await advertRepository.AddAsync(advert);
            await advertRepository.SaveAsync();
            return mapper.Map<AdvertDto>(advert);
        }

        public async Task DeleteAsync(int id)
        {
           var user =  await userManager.UpdateUserActivityAsync(httpContext);
            var advert = await advertRepository.GetItemBySpec( new AdvertSpecs.GetById(id,AdvertOpt.User))
                ?? throw new HttpException(Errors.InvalidAdvertId,HttpStatusCode.BadRequest);
            advertRepository.Delete(advert);
            await advertRepository.SaveAsync();
            if (await userManager.IsInRoleAsync(user, Roles.Admin)) 
            {
                var message = new AdminMessageCreationModel
                {
                    MessageLogo = advert.Images.FirstOrDefault(x => x.Priority == 0)?.Name,
                    Content = "За порушення правил та не відповідності що до політикі сайту.",
                    Subject = $"Адміністратор видалив ваше оголошення \"{advert.Title}\".",
                    UserId = advert.UserId
                };
                await adminMessageService.AdminCreate(message);
                var accountBlockedTemplate = EmailTemplates.GetAdvertRemovedTemplate($"{message.Subject} {message.Content}");
                await emailService.SendAsync(advert.User.Email, "Вашe оголошення видалено", accountBlockedTemplate, true);
                await hubContext.Clients.Users(advert.UserId.ToString())
                  .SendAsync(HubMethods.AdminDeleteAdvert);
                return;
            }
        }

        public async Task<IEnumerable<AdvertDto>> GetRangeAsync(IEnumerable<int> ids) =>
            await mapper.ProjectTo<AdvertDto>(advertRepository.GetQuery().Where(x => ids.Contains(x.Id) && !x.Blocked && !x.Completed)).ToArrayAsync();
        
        public async Task<IEnumerable<AdvertDto>> GetAllAsync() =>
            await mapper.ProjectTo<AdvertDto>(advertRepository.GetQuery().Where(x => !x.Blocked && !x.Completed)).ToArrayAsync();
      
        public async Task<IEnumerable<AdvertDto>> GetUserAdvertsAsync(bool locked = false,bool completed = false)
        {
            var curentUser = await userManager.UpdateUserActivityAsync(httpContext);
            return await mapper.ProjectTo<AdvertDto>(advertRepository.GetQuery().Where(x => x.UserId == curentUser.Id && x.Blocked == locked && x.Completed == completed)).ToArrayAsync();
        }

        public async Task<IEnumerable<AdvertDto>> GetByUserId(int userId)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var user = userManager.FindByIdAsync(userId.ToString())
                ?? throw new HttpException(Errors.InvalidUserId,HttpStatusCode.BadRequest);
            return await mapper.ProjectTo<AdvertDto>(advertRepository.GetQuery().Where(x => x.UserId == userId && !x.Blocked && !x.Completed)).ToArrayAsync();
        }

        public async Task<AdvertDto> GetByIdAsync(int id)
        {
            var advert = await mapper.ProjectTo<AdvertDto>(advertRepository.GetQuery().Where(x => x.Id == id)).SingleOrDefaultAsync()
                ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            return advert;
        }

        public async Task<IEnumerable<AdvertImageDto>> GetImagesAsync(int id) =>
            await mapper.ProjectTo<AdvertImageDto>(imageRepository.GetQuery().Where(x => x.AdvertId == id)).ToArrayAsync();
       
        public async Task<PageResponse<AdvertDto>> GetPageAsync(AdvertPageRequest pageRequest)
        {
            var query = mapper.ProjectTo<AdvertDto>(advertRepository.GetQuery().Where(x => !x.Completed));
            var paginationBuilder = new PaginationBuilder<AdvertDto>(query);
            var filter = mapper.Map<AdvertFilter>(pageRequest);
            var sortData = new AdvertSortData(pageRequest.IsDescending, pageRequest.SortKey);
            var page = await paginationBuilder.GetPageAsync(pageRequest.Page, pageRequest.Size, filter, sortData);
            return new()
            {
                Total = page.Total,
                Items = page.Items
            };
        }

        public async Task<AdvertDto> UpdateAsync(AdvertCreationModel advertModel)
        {
            advertCreationModelValidator.ValidateAndThrow(advertModel);
            var curentUser = await userManager.UpdateUserActivityAsync(httpContext);
            if (curentUser.Id != advertModel.UserId)
            {
                throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
            }

            var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetUserAdvertById(curentUser.Id,advertModel.Id, AdvertOpt.Images | AdvertOpt.FilterValues))
                ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            if (!await categorytRepository.AnyAsync(x => x.Id == advertModel.CategoryId))
            {
                throw new HttpException(Errors.InvalidCategoryId, HttpStatusCode.BadRequest);
            }
            if (!await settlementRepository.AnyAsync(x => x.Ref == advertModel.SettlementRef))
            {
                throw new HttpException(Errors.InvalidSettlementId, HttpStatusCode.BadRequest);
            }
            mapper.Map(advertModel, advert);
            var existingImagesNames = advertModel.ImageFiles.Where(x => x.ContentType == "image/existing").Select(x => x.FileName) ?? [];
            var imagesToDelete = advert.Images.Where(x => !existingImagesNames.Contains(x.Name));
            foreach (var image in imagesToDelete)
            {
                image.Advert = null;
            }
            List<Task> tasks = [];
            if (advertModel.ImageFiles.Count != 0)
            {
                var priorityFiles = advertModel.ImageFiles.Select((x, index) => new { file = x, index });
                
                foreach (var file in priorityFiles)
                {
                   
                    if (file.file.ContentType == "image/existing")
                    {
                        var oldImage = advert.Images.FirstOrDefault(x => x.Name == file.file.FileName)!;
                        oldImage.Priority = file.index;
                    }
                    else
                    {
                        tasks.Add(Task.Run(async () =>
                        {
                            var imageName = await imageService.SaveImageAsync(file.file);
                            advert.Images.Add(new AdvertImage
                            {
                                Name = imageName,
                                Priority = file.index
                            });
                        }));
                    }
                   
                }
             }
            if (advertModel.FilterValueIds.Count != 0)
            {
                var values = await filterValueService.GetByIdsAsync(advertModel.FilterValueIds);
                advert.FilterValues = values.ToList();
            }
            advert.Approved = false;
            advert.Completed = false;
            advert.Blocked = false;
            await Task.WhenAll(tasks);
            await advertRepository.SaveAsync();
            return mapper.Map<AdvertDto>(advert);
        }

        public async Task ApproveAsync(int id)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetById(id))
                ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            if (!advert.Blocked)
            {
                advert.Approved = true;
                await advertRepository.SaveAsync();
            }
            else throw new HttpException(Errors.AdvertIsBlocked, HttpStatusCode.BadRequest);
        }

        public async Task SetLockedStatusAsync(AdvertLockRequest lockRequest)
        {
           var user = await userManager.UpdateUserActivityAsync(httpContext);
            var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetById(lockRequest.Id,AdvertOpt.User))
                 ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            advert.Blocked = lockRequest.Status;
            if (lockRequest.Status) 
            {
                var message = new AdminMessageCreationModel
                {
                    MessageLogo = advert.Images.FirstOrDefault(x => x.Priority == 0)?.Name,
                    Content = lockRequest.LockReason ?? "За не відповідність що до політикі сайту",
                    Subject = $"Адміністратор заблокував ваше оголошення \"{advert.Title}\"",
                    UserId = advert.UserId
                };
                await adminMessageService.AdminCreate(message);
               
                var accountBlockedTemplate = EmailTemplates.GetAdvertLockedTemplate($"{message.Subject} {message.Content}");
                await emailService.SendAsync(advert.User.Email, "Вашe оголошення заблоковано", accountBlockedTemplate, true);
                await hubContext.Clients.Users(advert.UserId.ToString())
                 .SendAsync(HubMethods.AdminLockAdvert);
            }
            await advertRepository.SaveAsync();
        }

        public  async Task<int> RemoveCompletedAsync()
        {
            var user = await userManager.UpdateUserActivityAsync(httpContext);
            var completedAdverts = await advertRepository.GetListBySpec(new AdvertSpecs.GetCompleted(user.Id));
            if (completedAdverts.Any()) 
            {
                advertRepository.DeleteRange(completedAdverts);
                await advertRepository.SaveAsync();
            }
            return completedAdverts.Count();
        }

        public async Task SetCompletedAsync(int advertId)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var advertToComplete = await advertRepository.GetByIDAsync(advertId)
                ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            advertToComplete.Completed = true;
            await advertRepository.SaveAsync();
        }
    }
}
