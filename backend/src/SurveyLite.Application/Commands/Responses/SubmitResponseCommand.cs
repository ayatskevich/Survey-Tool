using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Commands.Responses;

public record SubmitResponseCommand(
    Guid SurveyId,
    string? RespondentEmail,
    IEnumerable<AnswerSubmissionDto> Answers,
    string? IpAddress
) : IRequest<ResponseSubmissionResult>;
