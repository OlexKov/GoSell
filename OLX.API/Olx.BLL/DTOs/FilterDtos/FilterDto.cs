
namespace Olx.BLL.DTOs.FilterDtos
{
    public class FilterDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public IEnumerable<FilterValueDto>? Values { get; set; }
    }
}
