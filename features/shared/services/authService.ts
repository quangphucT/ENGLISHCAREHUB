
import {
  ChooseRoleRequest,
  ChooseRoleResponse,
  GoogleLoginRequest,
  GoogleLoginResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendOTPRequest,
  ResendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "@/types/auth";

export const loginService = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Login failed";
    throw new Error(message);
  }
};

export const registerService = async (
  credentials: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      // Handle validation errors from backend
      const errorMessage = data.message || 
        (Array.isArray(data.messages) ? data.messages.join(", ") : undefined) ||
        "Register failed";
      throw new Error(errorMessage);
    }
    return data;
  } catch (error: any) {
    // This catch block handles network errors or other unexpected errors
    const message = error.message || "Register failed";
    throw new Error(message);
  }
};


export const verifyOTPService = async (
  credentials: VerifyOTPRequest
): Promise<VerifyOTPResponse> => {
  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Login failed";
    throw new Error(message);
  }
};

export const resendOTPService = async (
  credentials: ResendOTPRequest
): Promise<ResendOTPResponse> => {  
  try {
    const response = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Resend OTP failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Resend OTP failed";
    throw new Error(message);
  } 
};

export const loginWithGoogleService = async (
  credentials: GoogleLoginRequest
): Promise<GoogleLoginResponse> => {  
  try {
    const response = await fetch("/api/auth/google-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login with Google failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Login with Google failed";
    throw new Error(message);
  } 
};

export const chooseRoleAfterLoginGoogle = async (credentials: ChooseRoleRequest): Promise<ChooseRoleResponse> => {
  try {
    const response = await fetch("/api/auth/choose-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }); 
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Choose role failed");
    return data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Choose role failed";
    throw new Error(message);
  }
};

