using FluentValidation;
using Olx.BLL.Models.User;
using Olx.BLL.Resources;
using Olx.BLL.Validators.Extentions;

namespace Olx.BLL.Validators.User
{
    public class UserCreationModelValidator : AbstractValidator<UserCreationModel>
    {
        public UserCreationModelValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .EmailAddress().WithMessage(ValidationErrors.InvalidEmail);
            RuleFor(x => x.Password)
                .Password().WithMessage(ValidationErrors.InvalidPassword);
            RuleFor(x => x.PasswordConfirmation)
                .Equal(x => x.Password).WithMessage(ValidationErrors.NotMatchPasswordsError);
            RuleFor(x => x.About)
                .MinMaxLength(40,4000)
                .When(x => x.About is not null);
            RuleFor(x => x.FirstName)
                .MinMaxLength(2,100)
                .When(x => x.FirstName is not null);
            RuleFor(x => x.LastName)
                .MinMaxLength(2, 100)
                .When(x => x.FirstName is not null);
            RuleFor(x => x.PhoneNumber)
                .PhoneNumber().WithMessage(ValidationErrors.InvalidPhoneNumber)
                .When(x => x.PhoneNumber != null);
            RuleFor(x => x.ImageFile)
                .ImageFile().WithMessage(ValidationErrors.InvalidImageFileType)
                .When(x => x.ImageFile != null);
        }
    }
}
