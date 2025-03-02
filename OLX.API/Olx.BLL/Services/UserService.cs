using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.DTOs.OlxUserDtos;
using Olx.BLL.Entities;
using Olx.BLL.Exceptions;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Page;
using Olx.BLL.Models.User;
using Olx.BLL.Pagination;
using Olx.BLL.Pagination.Filters;
using Olx.BLL.Pagination.SortData;
using Olx.BLL.Resources;
using System.Net;

namespace Olx.BLL.Services
{
    public class UserService(
        UserManager<OlxUser> userManager,
        RoleManager<IdentityRole<int>> roleManager,
        IRepository<IdentityUserRole<int>> userRolesRepo,
        IRepository<OlxUser> userRepo,
        IMapper mapper) : IUserService
    {
        private async Task<IEnumerable<int>> _getAdminsIds() 
        {
            var adminRole = await roleManager.FindByNameAsync(Roles.Admin) 
                ?? throw new HttpException(Errors.InvalidRole,HttpStatusCode.InternalServerError);
            var adminIds = userRolesRepo.GetQuery()
                .Where(x => x.RoleId == adminRole.Id)
                .Select(z => z.UserId);
            return adminIds;
        }

        public async Task<IEnumerable<OlxUserDto>> Get(bool isAdmin = false) 
        {
            var adminsIds = await _getAdminsIds();
            var users = await mapper.ProjectTo<OlxUserDto>(userRepo.GetQuery()
                .Where(x => isAdmin == adminsIds.Contains(x.Id)))
                .ToListAsync();
            return users;
        } 

        public async Task<OlxUserDto> Get(int id, bool isAdmin = false) 
        {
            var userDto = await mapper.ProjectTo<OlxUserDto>(userRepo.GetQuery().Where(x => x.Id == id)).SingleOrDefaultAsync();
            if (userDto is not null)
            {
                var user = await userRepo.GetByIDAsync(id);
                if (user is not null && (await userManager.IsInRoleAsync(user, Roles.Admin)) == isAdmin)
                {
                    return userDto;
                }
            }
            throw new HttpException(Errors.InvalidUserId, HttpStatusCode.BadRequest);
        }
        

        public async Task<PageResponse<OlxUserDto>> Get(UserPageRequest userPageRequest)
        {
            var adminsIds = await _getAdminsIds();
            var query = mapper.ProjectTo<OlxUserDto>(userRepo.GetQuery()
                .Where(x => adminsIds.Any(z => z == x.Id == userPageRequest.IsAdmin) && ((x.LockoutEnd != null && x.LockoutEnd > DateTime.Now) == userPageRequest.IsLocked))
                .AsNoTracking());
            var paginationBuilder = new PaginationBuilder<OlxUserDto>(query);
            var userFilter = mapper.Map<OlxUserFilter>(userPageRequest);
            var sortData = new OlxUserSortData(userPageRequest.IsDescending,userPageRequest.SortKey);
            var page = await paginationBuilder.GetPageAsync(userPageRequest.Page,userPageRequest.Size,userFilter,sortData);
            return new()
            {
                Total = page.Total,
                Items = page.Items
            };
        }

        public async Task<IEnumerable<OlxUserDto>> GetLocked() =>
            await mapper.ProjectTo<OlxUserDto>(userRepo.GetQuery().Where(x => x.LockoutEnd != null && x.LockoutEnd > DateTime.Now)).ToArrayAsync();
    }
}
