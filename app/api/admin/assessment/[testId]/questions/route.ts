// app/api/admin/assessment/[testId]/questions/route.ts

import { OptionAssessment } from "@/types/assessmentTest";
import { NextRequest, NextResponse } from "next/server";

interface CustomError {
  response?: {
    data?: { message?: string };
    status?: number;
  };
  message?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    // Lấy accessToken từ cookie
    const accessToken = request.cookies.get("accessToken")?.value;


    const { testId } = params;

    if (!testId) {
      return NextResponse.json(
        { message: "Test ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body structure
    if (
      !body.content ||
      !body.options ||
      !Array.isArray(body.options) ||
      body.options.length !== 4
    ) {
      return NextResponse.json(
        {
          message: "Invalid request body. Content and 4 options are required.",
        },
        { status: 400 }
      );
    }

    // Check if at least one option is correct
    const hasCorrectAnswer = body.options.some(
      (option: OptionAssessment) => option.correct === true
    );
    if (!hasCorrectAnswer) {
      return NextResponse.json(
        { message: "At least one option must be marked as correct" },
        { status: 400 }
      );
    }

    // Gọi API backend với đúng endpoint
    const response = await fetch(
      `${process.env.BE_API_URL}/assessment/${testId}/questionsOptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    // Kiểm tra nếu backend trả về lỗi
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Trả về thành công
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const e = error as CustomError;
    const message =
      e.response?.data?.message || e.message || "Create question failed";
    const status = e.response?.status || 500;
    return NextResponse.json({ message }, { status });
  }
}
