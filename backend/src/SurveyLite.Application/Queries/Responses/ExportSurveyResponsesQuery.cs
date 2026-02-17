using MediatR;

namespace SurveyLite.Application.Queries.Responses;

public record ExportSurveyResponsesQuery(
    Guid SurveyId
) : IRequest<byte[]>;
