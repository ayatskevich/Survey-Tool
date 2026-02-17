using FluentValidation;
using SurveyLite.Application.Commands.Questions;

namespace SurveyLite.Application.Validators;

public class ReorderQuestionsCommandValidator : AbstractValidator<ReorderQuestionsCommand>
{
    public ReorderQuestionsCommandValidator()
    {
        RuleFor(x => x.SurveyId)
            .NotEmpty().WithMessage("Survey ID is required.");

        RuleFor(x => x.Questions)
            .NotEmpty().WithMessage("At least one question must be specified for reordering.");

        RuleForEach(x => x.Questions).ChildRules(question =>
        {
            question.RuleFor(q => q.Id)
                .NotEmpty().WithMessage("Question ID is required.");

            question.RuleFor(q => q.Order)
                .GreaterThanOrEqualTo(0).WithMessage("Order must be a non-negative number.");
        });
    }
}
