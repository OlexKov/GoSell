using AutoMapper;
using Olx.BLL.Entities;

namespace Olx.BLL.DTOs
{
    [AutoMap(typeof(AdvertImage))]
    public class AdvertImageDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int AdvertId { get; set; }
        public int Priority { get; set; }
    }
}
