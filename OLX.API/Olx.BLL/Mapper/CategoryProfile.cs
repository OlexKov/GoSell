using AutoMapper;
using Olx.BLL.DTOs.CategoryDtos;
using Olx.BLL.Entities;
using Olx.BLL.Models.Category;


namespace Olx.BLL.Mapper
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<CategoryCreationModel, Category>();
            CreateMap<Category, CategoryDto>()
                //.ForMember(x => x.Filters, opt => opt.MapFrom(z => z.Filters.Select(y => y.Id)))
                //.ForMember(x => x.Childs, opt => opt.MapFrom(x => x.Childs));
            .ForMember(dest => dest.Childs, opt => opt.MapFrom(src => src.Childs));
        }
    }
}
