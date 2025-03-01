using FluentValidation;
using Olx.BLL.Models.Authentication;
using Olx.BLL.Resources;
using Olx.BLL.Validators.Extentions;

namespace Olx.BLL.Validators
{
    public class AuthRequestValidator : AbstractValidator<AuthRequest>
    {
        public AuthRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .EmailAddress().WithMessage(ValidationErrors.InvalidEmail);
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .Password();
            RuleFor(x => x.RecapthcaToken)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty);
            RuleFor(x => x.Action)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty);
        }
    }
}
