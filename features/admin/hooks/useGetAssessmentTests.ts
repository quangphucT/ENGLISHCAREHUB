// hooks/useCreateAssessment.ts


import {  getAllAssessmentTestsService } from "@/features/admin/services/assessmentService";
import { AssessmentTest } from "@/types/assessmentTest";
import { useQuery } from "@tanstack/react-query";

export const useGetAssessmentTests = () => {
  return useQuery<AssessmentTest[], Error>({
    queryKey: ["assessmentTests"],
    queryFn: getAllAssessmentTestsService,
    
  });
};