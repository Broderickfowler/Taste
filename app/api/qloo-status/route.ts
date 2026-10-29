import { NextResponse } from "next/server";
import { qlooHealthcheck } from "@/lib/qloo/client";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.QLOO_API_KEY) {
    return NextResponse.json(
      {
        configured: false,
        reachable: false,
        error: "QLOO_API_KEY is not configured.",
      },
      { status: 503 },
    );
  }

  try {
    const status = await qlooHealthcheck();
    return NextResponse.json(status, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        configured: true,
        reachable: false,
        error: error instanceof Error ? error.message : "Qloo healthcheck failed.",
      },
      { status: 502 },
    );
  }
}
