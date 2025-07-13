import { NextRequest, NextResponse } from "next/server";
import { fetchEventTypes } from "@/lib/calendly/api";

export async function GET(request: NextRequest) {
  try {
    const token = process.env.CALENDLY_API_TOKEN;
    const orgUri = process.env.CALENDLY_ORG_URI;

    if (!token || !orgUri) {
      return NextResponse.json(
        { error: "Calendly API configuration missing" },
        { status: 500 }
      );
    }

    const result = await fetchEventTypes(token, orgUri);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to fetch event types" },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[Calendly API] Error fetching event types:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
