using FluentValidation;
using SurveyLite.Application.Commands.Questions;

namespace SurveyLite.Application.Validators;

public class UpdateQuestionCommandValidator : AbstractValidator<UpdateQuestionCommand>
{
    public UpdateQuestionCommandValidator()
    {
        RuleFor(x => x.SurveyId)
            .NotEmpty().WithMessage("Survey ID is required.");

        RuleFor(x => x.QuestionId)
            .NotEmpty().WithMessage("Question ID is required.");

        RuleFor(x => x.Text)
            .NotEmpty().WithMessage("Question text is required.")
            .MaximumLength(500).WithMessage("Question text must not exceed 500 characters.");

        RuleFor(x => x.Options)
            .Must(BeValidJson).When(x => !string.IsNullOrWhiteSpace(x.Options))
            .WithMessage("Options must be valid JSON.");

        RuleFor(x => x.ValidationRules)
            .Must(BeValidJson).When(x => !string.IsNullOrWhiteSpace(x.ValidationRules))
            .WithMessage("Validation rules must be valid JSON.");
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
