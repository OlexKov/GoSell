using FluentValidation;
using Olx.BLL.Models.AdminMessage;
using Olx.BLL.Resources;
using Olx.BLL.Validators.Extentions;

namespace Olx.BLL.Validators
{
    public class AdminMessageCreationModelValidator : AbstractValidator<AdminMessageCreationModel>
    {
        public AdminMessageCreationModelValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .MinMaxLength(10,2000);
            RuleFor(x => x.Subject)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .MinMaxLength(10, 200);
        }

    }
}
