using System.Text;
using System.Text.Json;
using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Queries.Analytics;

public class ExportAnalyticsQueryHandler : IRequestHandler<ExportAnalyticsQuery, ExportResultDto>
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IResponseRepository _responseRepository;

    public ExportAnalyticsQueryHandler(
        ISurveyRepository surveyRepository,
        IResponseRepository responseRepository)
    {
        _surveyRepository = surveyRepository;
        _responseRepository = responseRepository;
    }

    public async Task<ExportResultDto> Handle(ExportAnalyticsQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.SurveyId))
        {
            throw new ArgumentException("Survey ID cannot be empty");
        }

        var survey = await _surveyRepository.GetByIdWithQuestionsAsync(Guid.Parse(request.SurveyId), cancellationToken);
        if (survey == null)
        {
            throw new InvalidOperationException($"Survey with ID {request.SurveyId} not found");
        }

        // Get all responses with answers
        var allResponses = await _responseRepository.GetAllBySurveyIdWithAnswersAsync(survey.Id, cancellationToken);

        // Filter by date range if specified
        var responses = allResponses.AsEnumerable();
        if (request.FromDate.HasValue)
        {
            responses = responses.Where(r => r.SubmittedAt >= request.FromDate.Value);
        }
        if (request.ToDate.HasValue)
        {
            var toDate = request.ToDate.Value.AddDays(1).AddTicks(-1);
            responses = responses.Where(r => r.SubmittedAt <= toDate);
        }

        var responseList = responses.ToList();

        if (request.Format.ToLower() == "csv")
        {
            var csvContent = GenerateCsv(survey, responseList, request.IncludeAnswers);
            return new ExportResultDto
            {
                Success = true,
                Message = $"Exported {responseList.Count} responses to CSV",
                FileContent = csvContent,
                FileName = $"{survey.Title.Replace(" ", "_")}_{DateTime.UtcNow:yyyyMMdd}.csv",
                ContentType = "text/csv"
            };
        }
        else // json
        {
            var jsonContent = GenerateJson(survey, responseList, request.IncludeAnswers);
            return new ExportResultDto
            {
                Success = true,
                Message = $"Exported {responseList.Count} responses to JSON",
                FileContent = jsonContent,
                FileName = $"{survey.Title.Replace(" ", "_")}_{DateTime.UtcNow:yyyyMMdd}.json",
                ContentType = "application/json"
            };
        }
    }

    private string GenerateCsv(Domain.Entities.Survey survey, List<Domain.Entities.Response> responses, bool includeAnswers)
    {
        var csv = new StringBuilder();

        // Build header
        var headers = new List<string> { "Response ID", "Respondent Email", "Submitted At" };
        
        if (includeAnswers)
        {
            foreach (var question in survey.Questions.OrderBy(q => q.Order))
            {
                headers.Add($"Q{question.Order}: {question.Text}");
            }
        }

        csv.AppendLine(string.Join(",", headers.Select(h => EscapeCsvField(h))));

        // Build rows
        foreach (var response in responses.OrderBy(r => r.SubmittedAt))
        {
            var row = new List<string>
            {
                response.Id.ToString(),
                response.RespondentEmail ?? "Anonymous",
                response.SubmittedAt.ToString("yyyy-MM-dd HH:mm:ss")
            };

            if (includeAnswers)
            {
                foreach (var question in survey.Questions.OrderBy(q => q.Order))
                {
                    var answer = response.Answers.FirstOrDefault(a => a.QuestionId == question.Id);
                    row.Add(EscapeCsvField(answer?.AnswerText ?? ""));
                }
            }

            csv.AppendLine(string.Join(",", row));
        }

        return csv.ToString();
    }

    private string GenerateJson(Domain.Entities.Survey survey, List<Domain.Entities.Response> responses, bool includeAnswers)
    {
        var exportData = new
        {
            survey = new
            {
                id = survey.Id.ToString(),
                title = survey.Title,
                description = survey.Description,
                totalResponses = responses.Count
            },
            responses = responses.Select(r => new
            {
                id = r.Id.ToString(),
                respondentEmail = r.RespondentEmail ?? "Anonymous",
                submittedAt = r.SubmittedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                answers = includeAnswers ? r.Answers.Select(a =>
                {
                    var question = survey.Questions.FirstOrDefault(q => q.Id == a.QuestionId);
                    return new
                    {
                        questionId = a.QuestionId.ToString(),
                        questionText = question?.Text ?? "Unknown",
                        answerText = a.AnswerText
                    };
                }).ToList() : null
            }).ToList()
        };

        return JsonSerializer.Serialize(exportData, new JsonSerializerOptions
        {
            WriteIndented = true
        });
    }

    private string EscapeCsvField(string field)
    {
        if (string.IsNullOrEmpty(field))
            return "\"\"";

        // Escape double quotes and wrap in quotes if field contains comma, newline, or quotes
        if (field.Contains(",") || field.Contains("\"") || field.Contains("\n") || field.Contains("\r"))
        {
            return $"\"{field.Replace("\"", "\"\"")}\"";
        }

        return $"\"{field}\"";
    }
}
