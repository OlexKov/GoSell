using FluentValidation;
using Olx.BLL.Models;
using Olx.BLL.Resources;

namespace Olx.BLL.Validators
{
    public class EmailComfirmationModelValidator : AbstractValidator<EmailConfirmationModel>
    {
        public EmailComfirmationModelValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage(ValidationErrors.GreaterZeroError);
            RuleFor(x => x.Token)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty);
        }
    }
}

