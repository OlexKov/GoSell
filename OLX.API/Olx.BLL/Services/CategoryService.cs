using AutoMapper;
using FluentValidation;
using Olx.BLL.DTOs.CategoryDtos;
using Olx.BLL.Entities;
using Olx.BLL.Exceptions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Page;
using Olx.BLL.Pagination.Filters;
using Olx.BLL.Pagination.SortData;
using Olx.BLL.Pagination;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;
using Olx.BLL.Models.Category;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Olx.BLL.Exstensions;
using AutoMapper.QueryableExtensions;
using Olx.BLL.Mapper;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace Olx.BLL.Services
{
    public class CategoryService(
        IRepository<Category> categoryRepository,
        IMapper mapper,
        IImageService imageService,
        IValidator<CategoryCreationModel> validator,
        IFilterService filterService,
        UserManager<OlxUser> userManager,
        IHttpContextAccessor httpContext) : ICategoryService
    {
        
        public async Task<CategoryDto> CreateAsync(CategoryCreationModel creationModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            validator.ValidateAndThrow(creationModel);
            var category = mapper.Map<Category>(creationModel);
            if (creationModel.ImageFile is not null)
            {
                category.Image = await imageService.SaveImageAsync(creationModel.ImageFile);
            }

            if (creationModel.FilterIds?.Any() ?? false)
            {
                var filters = await filterService.GetByIds(creationModel.FilterIds);
                category.Filters = filters.ToList();
            }
            await categoryRepository.AddAsync(category);
            await categoryRepository.SaveAsync();
            return mapper.Map<CategoryDto>(category);
        }

        public async Task RemoveAsync(int id)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            var category = await categoryRepository.GetItemBySpec(new CategorySpecs.GetById(id,CategoryOpt.Image));
            if (category is not null)
            {
                categoryRepository.Delete(category);
                await categoryRepository.SaveAsync();
                if (category.Image is not null)
                {
                    imageService.DeleteImageIfExists(category.Image);
                }
            }
            else throw new HttpException(Errors.InvalidCategoryId,HttpStatusCode.BadRequest);
        }

        public async Task<CategoryDto> EditAsync(CategoryCreationModel editModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            validator.ValidateAndThrow(editModel);
            var category = await categoryRepository.GetItemBySpec( new CategorySpecs.GetById(editModel.Id,CategoryOpt.Image))
                ?? throw new HttpException(Errors.InvalidCategoryId,HttpStatusCode.BadRequest);
            mapper.Map(editModel, category);
            if (editModel.ImageFile is not null)
            {
                if (category.Image is not null)
                {
                    imageService.DeleteImageIfExists(category.Image);
                }
                category.Image = await imageService.SaveImageAsync(editModel.ImageFile);
            }

            if (editModel.FilterIds?.Any() ?? false)
            {
                var filters = await filterService.GetByIds(editModel.FilterIds);
                category.Filters = filters.ToList();
            }
            else category.Filters.Clear();
            await categoryRepository.SaveAsync();
            return mapper.Map<CategoryDto>(category);
        }

        public async Task<IEnumerable<CategoryDto>> GetAllTreeAsync()
        {
            //var query = categoryRepository.GetQuery();
            return await categoryRepository.GetQuery()
                .Include(x => x.Childs)
                .Where(c => c.ParentId == null)
                .ProjectTo<CategoryDto>(mapper.ConfigurationProvider)
                .ToListAsync();
        } 
                   
        public async Task<CategoryDto> GetTreeAsync(int categoryId)
        {
            var categories = await categoryRepository.GetListBySpec(new CategorySpecs.GetAll(CategoryOpt.Parent|CategoryOpt.Filters|CategoryOpt.NoTracking));
            var category = categories.FirstOrDefault(x => x.Id == categoryId)
                ?? throw new HttpException(Errors.InvalidCategoryId,HttpStatusCode.BadRequest);
            category.Childs = BuildTree(categoryId, categories).ToHashSet();
            return mapper.Map<CategoryDto>(category);
        }

        
        private IEnumerable<Category> BuildTree(int? parentId, IEnumerable<Category> categories)
        {
            return categories.AsParallel()
                .Where(c => c.ParentId == parentId)
                .Select(c =>
                {
                    c.Childs = BuildTree(c.Id, categories).ToList();
                    return c;
                });
        }

        public async Task<PageResponse<CategoryDto>> GetPageAsync(CategoryPageRequest pageRequest)
        {
            var paginationBuilder = new PaginationBuilder<Category>(categoryRepository);
            var filter = new CategoryFilter(pageRequest.SearchName, pageRequest.ParentId);
            var sortData = new CategorySortData(pageRequest.IsDescending, pageRequest.SortIndex);
            var page = await paginationBuilder.GetPageAsync(pageRequest.Page, pageRequest.Size, filter, sortData);
            return new()
            {
                Total = page.Total,
                Items = mapper.Map<IEnumerable<CategoryDto>>(page.Items)
            };
        }
    }
}
