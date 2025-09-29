// hooks/useCreateAssessment.ts

import { useMutation } from "@tanstack/react-query";
import { createAssessmentService } from "@/features/admin/services/assessmentService";
import { CreateAssessmentTestRequest, CreateAssessmentTestResponse } from "@/types/assessmentTest";

export const useCreateAssessment = () => {
  return useMutation<CreateAssessmentTestResponse, Error, CreateAssessmentTestRequest>({
    mutationFn: createAssessmentService,
  });
};