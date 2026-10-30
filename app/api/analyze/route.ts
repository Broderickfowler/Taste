import { NextResponse } from "next/server";
import { z } from "zod";
import { runTasteAgent } from "@/lib/agent/run";

export const dynamic = "force-dynamic";

const CapabilitySchema = z.enum([
  "Lighting",
  "Welcome amenity",
  "In-room audio",
  "In-room streaming",
  "Concierge",
  "Restaurant reservations",
  "Transport",
  "Room service",
  "Spa",
]);

const GuestSchema = z.object({
  propertyName: z.string().min(2).max(80),
  location: z.string().min(2).max(120),
  neighborhood: z.string().max(120).default(""),
  stayIntent: z.enum(["Rest", "Explore", "Romance", "Nightlife", "Food"]),
  interests: z.array(z.string().min(1).max(80)).min(3).max(3),
  capabilities: z.array(CapabilitySchema).min(1),
  constraints: z.object({
    dietary: z.string().max(160).default(""),
    avoid: z.string().max(160).default(""),
    budget: z.enum(["Flexible", "Value", "Premium"]),
    arrivalTime: z.string().min(1).max(20),
    checkoutTime: z.string().min(1).max(20),
  }),
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
        {
          error:
            "Taste needs a hotel location, three cultural references, hotel capabilities, and basic stay constraints.",
          details: error.flatten(),
        },
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
