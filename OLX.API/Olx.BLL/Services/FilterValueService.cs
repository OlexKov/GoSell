using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.DTOs.FilterDtos;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Interfaces;
using Olx.BLL.Specifications;

namespace Olx.BLL.Services
{
    public class FilterValueService(
        IRepository<FilterValue> valueRepository,
        IMapper mapper) : IFilterValueService
    {
        
        public async Task<IEnumerable<FilterValue>> GetByIdsAsync(IEnumerable<int> ids) => 
            await valueRepository.GetListBySpec(new FilterValueSpecs.GetByIds(ids, true));

        public async Task<IEnumerable<FilterValueDto>> GetDtoByIdsAsync(IEnumerable<int> ids) =>
            await mapper.ProjectTo<FilterValueDto>(valueRepository.GetQuery().Where(x=>ids.Contains(x.Id))).ToArrayAsync();

        public async Task<IEnumerable<FilterValueDto>> GetAllAsync() => await mapper.ProjectTo<FilterValueDto>(valueRepository.GetQuery()).ToArrayAsync();
    }
}
