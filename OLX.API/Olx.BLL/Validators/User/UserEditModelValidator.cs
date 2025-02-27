using FluentValidation;
using Olx.BLL.Models.User;
using Olx.BLL.Resources;
using Olx.BLL.Validators.Extentions;

namespace Olx.BLL.Validators.User
{
    public class UserEditModelValidator : AbstractValidator<UserEditModel>
    {
        public UserEditModelValidator()
        {
            RuleFor(x => x.OldPassword)
                .Password().WithMessage(ValidationErrors.InvalidPassword)
                .When(x => x.OldPassword is not null);
            RuleFor(x => x.Password)
                .Password().WithMessage(ValidationErrors.InvalidPassword)
                .When(x => x.OldPassword is not null && x.Password is not null);
            RuleFor(x => x.PasswordConfirmation)
                .Equal(x => x.Password).WithMessage(ValidationErrors.NotMatchPasswordsError)
                .When(x => x.OldPassword is not null && x.Password is not null && x.PasswordConfirmation is not null);
            RuleFor(x => x.About)
                .MinMaxLength(40,4000)
                .When(x => x.About is not null);
            RuleFor(x => x.FirstName)
                .MinMaxLength(2,100)
                .When(x => x.FirstName is not null);
            RuleFor(x => x.LastName)
               .MinMaxLength(2,100)
               .When(x => x.FirstName is not null);
            RuleFor(x => x.PhoneNumber)
                .PhoneNumber().WithMessage(ValidationErrors.InvalidPhoneNumber);
            RuleFor(x => x.ImageFile)
               .ImageFile().WithMessage(ValidationErrors.InvalidImageFileType)
               .When(x => x.ImageFile != null);
        }
    }
}
