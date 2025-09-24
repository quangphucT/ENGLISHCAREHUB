
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  message: string;
  account: {
    accessToken: string;
    refreshToken: string;
    avatar: string | null;
    createdAt: string;
    description: string | null;
    email: string;
    firstName: string;
    id: number;
    isActive: boolean;
    phone: string | null;
    updatedAt: string;
    lastName: string;
  };
}


export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
} 

export interface RegisterResponse {
  message: string;
  account: {
    accessToken: string;
    refreshToken: string;
    avatar: string | null;
    createdAt: string;
    description: string | null;
    email: string;
    firstName: string;
    id: number; 
    isActive: boolean;
    phone: string | null;
    updatedAt: string;
    lastName: string;
  };
} 


export interface VerifyOTPRequest {
  email: string;
  otpInput: string;
}

export interface VerifyOTPResponse {
  message: string;
}
export interface ResendOTPRequest {
  email: string;
}

export interface ResendOTPResponse {
  message: string;
}
export interface GoogleLoginRequest {
  idToken: string;
}
export interface GoogleLoginResponse {
  message: string;
}
