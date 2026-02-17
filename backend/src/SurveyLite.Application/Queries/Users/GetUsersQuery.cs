using MediatR;
using SurveyLite.Application.DTOs;

namespace SurveyLite.Application.Queries.Users;

public record GetUsersQuery(UserFiltersDto Filters) : IRequest<UserPageDto>;
