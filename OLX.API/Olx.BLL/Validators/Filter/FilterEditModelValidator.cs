using FluentValidation;
using Olx.BLL.Models.FilterModels;
using Olx.BLL.Resources;

namespace Olx.BLL.Validators.Filter
{
    public class FilterEditModelValidator : AbstractValidator<FilterEditModel>
    {
        public FilterEditModelValidator()
        {
            RuleFor(x => x.Name)
                .MaximumLength(100).WithMessage($"{ValidationErrors.MaxSymbolsCountError} 100 symbols")
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty);
            RuleFor(x => x.Id).GreaterThan(0).WithMessage(ValidationErrors.GreaterZeroError);
        }
    }
}
