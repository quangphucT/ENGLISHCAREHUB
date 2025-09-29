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