using MediatR;
using SurveyLite.Application.DTOs;
using SurveyLite.Domain.Interfaces;

namespace SurveyLite.Application.Commands.Surveys;

public class BulkArchiveSurveysCommandHandler : IRequestHandler<BulkArchiveSurveysCommand, BulkArchiveResultDto>
{
    private readonly ISurveyRepository _surveyRepository;

    public BulkArchiveSurveysCommandHandler(ISurveyRepository surveyRepository)
    {
        _surveyRepository = surveyRepository;
    }

    public async Task<BulkArchiveResultDto> Handle(BulkArchiveSurveysCommand request, CancellationToken cancellationToken)
    {
        if (request.SurveyIds == null || !request.SurveyIds.Any())
        {
            throw new ArgumentException("No survey IDs provided");
        }

        int updatedCount = 0;

        foreach (var surveyId in request.SurveyIds)
        {
            try
            {
                var survey = await _surveyRepository.GetByIdAsync(Guid.Parse(surveyId), cancellationToken);
                if (survey != null)
                {
                    if (request.Archive)
                    {
                        survey.Archive();
                    }
                    else
                    {
                        survey.Unarchive();
                    }

                    await _surveyRepository.UpdateAsync(survey, cancellationToken);
                    updatedCount++;
                }
            }
            catch (FormatException)
            {
                // Skip invalid GUIDs
                continue;
            }
        }

        return new BulkArchiveResultDto
        {
            Success = true,
            Message = request.Archive
                ? $"{updatedCount} survey(ies) successfully archived"
                : $"{updatedCount} survey(ies) successfully unarchived",
            Count = updatedCount
        };
    }
}
