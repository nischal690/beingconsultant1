import { NextRequest, NextResponse } from "next/server";
import { fetchAvailableTimeSlots } from "@/lib/calendly/api";

export async function GET(request: NextRequest) {
  try {
    const token = process.env.CALENDLY_API_TOKEN;
    const searchParams = request.nextUrl.searchParams;
    
    const eventTypeUri = searchParams.get('event_type');
    const startTime = searchParams.get('start_time');
    const endTime = searchParams.get('end_time');
    const timezone = searchParams.get('timezone');

    if (!token) {
      return NextResponse.json(
        { error: "Calendly API token missing" },
        { status: 500 }
      );
    }

    if (!eventTypeUri || !startTime || !endTime || !timezone) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const result = await fetchAvailableTimeSlots(
      token,
      eventTypeUri,
      startTime,
      endTime,
      timezone
    );

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to fetch available time slots" },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("[Calendly API] Error fetching available time slots:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
