using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Category;


namespace OLX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController(ICategoryService categoryService) : ControllerBase
    {
        [HttpGet("get")]
        public async Task<IActionResult> Get() => Ok(await categoryService.Get());

        [HttpGet("get/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id) => Ok(await categoryService.GetById(id));

        [HttpGet("get/tree")]
        public async Task<IActionResult> GetTree() => Ok(await categoryService.GetAllTreeAsync());

        [HttpGet("get/tree/{id:int}")]
        public async Task<IActionResult> GetTreeById([FromRoute]int id) => Ok(await categoryService.GetTreeAsync(id));

        [HttpPost("get/page")]
        public async Task<IActionResult> GetPage([FromBody] CategoryPageRequest pageRequest) => 
            Ok(await categoryService.GetPageAsync(pageRequest));

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("edit")]
        public async Task<IActionResult> Edit([FromForm] CategoryCreationModel categoryEditModel) => 
            Ok(await categoryService.EditAsync(categoryEditModel));
        
        [Authorize(Roles = Roles.Admin)]
        [HttpPut("create")]
        public async Task<IActionResult> Create([FromForm] CategoryCreationModel categoryCreationModel) => 
            Ok(await categoryService.CreateAsync(categoryCreationModel));
      
        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("delete/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            await categoryService.RemoveAsync(id);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("delete/tree/{id:int}")]
        public async Task<IActionResult> DeleteTree([FromRoute] int id)
        {
            await categoryService.RemoveTreeAsync(id);
            return Ok();
        }
    }
}
