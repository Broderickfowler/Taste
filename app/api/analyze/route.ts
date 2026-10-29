import { NextResponse } from "next/server";
import { z } from "zod";
import { runTasteAgent } from "@/lib/agent/run";

export const dynamic = "force-dynamic";

const BriefSchema = z.object({
  businessName: z.string().min(2).max(80),
  businessType: z.string().min(2).max(80),
  location: z.string().min(2).max(120),
  audience: z.string().min(5).max(240),
  goal: z.string().min(5).max(240),
  interests: z.array(z.string().min(1).max(80)).min(1).max(5),
});

export async function POST(request: Request) {
  try {
    const payload = BriefSchema.parse(await request.json());
    const result = await runTasteAgent(payload);

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid brief.", details: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "TASTE//OS could not complete this analysis.",
      },
      { status: 500 },
    );
  }
}
