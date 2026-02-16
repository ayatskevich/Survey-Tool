using FluentValidation;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Validators;

public class CreateSurveyDtoValidator : AbstractValidator<CreateSurveyDto>
{
    public CreateSurveyDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Survey title is required.")
            .MaximumLength(200).WithMessage("Survey title cannot exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters.");
    }
}

public class UpdateSurveyDtoValidator : AbstractValidator<UpdateSurveyDto>
{
    public UpdateSurveyDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Survey title is required.")
            .MaximumLength(200).WithMessage("Survey title cannot exceed 200 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters.");
    }
}

public class CreateQuestionDtoValidator : AbstractValidator<CreateQuestionDto>
{
    public CreateQuestionDtoValidator()
    {
        RuleFor(x => x.Text)
            .NotEmpty().WithMessage("Question text is required.")
            .MaximumLength(500).WithMessage("Question text cannot exceed 500 characters.");

        RuleFor(x => x.Order)
            .GreaterThanOrEqualTo(0).WithMessage("Question order must be greater than or equal to 0.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid question type.");
    }
}

public class UpdateQuestionDtoValidator : AbstractValidator<UpdateQuestionDto>
{
    public UpdateQuestionDtoValidator()
    {
        RuleFor(x => x.Text)
            .NotEmpty().WithMessage("Question text is required.")
            .MaximumLength(500).WithMessage("Question text cannot exceed 500 characters.");
    }
}
