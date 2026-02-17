using MediatR;
using SurveyLite.Domain.Interfaces;
using System.Text;

namespace SurveyLite.Application.Queries.Responses;

public class ExportSurveyResponsesQueryHandler : IRequestHandler<ExportSurveyResponsesQuery, byte[]>
{
    private readonly IResponseRepository _responseRepository;
    private readonly ISurveyRepository _surveyRepository;

    public ExportSurveyResponsesQueryHandler(
        IResponseRepository responseRepository,
        ISurveyRepository surveyRepository)
    {
        _responseRepository = responseRepository;
        _surveyRepository = surveyRepository;
    }

    public async Task<byte[]> Handle(
        ExportSurveyResponsesQuery request,
        CancellationToken cancellationToken)
    {
        var survey = await _surveyRepository.GetByIdWithQuestionsAsync(request.SurveyId, cancellationToken);
        if (survey == null)
        {
            throw new InvalidOperationException("Survey not found");
        }

        var responses = await _responseRepository.GetAllBySurveyIdWithAnswersAsync(request.SurveyId, cancellationToken);

        var csv = new StringBuilder();

        // Header row
        var headers = new List<string> { "Response ID", "Respondent Email", "Submitted At" };
        headers.AddRange(survey.Questions.OrderBy(q => q.Order).Select(q => EscapeCsvField(q.Text)));
        csv.AppendLine(string.Join(",", headers));

        // Data rows
        foreach (var response in responses)
        {
            var row = new List<string>
            {
                response.Id.ToString(),
                EscapeCsvField(response.RespondentEmail ?? "Anonymous"),
                response.SubmittedAt.ToString("yyyy-MM-dd HH:mm:ss")
            };

            foreach (var question in survey.Questions.OrderBy(q => q.Order))
            {
                var answer = response.Answers.FirstOrDefault(a => a.QuestionId == question.Id);
                row.Add(EscapeCsvField(answer?.AnswerText ?? ""));
            }

            csv.AppendLine(string.Join(",", row));
        }

        return Encoding.UTF8.GetBytes(csv.ToString());
    }

    private static string EscapeCsvField(string field)
    {
        if (string.IsNullOrEmpty(field))
            return "\"\"";

        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (field.Contains(',') || field.Contains('"') || field.Contains('\n') || field.Contains('\r'))
        {
            return $"\"{field.Replace("\"", "\"\"")}\"";
        }

        return field;
    }
}
