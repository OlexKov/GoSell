using AutoMapper;
using Olx.BLL.Entities.FilterEntities;

namespace Olx.BLL.DTOs.FilterDtos
{
    [AutoMap(typeof(FilterValue))]
    public class FilterValueDto
    {
        public int Id { get; set; }
        public int FilterId { get; set; }
        public string Value { get; set; } = string.Empty;
    }
}
