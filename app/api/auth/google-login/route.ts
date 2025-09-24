// pages/api/auth/google.ts

import { NextResponse } from "next/server";
interface CustomError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate idToken
    if (!body.idToken) {
      return NextResponse.json(
        { message: "idToken is required" }, 
        { status: 400 }
      );
    }

    // call API thật bên BE (Spring Boot)
    const response = await fetch(`${process.env.BE_API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Trả về response thành công
    console.log("Backend success response:", data);
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    const e = error as CustomError;
    const message = e.response?.data?.message || e.message || "Login failed";
    const status = e.response?.status || 500;
    console.log("API Error:", error);
    return NextResponse.json({ message }, { status });
  }
}
