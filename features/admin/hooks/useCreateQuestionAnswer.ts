// hooks/useCreateQuestionAnswer.ts

import { CreateQuestionAnswerRequest, CreateQuestionAnswerResponse } from "@/types/assessmentTest";
import { useMutation } from "@tanstack/react-query";
import { createQuestionAnswerService } from "../services/assessmentService";

interface CreateQuestionMutationParams {
  testId: string;
  data: CreateQuestionAnswerRequest;
}

export const useCreateQuestionAnswer = () => {
  return useMutation<CreateQuestionAnswerResponse, Error, CreateQuestionMutationParams>({
    mutationFn: ({ testId, data }) => createQuestionAnswerService(testId, data),
  });
};