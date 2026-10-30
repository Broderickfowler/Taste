import { NextResponse } from "next/server";
import { z } from "zod";
import { runTasteAgent } from "@/lib/agent/run";

export const dynamic = "force-dynamic";

const GuestSchema = z.object({
  propertyName: z.string().min(2).max(80),
  location: z.string().min(2).max(120),
  stayIntent: z.enum(["Rest", "Explore", "Romance", "Nightlife", "Food"]),
  interests: z.array(z.string().min(1).max(80)).min(3).max(3),
});

export async function POST(request: Request) {
  try {
    const payload = GuestSchema.parse(await request.json());
    const result = await runTasteAgent(payload);

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Tell Taste three things you love and choose a stay type.", details: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Taste could not build this stay.",
      },
      { status: 500 },
    );
  }
}
