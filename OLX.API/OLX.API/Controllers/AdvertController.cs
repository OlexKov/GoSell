
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Olx.BLL.Helpers;
using Olx.BLL.Interfaces;
using Olx.BLL.Models.Advert;


namespace OLX.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertController(IAdvertService advertService) : ControllerBase
    {
        [HttpGet("get")]
        public async Task<IActionResult> GetAll() => Ok(await advertService.GetAllAsync());

        [HttpGet("get/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id) => Ok(await advertService.GetByIdAsync(id));

        [Authorize(Roles = Roles.User)]
        [HttpGet("get/user")]
        public async Task<IActionResult> GetUserAdverts() => Ok(await advertService.GetUserAdvertsAsync());

        [Authorize(Roles = Roles.User)]
        [HttpGet("get/user/locked")]
        public async Task<IActionResult> GetLockedUserAdverts() => Ok(await advertService.GetUserAdvertsAsync(locked:true));

        [Authorize(Roles = Roles.User)]
        [HttpGet("get/user/completed")]
        public async Task<IActionResult> GetCompletedUserAdverts() => Ok(await advertService.GetUserAdvertsAsync(completed:true));

        [Authorize(Roles = Roles.Admin)]
        [HttpGet("get/user/{id:int}")]
        public async Task<IActionResult> GetByUserId([FromRoute] int id) => Ok(await advertService.GetByUserId(id));

        [HttpGet("get/images/{id:int}")]
        public async Task<IActionResult> GetImagesByUserId([FromRoute] int id) => Ok(await advertService.GetImagesAsync(id));

        [HttpPost("get/page")]
        public async Task<IActionResult> GetPage([FromBody] AdvertPageRequest advertPageRequest) =>
            Ok(await advertService.GetPageAsync(advertPageRequest));

        [HttpPost("get/range")]
        public async Task<IActionResult> GetRange([FromBody] IEnumerable<int> ids) => Ok(await advertService.GetRangeAsync(ids));

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("block")]
        public async Task<IActionResult> SetLockedStatus([FromBody] AdvertLockRequest lockRequest)
        {
            await advertService.SetLockedStatusAsync(lockRequest);
            return Ok();
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("approve/{advertId:int}")]
        public async Task<IActionResult> Approve([FromRoute] int advertId)
        {
            await advertService.ApproveAsync(advertId);
            return Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpPost("update")]
        public async Task<IActionResult> Update([FromForm] AdvertCreationModel creationModel) => 
            Ok(await advertService.UpdateAsync(creationModel));


        [Authorize(Roles = Roles.User)]
        [HttpPost("complete/{advertId:int}")]
        public async Task<IActionResult> CompleteAdvert([FromRoute] int advertId) 
        {
            await advertService.SetCompletedAsync(advertId);
            return  Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpPost("buy/{advertId:int}")]
        public async Task<IActionResult> BuyAdvert([FromRoute] int advertId)
        {
            await advertService.BuyAsync(advertId);
            return Ok();
        }


        [Authorize(Roles = Roles.User)]
        [HttpPut("create")]
        public async Task<IActionResult> Create([FromForm] AdvertCreationModel creationModel) => 
            Ok(await advertService.CreateAsync(creationModel));
        
        [Authorize]
        [HttpDelete("delete/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            await advertService.DeleteAsync(id);
            return Ok();
        }

        [Authorize(Roles = Roles.User)]
        [HttpDelete("delete/completed/all")]
        public async Task<IActionResult> DeleteCompleted() => Ok( await advertService.RemoveCompletedAsync());
       
    }
}
