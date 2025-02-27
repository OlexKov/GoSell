
namespace Olx.BLL.Models.NewPost
{
    public class NewPostMethodProperties
    {
        /// <summary>
        /// Номер сторінки
        /// </summary>
        public int Page { get; set; } = 1;
       
        /// <summary>
        /// Кількість населених пунктів за 1 запит
        /// </summary>
        public int Limit { get; set; }

        /// <summary>
        /// Посилання на область
        /// </summary>
        public string AreaRef { get; init; } = string.Empty;

        public string RegionRef { get; init; } = string.Empty;
    }
}
