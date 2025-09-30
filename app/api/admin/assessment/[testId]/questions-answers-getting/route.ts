// app/api/admin/assessment/[testId]/questions/route.ts

import { NextRequest, NextResponse } from "next/server";

interface CustomError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    // Lấy accessToken từ cookie
    const accessToken = request.cookies.get("accessToken")?.value;

    // Await params để lấy testId
    const { testId } = await params;

    if (!testId) {
      return NextResponse.json(
        { message: "Test ID is required" },
        { status: 400 }
      );
    }



   

    // Gọi API backend với đúng endpoint
    const response = await fetch(
      `${process.env.BE_API_URL}/assessment/${testId}/assessmentTest`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    // Kiểm tra nếu backend trả về lỗi
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Trả về thành công
    return NextResponse.json(data?.data?.question_assessments, { status: 200 });
  } catch (error: unknown) {
    const e = error as CustomError;
    const message =
      e.response?.data?.message || e.message || "Getting failed";
    const status = e.response?.status || 500;
    return NextResponse.json({ message }, { status });
  }
}
