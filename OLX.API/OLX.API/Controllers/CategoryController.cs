using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.DTOs.CategoryDtos;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Category;
using Olx.DAL.Data;


namespace OLX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController(ICategoryService categoryService, IMapper mapper, OlxDbContext dbContext) : ControllerBase
    {
        [HttpGet("get")]
        public async Task<IActionResult> GetAll()
        {
            var query = dbContext.Category.AsQueryable()
                .Where(x => x.ParentId == null)
                .ProjectTo<CategoryDto>(mapper.ConfigurationProvider)
                .ToList();
            //    .Include(p => p.Childs)
            //    .ThenInclude(c => c.Childs)
            //    .ThenInclude(c=>c.Childs)
            //    .ToList();// Включення дочірніх сутностей;
            //var list = mapper.Map<List<CategoryDto>>(query);
            return Ok(query);
            //return Ok(await categoryService.GetAllTreeAsync());
        }

        [HttpGet("get/{id:int}")]
        public async Task<IActionResult> GetTree([FromRoute]int id) => Ok(await categoryService.GetTreeAsync(id));

        [HttpPost("get/page")]
        public async Task<IActionResult> GetPage([FromBody] CategoryPageRequest pageRequest) => Ok(await categoryService.GetPageAsync(pageRequest));

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("edit")]
        public async Task<IActionResult> Edit([FromForm] CategoryCreationModel categoryEditModel) => Ok(await categoryService.EditAsync(categoryEditModel));
        
        [Authorize(Roles = Roles.Admin)]
        [HttpPut("create")]
        public async Task<IActionResult> Create([FromForm] CategoryCreationModel categoryCreationModel) => Ok(await categoryService.CreateAsync(categoryCreationModel));
      
        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("delete/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            await categoryService.RemoveAsync(id);
            return Ok();
        }
    }
}
