

import { useAuth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = useAuth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const id = params.id;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/conversions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${req.headers.get("Authorization")?.split(" ")[1] || ""}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching conversion:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversion" },
      { status: 500 }
    );
  }
}