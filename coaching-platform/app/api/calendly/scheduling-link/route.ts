import { NextRequest, NextResponse } from "next/server";
import { generateSchedulingLink } from "@/lib/calendly/api";

export async function POST(request: NextRequest) {
  try {
    const token = process.env.CALENDLY_API_TOKEN;
    
    if (!token) {
      return NextResponse.json(
        { error: "Calendly API token missing" },
        { status: 500 }
      );
    }

    const { eventTypeUri, maxEventCount = 1 } = await request.json();

    if (!eventTypeUri) {
      return NextResponse.json(
        { error: "Event type URI is required" },
        { status: 400 }
      );
    }

    const result = await generateSchedulingLink(
      token,
      eventTypeUri,
      maxEventCount
    );

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to generate scheduling link" },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[Calendly API] Error generating scheduling link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
