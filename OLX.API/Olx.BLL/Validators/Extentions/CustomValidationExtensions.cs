using FluentValidation;
using Microsoft.AspNetCore.Http;
using Olx.BLL.Helpers;
using Olx.BLL.Resources;

namespace Olx.BLL.Validators.Extentions
{
    public static class CustomValidationExtensions
    {
        public static IRuleBuilderOptions<T, string?> PhoneNumber<T>(this IRuleBuilder<T, string?> ruleBuilder)
        {
            return ruleBuilder
                .Matches(@"^(\+38\s?\(\d{3}\)\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}|)$");
        }

        public static IRuleBuilderOptions<T, IEnumerable<IFormFile>> ImageFile<T>(this IRuleBuilder<T, IEnumerable<IFormFile>> ruleBuilder)
        {
            return ruleBuilder.Must(x => FileTypes.AllowedImageFileTypes.Any(z => x.Any(y => y.ContentType == z)));
        }

        public static IRuleBuilderOptions<T, IFormFile?> ImageFile<T>(this IRuleBuilder<T, IFormFile?> ruleBuilder)
        {
            return ruleBuilder.Must(x => x != null && FileTypes.AllowedImageFileTypes.Contains(x.ContentType));
        }

        public static IRuleBuilderOptions<T, string?> Password<T>(this IRuleBuilder<T, string?> ruleBuilder)
        {
            return ruleBuilder.Matches(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{6,}$");
        }

        public static IRuleBuilderOptions<T, string?> MinMaxLength<T>(this IRuleBuilder<T, string?> ruleBuilder,int min,int max)
        {
            return ruleBuilder.MaximumLength(max).WithMessage($"{ValidationErrors.MaxSymbolsCountError} {max} symbols")
                              .MinimumLength(min).WithMessage($"{ValidationErrors.MinSymbolsCountError} {min} symbols");
        }
    }
}
