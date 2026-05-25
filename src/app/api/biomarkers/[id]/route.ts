import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const biomarker = await prisma.biomarker.findUnique({
      where: { id },
      include: {
        category: true,
        readings: {
          orderBy: { date: "asc" },
        },
      },
    });

    if (!biomarker) {
      return NextResponse.json(
        { error: "Biomarker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(biomarker);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch biomarker" },
      { status: 500 }
    );
  }
}
