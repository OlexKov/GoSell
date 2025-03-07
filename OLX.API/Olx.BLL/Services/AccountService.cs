using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NETCore.MailKit.Core;
using Newtonsoft.Json;
using Olx.BLL.DTOs.AdvertDtos;
using Olx.BLL.Entities;
using Olx.BLL.Entities.NewPost;
using Olx.BLL.Exceptions;
using Olx.BLL.Exstensions;
using Olx.BLL.Helpers;
using Olx.BLL.Helpers.Email;
using Olx.BLL.Interfaces;
using Olx.BLL.Models;
using Olx.BLL.Models.AdminMessage;
using Olx.BLL.Models.Authentication;
using Olx.BLL.Models.User;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Collections.Concurrent;
using System.Net;
using System.Net.Http.Headers;
using System.Reflection.Metadata.Ecma335;


namespace Olx.BLL.Services
{
    public class AccountService(
        UserManager<OlxUser> userManager,
        IHttpContextAccessor  httpContext,
        IJwtService jwtService,
        IRepository<RefreshToken> tokenRepository,
        IRepository<OlxUser> userRepository,
        IRepository<Advert> advertRepository,
        IRepository<Settlement> settlementRepository,
        IEmailService emailService,
        IConfiguration configuration,
        IMapper mapper,
        IImageService imageService,
        IAdminMessageService adminMessageService,
        IValidator<ResetPasswordModel> resetPasswordModelValidator,
        IValidator<EmailConfirmationModel> emailConfirmationModelValidator,
        IValidator<UserCreationModel> userCreationModelValidator,
        IValidator<UserEditModel> userEditModelValidator) : IAccountService
    {
        private static readonly ConcurrentDictionary<int, SemaphoreSlim> _userSemaphores = new();

        private async Task<string> CreateRefreshToken(int userId)
        {
            var refeshToken = jwtService.GetRefreshToken();
            var refreshTokenEntity = new RefreshToken
            {
                Token = refeshToken,
                OlxUserId = userId,
                ExpirationDate = DateTime.UtcNow.AddDays(jwtService.GetRefreshTokenLiveTime())
            };
            await tokenRepository.AddAsync(refreshTokenEntity);
            await tokenRepository.SaveAsync();
            return refeshToken;
        }

        private async Task CreateUserAsync(OlxUser user,string? password = null, bool isAdmin = false)
        {
            user.EmailConfirmed = user.EmailConfirmed || isAdmin;
            var result = password is not null
                ? await userManager.CreateAsync(user, password)
                : await userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                throw new HttpException(Errors.UserCreateError, HttpStatusCode.InternalServerError);
            }
            await userManager.AddToRoleAsync(user, isAdmin ? Roles.Admin : Roles.User);
            if (!isAdmin && !await userManager.IsEmailConfirmedAsync(user))
            {
                await SendEmailConfirmationMessageAsync(user);
            }
        }

        private async Task SendEmailConfirmationMessageAsync(OlxUser user)
        {
            var confirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var email = EmailTemplates.GetEmailConfirmationTemplate(configuration["FrontendEmailConfirmationUrl"]!, confirmationToken, user.Id);
            await emailService.SendAsync(user.Email, "Підтвердження електронної пошти", email, true);
        }

        private async Task CheckEmailConfirmAsync(OlxUser user)
        {
            if (!await userManager.IsEmailConfirmedAsync(user))
            {
                throw new HttpException(HttpStatusCode.Forbidden, new UserBlockInfo
                {
                    Message = "Ваша пошта не підтверджена. Перевірте email для підтвердження.",
                    UnlockTime = null,
                    Email = user.Email
                });
            }
        }

