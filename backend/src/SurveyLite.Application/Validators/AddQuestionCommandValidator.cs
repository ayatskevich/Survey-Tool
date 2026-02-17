using FluentValidation;
using SurveyLite.Application.Commands.Questions;
using SurveyLite.Domain.Enums;

namespace SurveyLite.Application.Validators;

public class AddQuestionCommandValidator : AbstractValidator<AddQuestionCommand>
{
    public AddQuestionCommandValidator()
    {
        RuleFor(x => x.SurveyId)
            .NotEmpty().WithMessage("Survey ID is required.");

        RuleFor(x => x.Text)
            .NotEmpty().WithMessage("Question text is required.")
            .MaximumLength(500).WithMessage("Question text must not exceed 500 characters.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid question type.");

        RuleFor(x => x.Order)
            .GreaterThanOrEqualTo(0).WithMessage("Order must be a non-negative number.");

        RuleFor(x => x.Options)
            .Must(BeValidJson).When(x => !string.IsNullOrWhiteSpace(x.Options))
            .WithMessage("Options must be valid JSON.");

        RuleFor(x => x.ValidationRules)
            .Must(BeValidJson).When(x => !string.IsNullOrWhiteSpace(x.ValidationRules))
            .WithMessage("Validation rules must be valid JSON.");

        RuleFor(x => x.Options)
            .NotEmpty()
            .When(x => x.Type == QuestionType.MultipleChoice || x.Type == QuestionType.Checkboxes)
            .WithMessage("Options are required for multiple choice and checkbox questions.");
    }

    private bool BeValidJson(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return true;

        try
        {
            System.Text.Json.JsonDocument.Parse(json);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
