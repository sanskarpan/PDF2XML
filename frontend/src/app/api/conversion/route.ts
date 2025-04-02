
import { useAuth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = useAuth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversions`, {
      headers: {
        Authorization: `Bearer ${req.headers.get("Authorization")?.split(" ")[1] || ""}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching conversions:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId } = useAuth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const body = await req.json();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.headers.get("Authorization")?.split(" ")[1] || ""}`,
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating conversion:", error);
    return NextResponse.json(
      { error: "Failed to create conversion" },
      { status: 500 }
    );
  }
}
