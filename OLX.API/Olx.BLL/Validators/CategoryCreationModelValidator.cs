using FluentValidation;
using Olx.BLL.Models.Category;
using Olx.BLL.Resources;
using Olx.BLL.Validators.Extentions;

namespace Olx.BLL.Validators
{
    public class CategoryCreationModelValidator : AbstractValidator<CategoryCreationModel>
    {
        public CategoryCreationModelValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThanOrEqualTo(0).WithMessage(ValidationErrors.GreaterEqualZeroError);
            RuleFor(x => x.ImageFile)
                .ImageFile()
                .When(x => x.ImageFile != null);
            RuleFor(x => x.ParentId)
                .GreaterThanOrEqualTo(0).WithMessage(ValidationErrors.GreaterEqualZeroError)
                .When(x => x.ParentId != null); ;
        }
    }
}
