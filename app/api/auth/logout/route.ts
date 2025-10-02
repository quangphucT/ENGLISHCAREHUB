// app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from "next/server";

interface CustomError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Lấy tokens từ cookies của request từ frontend
    const accessToken = request.cookies.get('accessToken')?.value;

    // Gửi logout request tới backend và forward cookies
    const response = await fetch(`${process.env.BE_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
        // Forward cookies từ frontend request đến backend
        "Cookie": request.headers.get('cookie') || '',
      },
    }); 
    
    const data = await response.json();
    
    // Kiểm tra nếu backend trả về lỗi
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    // Tạo response thành công và clear cookies
    const successResponse = NextResponse.json(
      { message: data.message || "Logout successful" }, 
      { status: 200 }
    );
    
    // Clear authentication cookies
    successResponse.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expires immediately
    });
    
    successResponse.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expires immediately
    });
    
    return successResponse;
  } catch (error: unknown) {
    const e = error as CustomError;
    const message = e.response?.data?.message || e.message || "Register failed";
    const status = e.response?.status || 500;
    return NextResponse.json(
      { message },
      { status }
    );
  }
}
