import { NextResponse } from "next/server";
import { log } from "@/lib/logger";

const API_VERSION = "1.0.0";

// GET /api/v1/health
export async function GET() {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: API_VERSION,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    };
    
    log.info("Health check requested", health);
    
    return NextResponse.json(health, {
      headers: {
        "API-Version": API_VERSION,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    log.error("Health check failed", error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          "API-Version": API_VERSION,
          "Content-Type": "application/json",
        },
      }
    );
  }
}