        private async Task CheckLockedOutAsync(OlxUser user)
        {
            
            if (await userManager.IsLockedOutAsync(user))
            {
                throw new HttpException(HttpStatusCode.Locked, new UserBlockInfo
                {
                    Message = "Ваш обліковий запис заблокований.",
                    UnlockTime = user.LockoutEnd.HasValue && user.LockoutEnd.Value.Year < 9000 ? user.LockoutEnd.Value.LocalDateTime : null
                });
            }
        }
        private async Task<AuthResponse> GetAuthTokens(OlxUser user)
        {
            return new()
            {
                AccessToken = jwtService.CreateToken(await jwtService.GetClaimsAsync(user)),
                RefreshToken = await CreateRefreshToken(user.Id)
            };
        }

        private async Task<OlxUser> GetCurrentUser()
        {
            var currentUserId = int.Parse(userManager.GetUserId(httpContext.HttpContext?.User!)!);
            var currentUser = await userRepository.GetItemBySpec(new OlxUserSpecs.GetById(currentUserId, UserOpt.FavoriteAdverts))
                ?? throw new HttpException(Errors.ErrorAthorizedUser, HttpStatusCode.InternalServerError);
            currentUser.LastActivity = DateTime.UtcNow;
            return currentUser;
        }

        private async Task RecaptcaVerify(string recaptcaToken, string action)
        { 
            using var httpClient = new HttpClient();
            var response = await httpClient.PostAsync(
                $"{configuration["RecaptchaApiUrl"]!}?secret={configuration["RecaptchaSecretKey"]!}&response={recaptcaToken}",
                null);
            var result = await response.Content.ReadAsStringAsync();
            var verification = JsonConvert.DeserializeObject<RecaptchaVerificationResponse>(result);
            if (verification?.Success != true || verification.Action != action || verification?.Score < 0.5)
            {
                throw new HttpException(HttpStatusCode.Forbidden, new UserBlockInfo
                {
                    Message = "reCAPTHCA перевірку не пройдено"
                });
            }
        }

