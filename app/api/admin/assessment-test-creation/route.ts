// app/api/auth/login/route.ts

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
    // Lấy accessToken từ cookie
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { message: "Không tìm thấy accessToken. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const response = await fetch(`${process.env.BE_API_URL}/assessment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    }); 
    const data = await response.json();
    
    // Kiểm tra nếu backend trả về lỗi
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    
    // Trả về thành công
    return NextResponse.json(data, { status: 200 });
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
