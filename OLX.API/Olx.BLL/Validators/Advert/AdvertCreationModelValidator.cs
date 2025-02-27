using FluentValidation;
using Olx.BLL.Models.Advert;
using Olx.BLL.Resources;
using Olx.BLL.Validators.Extentions;

namespace Olx.BLL.Validators.Advert
{
    public class AdvertCreationModelValidator : AbstractValidator<AdvertCreationModel>
    {
        public AdvertCreationModelValidator()
        {
            RuleFor(x => x.SettlementRef)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty);
            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0).WithMessage(ValidationErrors.GreaterEqualZeroError);
            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage(ValidationErrors.GreaterZeroError);
            RuleFor(x=>x.CategoryId)
                .GreaterThan(0).WithMessage(ValidationErrors.GreaterZeroError);
            RuleFor(x => x.ContactEmail)
               .EmailAddress().WithMessage(ValidationErrors.InvalidEmail);
            RuleFor(x => x.ContactPersone)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty);
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .MaximumLength(5000).WithMessage($"{ValidationErrors.MaxSymbolsCountError} 5000 symbols");
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .MaximumLength(256).WithMessage($"{ValidationErrors.MaxSymbolsCountError} 256 symbols");
            RuleFor(x => x.ImageFiles)
                .NotEmpty().WithMessage(ValidationErrors.NotEmpty)
                .ImageFile().WithMessage(ValidationErrors.InvalidImageFileType);
            RuleFor(x => x.PhoneNumber)
                .PhoneNumber().WithMessage(ValidationErrors.InvalidPhoneNumber);
        }
    }
}
