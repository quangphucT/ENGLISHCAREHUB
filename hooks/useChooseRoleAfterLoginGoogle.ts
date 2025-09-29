import { chooseRoleAfterLoginGoogle } from "@/features/shared/services/authService";
import { useUserStore } from "@/store/useStore";
import { useMutation } from "@tanstack/react-query";
import { ChooseRoleRequest, ChooseRoleResponse } from "@/types/auth";

export const useChooseRoleAfterLoginGoogle = () => {
  const email = useUserStore((state) => state.userEmail);

  return useMutation<ChooseRoleResponse, Error, ChooseRoleRequest["role"]>({
    mutationFn: async (role: ChooseRoleRequest["role"]) => {
      // Kiểm tra email có tồn tại không
      if (!email) {
        throw new Error("Email không tồn tại. Vui lòng đăng nhập lại.");
      }
      const request: ChooseRoleRequest = {
        email,
        role,
      };

      return await chooseRoleAfterLoginGoogle(request);
    },
    onSuccess: (data) => {
      // Nếu API trả về account info, lưu vào store
      if (data) {
        // Có thể lưu thông tin account vào store nếu cần
        console.log("Choose role success:", data);
      }
    },
  });
};
