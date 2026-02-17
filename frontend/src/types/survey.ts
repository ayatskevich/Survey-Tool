export enum QuestionType {
  ShortText = 0,
  LongText = 1,
  MultipleChoice = 2,
  Checkboxes = 3,
  Rating = 4,
  Date = 5,
  Email = 6,
}

export const QuestionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.ShortText]: 'Short Text',
  [QuestionType.LongText]: 'Long Text',
  [QuestionType.MultipleChoice]: 'Multiple Choice',
  [QuestionType.Checkboxes]: 'Checkboxes',
  [QuestionType.Rating]: 'Rating',
  [QuestionType.Date]: 'Date',
  [QuestionType.Email]: 'Email',
};
