"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  ArrowRight,
  GraduationCap,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useChooseRoleAfterLoginGoogle } from "@/hooks/useChooseRoleAfterLoginGoogle";
import { toast } from "sonner";

const Page = () => {
  const [selectedRole, setSelectedRole] = useState<"LEARNER" | "MENTOR" | null>(
    null
  );
  const router = useRouter();
  const { mutate: chooseRole, isPending } = useChooseRoleAfterLoginGoogle();

  const handleRoleSelect = (role: "LEARNER" | "MENTOR") => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    
    // 🔥 Sử dụng hook để gửi role với email đã lưu
    chooseRole(selectedRole, {
      onSuccess: (data) => {
        toast.success("Chọn vai trò thành công!");
        
        // Điều hướng dựa trên role đã chọn
        if (data.role === "LEARNER") {
          router.push("/");
        } else if (data.role === "MENTOR") {
          router.push("/dashboard");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi xảy ra!");
      }
    });
  };


  
  return (
    <div className="min-h-screen bg-[#18232a]  flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-12 h-12 text-cyan-400 mr-2" />
            <h1 className="text-3xl font-bold text-white">English Care Hub</h1>
          </div>

          <p className="text-slate-300 max-w-md mx-auto">
            Hãy chọn vai trò phù hợp để chúng tôi có thể tùy chỉnh trải nghiệm
            tốt nhất cho bạn
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Learner Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 bg-slate-800/50 backdrop-blur-sm ${
              selectedRole === "LEARNER"
                ? "border-cyan-400 bg-slate-700/70 shadow-xl shadow-cyan-400/20"
                : "border-slate-600 hover:border-cyan-300 hover:bg-slate-700/60"
            }`}
            onClick={() => handleRoleSelect("LEARNER")}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div
                  className={`p-4 rounded-full ${
                    selectedRole === "LEARNER" ? "bg-cyan-400" : "bg-slate-700"
                  }`}
                >
                  <BookOpen
                    className={`w-8 h-8 ${
                      selectedRole === "LEARNER"
                        ? "text-slate-900"
                        : "text-cyan-400"
                    }`}
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-semibold text-white">
                Học viên
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-slate-300 mb-4">
                Bắt đầu hành trình học tiếng Anh với các khóa học chất lượng cao
              </p>
            </CardContent>
          </Card>

          {/* Mentor Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 bg-slate-800/50 backdrop-blur-sm ${
              selectedRole === "MENTOR"
                ? "border-emerald-400 bg-slate-700/70 shadow-xl shadow-emerald-400/20"
                : "border-slate-600 hover:border-emerald-300 hover:bg-slate-700/60"
            }`}
            onClick={() => handleRoleSelect("MENTOR")}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div
                  className={`p-4 rounded-full ${
                    selectedRole === "MENTOR"
                      ? "bg-emerald-400"
                      : "bg-slate-700"
                  }`}
                >
                  <Users
                    className={`w-8 h-8 ${
                      selectedRole === "MENTOR"
                        ? "text-slate-900"
                        : "text-emerald-400"
                    }`}
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-semibold text-white">
                Giảng viên
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-slate-300 mb-4">
                Chia sẻ kiến thức và hướng dẫn học viên trên con đường học tiếng
                Anh
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || isPending}
            className={`px-8 py-3 text-lg font-semibold transition-all duration-300 rounded-lg ${
              selectedRole && !isPending
                ? "bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-600 hover:to-cyan-500 text-slate-900 shadow-lg shadow-cyan-400/25 hover:shadow-xl hover:shadow-cyan-400/30"
                : "bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600"
            }`}
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                Tiếp tục
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          {selectedRole && (
            <p className="text-sm text-slate-400 mt-4">
              Bạn đã chọn:{" "}
              <span className="font-semibold text-white">
                {selectedRole === "LEARNER" ? "Học viên" : "Giảng viên"}
              </span>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            Bạn có thể thay đổi vai trò này sau trong cài đặt tài khoản
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
