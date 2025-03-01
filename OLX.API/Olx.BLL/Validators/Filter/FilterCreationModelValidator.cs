using FluentValidation;
using Olx.BLL.Models.FilterModels;
using Olx.BLL.Resources;

namespace Olx.BLL.Validators.Filter
{
    public class FilterCreationModelValidator : AbstractValidator<FilterCreationModel>
    {
        public FilterCreationModelValidator()
        {
            RuleFor(x => x.Name)
                .MaximumLength(100).WithMessage($"{ValidationErrors.MaxSymbolsCountError} 100 symbols")
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty);
            RuleFor(x => x.Values).NotEmpty().WithMessage(ValidationErrors.NotEmpty);
        }
    }
}
