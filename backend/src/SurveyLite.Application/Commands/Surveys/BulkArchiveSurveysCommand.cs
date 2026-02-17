using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Commands.Surveys;

public record BulkArchiveSurveysCommand(List<string> SurveyIds, bool Archive) : IRequest<BulkArchiveResultDto>;
