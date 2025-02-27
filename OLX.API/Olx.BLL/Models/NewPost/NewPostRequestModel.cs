using Newtonsoft.Json;

namespace Olx.BLL.Models.NewPost
{
    public class NewPostRequestModel
    {
        [JsonProperty(PropertyName = "apiKey")]
        public string ApiKey { get; init; }

        [JsonProperty(PropertyName = "modelName")]
        public string ModelName { get; init; }

        [JsonProperty(PropertyName = "calledMethod")]
        public string CalledMethod { get; init; }

        [JsonProperty(PropertyName = "methodProperties")]
        public NewPostMethodProperties MethodProperties { get; init; }

             

        public NewPostRequestModel(string apiKey,string modelName,string calledMethod,int page = 1,int limit = 0,string areaRef = "",string regionRef = "")
        {
            ApiKey = apiKey;
            ModelName = modelName;
            CalledMethod = calledMethod;
            MethodProperties = new NewPostMethodProperties() { Limit = limit,Page = page,AreaRef = areaRef, RegionRef = regionRef};
        }
    }
}
