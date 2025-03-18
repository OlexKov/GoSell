using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.DTOs.FilterDtos;
using Olx.BLL.Entities;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Exceptions;
using Olx.BLL.Exstensions;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.FilterModels;
using Olx.BLL.Models.Page;
using Olx.BLL.Pagination;
using Olx.BLL.Pagination.Filters;
using Olx.BLL.Pagination.SortData;
using Olx.BLL.Resources;
using Olx.BLL.Specifications;
using System.Net;

namespace Olx.BLL.Services
{
    public class FilterService(
        IRepository<Filter> filterRepository,
        IValidator<FilterCreationModel> filterCreationModelValidator,
        IValidator<FilterEditModel> filterEditModelValidator,
        IMapper mapper,
        UserManager<OlxUser> userManager,
        IHttpContextAccessor httpContext) : IFilterService
    {

        public async Task<FilterDto> CreateAsync(FilterCreationModel filterModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            filterCreationModelValidator.ValidateAndThrow(filterModel);
            var filter = mapper.Map<Filter>(filterModel);
            await filterRepository.AddAsync(filter);
            await filterRepository.SaveAsync();
            return mapper.Map<FilterDto>(filter);
        }

        public async Task<IEnumerable<Filter>> GetByIds(IEnumerable<int> ids) =>
            await filterRepository.GetListBySpec(new FilterSpecs.GetByIds(ids, FilterOpt.Values));

        public async Task<IEnumerable<FilterDto>> GetDtoByIds(IEnumerable<int> ids) =>
            await mapper.ProjectTo<FilterDto>(filterRepository.GetQuery().Where(x => ids.Contains(x.Id))).ToArrayAsync();
        

        public async Task<IEnumerable<FilterDto>> GetAll() =>
            await mapper.ProjectTo<FilterDto>(filterRepository.GetQuery()).ToArrayAsync();

        public async Task RemoveAsync(int id)
        {
            var filter = await filterRepository.GetByIDAsync(id)
                ?? throw new HttpException(Errors.InvalidFilterId, HttpStatusCode.BadRequest);
            filterRepository.Delete(filter);
            await filterRepository.SaveAsync();
          }

        public async Task<FilterDto> EditAsync(FilterEditModel filterModel)
        {
            await userManager.UpdateUserActivityAsync(httpContext);
            filterEditModelValidator.ValidateAndThrow(filterModel);
            var filter = await filterRepository.GetItemBySpec(new FilterSpecs.GetById(filterModel.Id, FilterOpt.Values))
                ?? throw new HttpException(Errors.InvalidFilterId, HttpStatusCode.BadRequest);
            
            mapper.Map(filterModel,filter);
            if (filterModel.OldValues.Length != 0)
            {
                var filters = filter.Values.Where(x => filterModel.OldValues.Any(z => z.Id == x.Id)).ToList();
                foreach (var value in filters) 
                {
                    var newValue = filterModel.OldValues.First(x => x.Id == value.Id).Value;
                    if (newValue != value.Value) 
                    {
                        value.Value = newValue;
                    }
                }
                filter.Values = filters;
            }
            else filter.Values.Clear();

            if (filterModel.NewValues.Length != 0)
            {
                filter.Values = [.. filter.Values, .. filterModel.NewValues.Select(x => new FilterValue() { Value = x })];
            }
            await filterRepository.SaveAsync();
            return mapper.Map<FilterDto>(filter);
        }

        public async Task<PageResponse<FilterDto>> GetPageAsync(FilterPageRequest pageRequest)
        {
            var query = mapper.ProjectTo<FilterDto>(filterRepository.GetQuery());
            var paginationBuilder = new PaginationBuilder<FilterDto>(query);
            var filter = new FiltersFilter(pageRequest.SearchName?.Trim());
            var sortData =  new FilterSortData(pageRequest.IsDescending,pageRequest.SortKey);
            var page = await paginationBuilder.GetPageAsync(pageRequest.Page,pageRequest.Size, filter, sortData);
            return new()
            {
                Total = page.Total,
                Items = page.Items
            };
        }
    }
}