        public async Task<AuthResponse> LoginAsync(AuthRequest model)
        {
            await RecaptcaVerify(model.RecapthcaToken, model.Action);
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user != null) 
            {
                user.LastActivity = DateTime.UtcNow;
                await userManager.UpdateAsync(user);
                await CheckLockedOutAsync(user);
                await CheckEmailConfirmAsync(user);
                if (!await userManager.CheckPasswordAsync(user, model.Password))
                {
                    await userManager.AccessFailedAsync(user);
                    if (await userManager.IsLockedOutAsync(user))
                    {
                        throw new HttpException(HttpStatusCode.Locked, new UserBlockInfo
                        {
                            Message = "Ваш обліковий запис заблоковано через надто багато невірних спроб входу",
                            UnlockTime = user.LockoutEnd.HasValue ? user.LockoutEnd.Value.LocalDateTime : null
                        });
                    }
                }
                else
                {
                    await userManager.ResetAccessFailedCountAsync(user);
                    return await GetAuthTokens(user);
                }    
            }
            throw new HttpException(Errors.InvalidLoginData, HttpStatusCode.BadRequest);
        }

        public async Task SendEmailConfirmationMessageAsync(string email) 
        {
            var user = await userManager.FindByEmailAsync(email)
                ?? throw new HttpException(Errors.InvalidUserEmail,HttpStatusCode.BadRequest);
            await SendEmailConfirmationMessageAsync(user);
        }

        public async Task<AuthResponse> GoogleLoginAsync(string googleAccessToken)
        {
            using HttpClient httpClient = new();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", googleAccessToken);
            HttpResponseMessage response = await httpClient.GetAsync(configuration["GoogleUserInfoUrl"]);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();
            var userInfo = JsonConvert.DeserializeObject<GoogleUserInfo>(responseBody)!;
            OlxUser user = await userManager.FindByEmailAsync(userInfo.Email) ?? mapper.Map<OlxUser>(userInfo);
            if (user.Id == 0)
            {
                if (!String.IsNullOrEmpty(userInfo.Picture))
                {
                    user.Photo = await imageService.SaveImageFromUrlAsync(userInfo.Picture);
                }
                await CreateUserAsync(user);
            }
            else  await CheckLockedOutAsync(user);
            await CheckEmailConfirmAsync(user);
            return await GetAuthTokens(user);
        }

        public async Task<AuthResponse> RefreshTokensAsync(string refreshToken)
        {
            var token = await tokenRepository.GetItemBySpec(new RefreshTokenSpecs.GetByValue(refreshToken));
            if (token is not null)
            {
                if (token.ExpirationDate.ToUniversalTime() > DateTime.UtcNow)
                {
                    var user = userManager.Users.AsNoTracking().FirstOrDefault(x => x.Id == token.OlxUserId);
                    if (user is not null)
                    {
                        var semaphore = _userSemaphores.GetOrAdd(user.Id, _ => new SemaphoreSlim(1, 1));
                        await semaphore.WaitAsync();
                        if (await tokenRepository.AnyAsync(x => x.Id == token.Id))
                        {
                            await tokenRepository.DeleteAsync(token.Id);
                            var tokens = await GetAuthTokens(user);
                            semaphore.Release();
                            _userSemaphores.TryRemove(user.Id, out _);
                            return tokens;
                        }
                         semaphore.Release();
                        _userSemaphores.TryRemove(user.Id, out _);
                        throw new HttpException(Errors.MultipleRefresh, HttpStatusCode.Conflict);
                    }
                }
            }
            throw new HttpException(Errors.InvalidToken, HttpStatusCode.Unauthorized);
        }

        public async Task LogoutAsync(string refreshToken)
        {
            var token = await tokenRepository.GetItemBySpec(new RefreshTokenSpecs.GetByValue(refreshToken));
            if (token is not null) 
            {
                await tokenRepository.DeleteAsync(token.Id);
                await tokenRepository.SaveAsync();
            }    
        }

        public async Task EmailConfirmAsync(EmailConfirmationModel confirmationModel)
        {
            emailConfirmationModelValidator.ValidateAndThrow(confirmationModel);
            var user = await userManager.FindByIdAsync(confirmationModel.Id.ToString());
            if (user != null)
            {
                var result = await userManager.ConfirmEmailAsync(user, confirmationModel.Token);
                if (!result.Succeeded)
                {
                    throw new HttpException(Errors.InvalidConfirmationData, HttpStatusCode.BadRequest);
                }
            }
        }

        public async Task FogotPasswordAsync(string email) 
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user is not null) 
            {
                var passwordResetToken = await userManager.GeneratePasswordResetTokenAsync(user);
                var mail = EmailTemplates.GetPasswordResetTemplate(configuration["FrontendResetPasswordUrl"]!, passwordResetToken,user.Id);
                await emailService.SendAsync(user.Email, "Скидання пароля", mail, true);
            }
        }

        public async Task ResetPasswordAsync(ResetPasswordModel resetPasswordModel)
        {
            resetPasswordModelValidator.ValidateAndThrow(resetPasswordModel);
            var user = await userManager.FindByIdAsync(resetPasswordModel.UserId.ToString());
            if (user is not null)
            {
                var result = await userManager.ResetPasswordAsync(user,resetPasswordModel.Token,resetPasswordModel.Password);
                if (result.Succeeded) return;
            }
            throw new HttpException(Errors.InvalidResetPasswordData, HttpStatusCode.BadRequest);
        }

        public async Task BlockUserAsync(UserBlockModel userBlockModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            if (userBlockModel.UserIds.Any())
            { 
                var users = await userManager.Users.Where(x => userBlockModel.UserIds.Contains(x.Id)).ToArrayAsync();
                if (users.Length > 0)
                {
                    foreach (var user in users)
                    {
                        bool userLocked = await userManager.IsLockedOutAsync(user);
                        if (!userLocked && userBlockModel.Lock)
                        {
                            var result = await userManager.SetLockoutEndDateAsync(user, userBlockModel.LockoutEndDate.HasValue ? userBlockModel.LockoutEndDate.Value.ToUniversalTime() : DateTime.MaxValue.ToUniversalTime());
                            if (result.Succeeded)
                            {
                                string lockoutEndMessage = userBlockModel.LockoutEndDate is null
                                    ? "На невизначений термін"
                                    : $"Заблокований до {userBlockModel.LockoutEndDate.Value.ToLongDateString()} {userBlockModel.LockoutEndDate.Value.ToLongTimeString()}";
                                var accountBlockedTemplate = EmailTemplates.GetAccountBlockedTemplate(userBlockModel.LockReason ?? "", lockoutEndMessage);
                                await emailService.SendAsync(user.Email, "Ваш акаунт заблоковано", accountBlockedTemplate, true);
                                continue;
                            }
                        }
                        else if (userLocked && !userBlockModel.Lock)
                        {
                            var result = await userManager.SetLockoutEndDateAsync(user, null);
                            if (result.Succeeded)
                            {
                                var accountUnblockedTemplate = EmailTemplates.GetAccountUnblockedTemplate();
                                await emailService.SendAsync(user.Email, "Ваш акаунт розблоковано", accountUnblockedTemplate, true);
                                continue;
                            }
                        }
                        else throw new HttpException(Errors.InvalidLockedOperation, HttpStatusCode.BadRequest);
                    }
                    return;
                }
            }
            throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
        }

    public async Task AddUserAsync(UserCreationModel userModel, bool isAdmin = false)
        {
            if (isAdmin)
            {
                await userManager.UpdateUserActivityAsync(httpContext);
            }
            await RecaptcaVerify(userModel.RecapthcaToken,userModel.Action);

            userCreationModelValidator.ValidateAndThrow(userModel);

            if (!String.IsNullOrEmpty(userModel.SettlementRef) && !await settlementRepository.AnyAsync(x => x.Ref == userModel.SettlementRef))
            {
                throw new HttpException(Errors.InvalidSettlementId, HttpStatusCode.BadRequest);
            }
            if (await userManager.FindByEmailAsync(userModel.Email) is not null)
            {
                throw new HttpException(Errors.EmailAlreadyExist, HttpStatusCode.BadRequest);
            }
            OlxUser user = mapper.Map<OlxUser>(userModel);
            if (userModel.ImageFile is not null)
            {
                user.Photo = await imageService.SaveImageAsync(userModel.ImageFile);
            }

            await CreateUserAsync(user, userModel.Password, isAdmin);
         }

        public async Task RemoveAccountAsync(int id)
        {
           
            var user = await userManager.FindByIdAsync(id.ToString()) 
                ?? throw new HttpException(Errors.InvalidUserEmail, HttpStatusCode.BadRequest);
            if (id != (await GetCurrentUser()).Id) 
            {
                 await userManager.UpdateUserActivityAsync(httpContext);
            }
            if (await userManager.IsInRoleAsync(user, Roles.Admin))
            {
                var adminsCount =  await userManager.GetUsersInRoleAsync(Roles.Admin);
                if (adminsCount.Count <= 1)
                {
                    throw new HttpException(Errors.ActionBlocked, HttpStatusCode.Locked);
                }
            }
                     
            var result = await userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                if (user.Photo is not null)
                {
                    imageService.DeleteImageIfExists(user.Photo);
                }
            }
            else throw new HttpException(Errors.UserRemoveError, HttpStatusCode.InternalServerError);
        }

        public async Task<string> EditUserAsync(UserEditModel userEditModel, bool isAdmin)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var user = await userManager.FindByIdAsync(userEditModel.Id.ToString())
                ?? throw new HttpException(Errors.InvalidUserId,HttpStatusCode.NotFound);

            if (await userManager.IsInRoleAsync(user, Roles.Admin) && !isAdmin)
            {
                throw new HttpException(Errors.ActionBlocked, HttpStatusCode.Forbidden);
            }

            userEditModelValidator.ValidateAndThrow(userEditModel);
            if (userEditModel.OldPassword is not null) 
            {
                var result = await userManager.ChangePasswordAsync(user, userEditModel.OldPassword!, userEditModel.Password!);
                if (!result.Succeeded)
                {
                    throw new HttpException(Errors.CurrentPasswordIsNotValid, HttpStatusCode.BadRequest);
                }
            }
            
            
            mapper.Map(userEditModel,user);
            if (userEditModel.ImageFile is null || userEditModel.ImageFile.ContentType != "image/existing")
            {
                if (user.Photo is not null)
                {
                    imageService.DeleteImageIfExists(user.Photo);
                    user.Photo = null;
                }
                if (userEditModel.ImageFile is not null)
                {
                    user.Photo = await imageService.SaveImageAsync(userEditModel.ImageFile);
                }
            }
            
            await userManager.UpdateAsync(user);

            return jwtService.CreateToken(await jwtService.GetClaimsAsync(user));
        }


        public async Task AddToFavoritesAsync(int advertId)
        {
            var user = await GetCurrentUser();
            if (user.FavoriteAdverts.All(a => a.Id != advertId))
            {
                var advert = await advertRepository.GetItemBySpec(new AdvertSpecs.GetById(advertId, AdvertOpt.Images))
                    ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
                user.FavoriteAdverts.Add(advert);
                await adminMessageService.AdminCreate(
                    new AdminMessageCreationModel
                    {
                        MessageLogo = advert.Images.FirstOrDefault(x => x.Priority == 0)?.Name,
                        Content = $"Користувач \"{user.GetUserDescription()}\" додав ваше оголошення \"{advert.Title}\" в обрані",
                        Subject = "Ваше оголошення було додане в обрані",
                        UserId = advert.UserId
                    });
        }
            await userManager.UpdateAsync(user);
        }

        public async Task AddToFavoritesRangeAsync(IEnumerable<int> advertIds)
        {
            if (advertIds == null || !advertIds.Any())
            {
                throw new HttpException("Advert IDs cannot be empty.", HttpStatusCode.BadRequest);
            }

            var user = await GetCurrentUser();
            var existingFavoriteIds = user.FavoriteAdverts.Select(a => a.Id).ToHashSet();
            var newAdvertIds = advertIds.Where(id => !existingFavoriteIds.Contains(id)).ToList();

            if (!newAdvertIds.Any())
            {
                return;
            }

            var advertsToAdd = await advertRepository.GetListBySpec(new AdvertSpecs.GetByIds(newAdvertIds));
            if (!advertsToAdd.Any())
            {
                throw new HttpException("No valid adverts found.", HttpStatusCode.BadRequest);
            }

            foreach (var advert in advertsToAdd)
            {
                user.FavoriteAdverts.Add(advert);
            }
            await userManager.UpdateAsync(user);

        }

        public async Task RemoveFromFavoritesAsync(int advertId)
        {
            var user = await GetCurrentUser();
            var advertToRemove = user.FavoriteAdverts.FirstOrDefault(x => x.Id == advertId)
                ?? throw new HttpException(Errors.InvalidAdvertId, HttpStatusCode.BadRequest);
            user.FavoriteAdverts.Remove(advertToRemove);
            await userManager.UpdateAsync(user);
        }

        public async Task<IEnumerable<AdvertDto>> GetFavoritesAsync()
        {
            var user = await GetCurrentUser();
            if (user.FavoriteAdverts.Count == 0)
            {
                return [];
            }
            var favoriteAdvertsIds = user.FavoriteAdverts.Select(a => a.Id);
            var adverts = await mapper.ProjectTo<AdvertDto>(advertRepository.GetQuery().Where(x => favoriteAdvertsIds.Contains(x.Id) && !x.Blocked && !x.Completed)).ToArrayAsync();
            return adverts;
        }

        public async Task CheckPasswordAsync(string password)
        {
            var user = await GetCurrentUser();
            if (await userManager.CheckPasswordAsync(user, password))
            {
                return;
            }
            throw new HttpException(Errors.InvalidPassword, HttpStatusCode.BadRequest);
        }
    }
}
