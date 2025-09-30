import { useQuery } from "@tanstack/react-query";
import { getAllQuestionsAnswersService } from "../services/assessmentService";

export const useGetQuestionsByTestId = (testId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["questions", testId],
    queryFn: () => getAllQuestionsAnswersService(testId),
    enabled: enabled && !!testId, // Chỉ gọi API khi có testId và enabled = true
  });
};