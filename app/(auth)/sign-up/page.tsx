"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@/hooks/useRegisterMutation";
import { ArrowLeft, Loader2, X, GraduationCap, Users } from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import AdvertisingMessage from "@/components/AdvertisingMessage";
import Link from "next/link";
import { OTPPopup } from "@/components/PopUpVerifyToken";
import { useVerifyOTPMutation } from "@/hooks/useVerifyOTPMutation";
import { useResendOTPMutation } from "@/hooks/useResendOTPMutation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const formSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập tên").max(50),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ").max(15),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  role: z.string(),
});

export default function RegisterPage() {
  const router = useRouter();
  const { mutate, isPending } = useRegisterMutation();
  const { mutate: verifyOTPMutate, isPending: isVerifyingOTPPending } =
    useVerifyOTPMutation();
  const { mutate: resendOTPMutate, isPending: isResendingOTPPending } =
    useResendOTPMutation();
  const [step, setStep] = useState(1);
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [resendOTPSuccess, setResendOTPSuccess] = useState<
    (() => void) | undefined
  >(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "",
    },
  });

  function handleNext() {
    if (step === 1) {
      // Validate role
      form.trigger(["role"]).then((valid) => {
        if (valid) setStep(2);
      });
    }else if(step === 2){
      form.trigger(["fullName"]).then((valid) => {
        if (valid) setStep(3);
      });
    }
  }
  const handleLogicWhenCloseOTPPopup = () => {
    setShowOTPPopup(false);
    router.push("/sign-in");
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: () => {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP."
        );
        setUserEmail(values.email);
        setShowOTPPopup(true);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  }

  const handleOTPVerify = async (otpInput: string) => {
    verifyOTPMutate(
      { email: userEmail, otpInput },
      {
        onSuccess: () => {
          toast.success("Xác thực thành công!");
          setShowOTPPopup(false);
          router.push("/sign-in");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  const handleResendOTP = async () => {
    // Call API to resend OTP
    resendOTPMutate(
      { email: userEmail },
      {
        onSuccess: () => {
          // Tạo callback function để báo cho OTPPopup biết thành công
          setResendOTPSuccess(() => () => {
            // Reset callback sau khi sử dụng
            setResendOTPSuccess(undefined);
          });
        },
        onError: (err) => {
          toast.error(
            err.message || "Không thể gửi lại mã OTP. Vui lòng thử lại."
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#18232a]">
      {step === 1 ? (
        <>
          {" "}
          <button
            className="absolute left-6 top-6 cursor-pointer text-gray-400 hover:text-white text-3xl font-bold"
            aria-label="Quay về đăng nhập"
            onClick={() => router.push("/landing")}
          >
            ×
          </button>
        </>
      ) : (
        <>
          <button className="absolute left-6 top-6 text-gray-400 hover:text-white text-3xl font-bold cursor-pointer">
            <ArrowLeft className="text-white" onClick={() => setStep(step - 1)} />
          </button>
        </>
      )}
      <div className="w-full max-w-md rounded-2xl  p-10 flex flex-col items-center relative">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-white mb-8 text-center">
              Chọn vai trò
            </h1>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-white mb-8 text-center">
              Nhập tên của bạn
            </h1>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold text-white mb-8 text-center">
              Tạo hồ sơ
            </h1>
          </>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full h-[60px] cursor-pointer bg-[#18232a] text-white border border-[#616163] rounded-xl px-4 text-[15px] py-6  hover:border-[#2ed7ff] focus:border-[#2ed7ff] focus:ring-2 focus:ring-[#2ed7ff]/20 transition-all duration-200">
                            <SelectValue 
                              placeholder="Chọn vai trò của bạn"
                              className="text-gray-400 text-lg"
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-[#18232a] border border-[#616163] rounded-xl shadow-xl">
                            <SelectItem 
                              value="LEARNER"
                              className="text-white hover:bg-[#2ed7ff]/10 hover:text-[#2ed7ff] focus:bg-[#2ed7ff]/10 focus:text-[#2ed7ff] cursor-pointer py-3 px-4 text-lg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <GraduationCap className="w-5 h-5 text-green-400" />
                                <span>Learner - Người học</span>
                              </div>
                            </SelectItem>
                            <SelectItem 
                              value="MENTOR"
                              className="text-white hover:bg-[#2ed7ff]/10 hover:text-[#2ed7ff] focus:bg-[#2ed7ff]/10 focus:text-[#2ed7ff] cursor-pointer py-3 px-4 text-lg transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-blue-400" />
                                <span>Mentor - Người hướng dẫn</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm mt-2" />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-[23px] rounded-xl shadow hover:bg-[#1ec6e6] transition cursor-pointer"
                >
                  Tiếp theo
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Tên đầy đủ"
                          {...field}
                          className="bg-[#18232a]  text-white border border-[#616163] rounded-xl px-4 py-[23px] text-lg "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-[23px] rounded-xl shadow hover:bg-[#1ec6e6] transition cursor-pointer"
                >
                  Tiếp theo
                </Button>
              </>
            )}
            {step === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          className="bg-[#18232a] text-white border border-[#616163]  rounded-xl px-4 py-[23px] text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Số điện thoại"
                          {...field}
                          className="bg-[#18232a] text-white border border-[#616163] rounded-xl px-4 py-[23px] text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mật khẩu"
                          {...field}
                          className="bg-[#18232a] text-white border border-[#616163] rounded-xl px-4 py-[23px] text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-full bg-[#2ed7ff] text-[#18232a] font-bold text-lg py-[23px] rounded-xl shadow hover:bg-[#1ec6e6] transition cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo tài khoản"
                  )}
                </Button>
              </>
            )}

            <GoogleLoginButton
              onClick={() => toast.error("Chức năng đang phát triển")}
            />
          </form>
        </Form>
        <div className="mt-8 text-center text-gray-400 text-sm">
          Đã có tài khoản?{" "}
          <Link href="/sign-in" className="text-[#2ed7ff] font-bold underline">
            Đăng nhập
          </Link>
        </div>
        <AdvertisingMessage />
      </div>

      {/* OTP Popup */}
      <OTPPopup
        isOpen={showOTPPopup}
        onClose={handleLogicWhenCloseOTPPopup}
        onVerify={handleOTPVerify}
        onResendOTP={handleResendOTP}
        onResendOTPSuccess={resendOTPSuccess}
        isVerifying={isVerifyingOTPPending}
        isResendingOTP={isResendingOTPPending}
      />
    </div>
  );
}
