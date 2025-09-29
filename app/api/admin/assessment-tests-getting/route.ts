import { NextRequest, NextResponse } from "next/server";

interface CustomError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}

export async function GET(request: NextRequest) {
   try {
        let accessToken = request.cookies.get('accessToken')?.value;
    
        let response = await fetch(`${process.env.BE_API_URL}/assessment/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        
        let data = await response.json();
        
        // Nếu access token hết hạn, return để client tự handle refresh
        if (response.status === 401) {
            return NextResponse.json({ 
                errorCode: "TOKEN_EXPIRED", 
                message: "Access token expired", 
                status: 401 
            }, { status: 401 });
        }
        
        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }
        
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