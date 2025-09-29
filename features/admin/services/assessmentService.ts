import {
  CreateAssessmentTestRequest,
  CreateAssessmentTestResponse,
} from "@/types/assessmentTest";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const createAssessmentService = async (
  data: CreateAssessmentTestRequest
): Promise<CreateAssessmentTestResponse> => {
  try {
    const response = await fetchWithAuth("/api/admin/assessment-test-creation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      // Handle validation errors from backend
      const errorMessage =
        result.message ||
        (Array.isArray(result.messages)
          ? result.messages.join(" - ")
          : undefined) ||
        "Register failed";
      throw new Error(errorMessage);
    }
    return result;
  } catch (error: any) {
    const message = error?.message || "Tạo bài test thất bại";
    throw new Error(message);
  }
};

export const getAllAssessmentTestsService = async () => {
  try {
    const response = await fetchWithAuth("/api/admin/assessment-tests-getting", {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || "Lấy danh sách bài test thất bại";
      throw new Error(errorMessage);
    }

    return data.data; // Return the actual array
  } catch (error: any) {
    const message = error?.message || "Lấy danh sách bài test thất bại";
    throw new Error(message);
  }
};
