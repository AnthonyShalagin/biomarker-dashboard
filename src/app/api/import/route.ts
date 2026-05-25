import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
    }) as any[];

    let imported = 0;

    for (const record of records) {
      const { categoryName, biomarkerName, unit, value, date, normalMin, normalMax } = record;

      // Ensure category exists
      let category = await prisma.biomarkerCategory.findUnique({
        where: { name: categoryName },
      });

      if (!category) {
        category = await prisma.biomarkerCategory.create({
          data: { name: categoryName },
        });
      }

      // Ensure biomarker exists
      let biomarker = await prisma.biomarker.findUnique({
        where: { name: biomarkerName },
      });

      if (!biomarker) {
        biomarker = await prisma.biomarker.create({
          data: {
            name: biomarkerName,
            unit: unit || "mg/dL",
            categoryId: category.id,
            normalMin: normalMin ? parseFloat(normalMin) : undefined,
            normalMax: normalMax ? parseFloat(normalMax) : undefined,
          },
        });
      }

      // Create reading
      await prisma.reading.create({
        data: {
          biomarkerId: biomarker.id,
          categoryId: category.id,
          value: parseFloat(value),
          date: new Date(date),
        },
      });

      imported++;
    }

    return NextResponse.json({ imported });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to import data" },
      { status: 500 }
    );
  }
}
