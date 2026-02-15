import { prisma } from "./src/lib/prisma";

async function main() {
  console.log("Starting seed...");

  // Create categories
  const cardiovascular = await prisma.biomarkerCategory.upsert({
    where: { name: "Cardiovascular" },
    update: {},
    create: { name: "Cardiovascular", icon: "❤️" },
  });

  const metabolic = await prisma.biomarkerCategory.upsert({
    where: { name: "Metabolic" },
    update: {},
    create: { name: "Metabolic", icon: "⚡" },
  });

  const inflammation = await prisma.biomarkerCategory.upsert({
    where: { name: "Inflammation" },
    update: {},
    create: { name: "Inflammation", icon: "🔥" },
  });

  const hormones = await prisma.biomarkerCategory.upsert({
    where: { name: "Hormones" },
    update: {},
    create: { name: "Hormones", icon: "🧬" },
  });

  // Create biomarkers for Cardiovascular
  const cholesterol = await prisma.biomarker.upsert({
    where: { name: "Total Cholesterol" },
    update: {},
    create: {
      name: "Total Cholesterol",
      unit: "mg/dL",
      categoryId: cardiovascular.id,
      normalMin: 0,
      normalMax: 200,
    },
  });

  const ldl = await prisma.biomarker.upsert({
    where: { name: "LDL Cholesterol" },
    update: {},
    create: {
      name: "LDL Cholesterol",
      unit: "mg/dL",
      categoryId: cardiovascular.id,
      normalMin: 0,
      normalMax: 100,
    },
  });

  const hdl = await prisma.biomarker.upsert({
    where: { name: "HDL Cholesterol" },
    update: {},
    create: {
      name: "HDL Cholesterol",
      unit: "mg/dL",
      categoryId: cardiovascular.id,
      normalMin: 40,
      normalMax: 60,
    },
  });

  // Create biomarkers for Metabolic
  const glucose = await prisma.biomarker.upsert({
    where: { name: "Glucose" },
    update: {},
    create: {
      name: "Glucose",
      unit: "mg/dL",
      categoryId: metabolic.id,
      normalMin: 70,
      normalMax: 100,
    },
  });

  const insulin = await prisma.biomarker.upsert({
    where: { name: "Insulin" },
    update: {},
    create: {
      name: "Insulin",
      unit: "µIU/mL",
      categoryId: metabolic.id,
      normalMin: 2,
      normalMax: 12,
    },
  });

  // Create biomarkers for Inflammation
  const crp = await prisma.biomarker.upsert({
    where: { name: "CRP" },
    update: {},
    create: {
      name: "CRP",
      unit: "mg/L",
      categoryId: inflammation.id,
      normalMin: 0,
      normalMax: 3,
    },
  });

  // Create biomarkers for Hormones
  const testosterone = await prisma.biomarker.upsert({
    where: { name: "Testosterone" },
    update: {},
    create: {
      name: "Testosterone",
      unit: "ng/dL",
      categoryId: hormones.id,
      normalMin: 264,
      normalMax: 916,
    },
  });

  // Add readings for Total Cholesterol
  const dates = [
    new Date("2024-01-15"),
    new Date("2024-01-22"),
    new Date("2024-02-05"),
    new Date("2024-02-15"),
  ];

  // Cholesterol readings
  await prisma.reading.createMany({
    data: [
      {
        biomarkerId: cholesterol.id,
        categoryId: cardiovascular.id,
        value: 180,
        date: dates[0],
      },
      {
        biomarkerId: cholesterol.id,
        categoryId: cardiovascular.id,
        value: 185,
        date: dates[1],
      },
      {
        biomarkerId: cholesterol.id,
        categoryId: cardiovascular.id,
        value: 175,
        date: dates[2],
      },
      {
        biomarkerId: cholesterol.id,
        categoryId: cardiovascular.id,
        value: 178,
        date: dates[3],
      },
    ],
  });

  // LDL readings
  await prisma.reading.createMany({
    data: [
      {
        biomarkerId: ldl.id,
        categoryId: cardiovascular.id,
        value: 110,
        date: dates[0],
      },
      {
        biomarkerId: ldl.id,
        categoryId: cardiovascular.id,
        value: 105,
        date: dates[1],
      },
      {
        biomarkerId: ldl.id,
        categoryId: cardiovascular.id,
        value: 95,
        date: dates[2],
      },
      {
        biomarkerId: ldl.id,
        categoryId: cardiovascular.id,
        value: 98,
        date: dates[3],
      },
    ],
  });

  // HDL readings
  await prisma.reading.createMany({
    data: [
      {
        biomarkerId: hdl.id,
        categoryId: cardiovascular.id,
        value: 45,
        date: dates[0],
      },
      {
        biomarkerId: hdl.id,
        categoryId: cardiovascular.id,
        value: 48,
        date: dates[1],
      },
      {
        biomarkerId: hdl.id,
        categoryId: cardiovascular.id,
        value: 52,
        date: dates[2],
      },
      {
        biomarkerId: hdl.id,
        categoryId: cardiovascular.id,
        value: 55,
        date: dates[3],
      },
    ],
  });

  // Glucose readings
  await prisma.reading.createMany({
    data: [
      {
        biomarkerId: glucose.id,
        categoryId: metabolic.id,
        value: 95,
        date: dates[0],
      },
      {
        biomarkerId: glucose.id,
        categoryId: metabolic.id,
        value: 92,
        date: dates[1],
      },
      {
        biomarkerId: glucose.id,
        categoryId: metabolic.id,
        value: 98,
        date: dates[2],
      },
      {
        biomarkerId: glucose.id,
        categoryId: metabolic.id,
        value: 94,
        date: dates[3],
      },
    ],
  });

  // Insulin readings
  await prisma.reading.createMany({
    data: [
      {
        biomarkerId: insulin.id,
        categoryId: metabolic.id,
        value: 8.5,
        date: dates[0],
      },
      {
        biomarkerId: insulin.id,
        categoryId: metabolic.id,
        value: 7.2,
        date: dates[1],
      },
      {
        biomarkerId: insulin.id,
        categoryId: metabolic.id,
        value: 9.1,
        date: dates[2],
      },
      {
        biomarkerId: insulin.id,
        categoryId: metabolic.id,
        value: 8.0,
        date: dates[3],
      },
    ],
  });

  // CRP readings
  await prisma.reading.createMany({
    data: [
      {
        biomarkerId: crp.id,
        categoryId: inflammation.id,
        value: 1.5,
        date: dates[0],
      },
      {
        biomarkerId: crp.id,
        categoryId: inflammation.id,
        value: 1.8,
        date: dates[1],
      },
      {
        biomarkerId: crp.id,
        categoryId: inflammation.id,
        value: 1.2,
        date: dates[2],
      },
      {
        biomarkerId: crp.id,
        categoryId: inflammation.id,
        value: 1.3,
        date: dates[3],
      },
    ],
  });

  // Testosterone readings
  await prisma.reading.createMany({
    data: [
      {
        biomarkerId: testosterone.id,
        categoryId: hormones.id,
        value: 450,
        date: dates[0],
      },
      {
        biomarkerId: testosterone.id,
        categoryId: hormones.id,
        value: 480,
        date: dates[1],
      },
      {
        biomarkerId: testosterone.id,
        categoryId: hormones.id,
        value: 520,
        date: dates[2],
      },
      {
        biomarkerId: testosterone.id,
        categoryId: hormones.id,
        value: 510,
        date: dates[3],
      },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
