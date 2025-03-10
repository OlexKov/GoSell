using Olx.BLL.Entities.NewPost;

namespace Olx.BLL.Models.NewPost
{
    public class NewPostResponseModel<T> 
    {
        public T[] Data { get; set; }
    }
}
