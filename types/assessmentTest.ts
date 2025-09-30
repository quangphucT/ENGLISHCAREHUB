export interface CreateAssessmentTestRequest {
    title: string;
    description: string;
}
export interface CreateAssessmentTestResponse {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}
export interface AssessmentTest {
    id: string;
    isDeleted: boolean;
    title: string;
    description: string;
    createdAt: string;
}

export interface Option {
  content: string;
  correct: boolean;
}

export interface CreateQuestionAnswerRequest {
  content: string;
  options: Option[];
}

export interface CreateQuestionAnswerResponse {
     message: string;
}




export interface OptionAssessment {
  id: number;
  content: string;
  correct: boolean;
}
export interface QuestionAssessment {
  id: number;
  content: string;
  options_assessments: OptionAssessment[];
}

export interface AssessmentResponse {
  question_assessments: QuestionAssessment[];
}
export interface  TestIdParam {
  testId: number;
}