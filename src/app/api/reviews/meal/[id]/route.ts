import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "https://food-hub-backend-inky.vercel.app";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/reviews/meal/${id}`, {
      method: "GET",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get reviews by meal API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
