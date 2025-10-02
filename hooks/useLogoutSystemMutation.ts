import { logoutSystemService } from "@/features/shared/services/authService";
import { LogoutResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogoutSystemMutation = () => {
  return useMutation<LogoutResponse, Error, void>({
    mutationFn: logoutSystemService
  });
};
