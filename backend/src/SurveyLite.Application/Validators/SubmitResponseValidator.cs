using FluentValidation;
using SurveyLite.Application.Commands.Responses;

namespace SurveyLite.Application.Validators;

public class SubmitResponseValidator : AbstractValidator<SubmitResponseCommand>
{
    public SubmitResponseValidator()
    {
        RuleFor(x => x.SurveyId)
            .NotEmpty()
            .WithMessage("Survey ID is required");

        RuleFor(x => x.Answers)
            .NotEmpty()
            .WithMessage("At least one answer is required");

        RuleFor(x => x.RespondentEmail)
            .EmailAddress()
            .When(x => !string.IsNullOrWhiteSpace(x.RespondentEmail))
            .WithMessage("Invalid email format");

        RuleForEach(x => x.Answers)
            .ChildRules(answer =>
            {
                answer.RuleFor(a => a.QuestionId)
                    .NotEmpty()
                    .WithMessage("Question ID is required");

                answer.RuleFor(a => a.AnswerText)
                    .NotNull()
                    .WithMessage("Answer text cannot be null");
            });
    }
}
