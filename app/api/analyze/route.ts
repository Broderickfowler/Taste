import { NextResponse } from "next/server";
import { z } from "zod";
import { runTasteAgent } from "@/lib/agent/run";

export const dynamic = "force-dynamic";

const PreferenceSchema = z.enum([
  "Live Music",
  "Fine Dining",
  "Local Food",
  "Art",
  "Architecture",
  "Shopping",
  "Spa",
  "Wellness",
  "Nightlife",
  "Walking Distance",
  "Guided Tours",
  "In-room Services",
  "Design",
  "Nature",
]);

const GuestSchema = z.object({
  guestName: z.string().max(80).optional(),
  propertyName: z.string().min(2).max(80),
  location: z.string().min(2).max(120),
  stayIntent: z.enum([
    "Rest",
    "Explore",
    "Romance",
    "Nightlife",
    "Food",
    "Celebrate",
    "Business",
  ]),
  tripPurpose: z.enum(["Leisure", "Business", "Celebration", "Mixed"]),
  budgetTier: z.enum(["$", "$$", "$$$", "$$$$"]),
  partySize: z.number().int().min(1).max(20),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(19),
  preferences: z.array(PreferenceSchema).min(3).max(14),
  interests: z.array(z.string().min(1).max(80)).min(1).max(5),
}).refine((value) => value.adults + value.children === value.partySize, {
  message: "Adults and children must add up to party size.",
  path: ["partySize"],
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
            "Taste needs trip context, at least three experience preferences, and at least one cultural reference.",
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
