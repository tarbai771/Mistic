// app/api/test/route.ts

import { NextResponse } from "next/server";
import redis from "@/lib/redis"; // The @ refers to your project root

export async function GET() {
	// Write data
	await redis.set("my_app_status", "Online");

	// Read data
	const status = await redis.get("my_app_status");

	return NextResponse.json({ status });
}
