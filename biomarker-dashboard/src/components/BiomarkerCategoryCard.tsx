"use client";

import Link from "next/link";

interface Category {
  id: string;
  name: string;
  icon?: string;
  biomarkers: any[];
  readings: any[];
}

interface Props {
  category: Category;
}

export function BiomarkerCategoryCard({ category }: Props) {
  const latestReading = category.readings[0];

  const categoryIcons: Record<string, string> = {
    cardiovascular: "❤️",
    metabolic: "⚡",
    inflammation: "🔥",
    hormones: "🧬",
    blood: "🩸",
    immune: "🛡️",
    digestive: "🫘",
    respiratory: "💨",
  };

  const icon =
    category.icon ||
    categoryIcons[category.name.toLowerCase()] ||
    "📊";

  return (
    <Link href={`/biomarkers/${category.biomarkers[0]?.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-3xl">{icon}</span>
              <h3 className="text-xl font-semibold text-slate-900 mt-2">
                {category.name}
              </h3>
            </div>
            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {category.biomarkers.length} markers
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-slate-600">Latest Reading:</span>
              {latestReading ? (
                <span className="text-lg font-bold text-slate-900">
                  {latestReading.value.toFixed(2)}
                </span>
              ) : (
                <span className="text-sm text-slate-400">No data</span>
              )}
            </div>

            {category.readings.length > 0 && (
              <div className="text-sm text-slate-600">
                Last updated:{" "}
                <span className="font-medium">
                  {new Date(latestReading.date).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-500 space-y-1">
                {category.biomarkers.slice(0, 3).map((biomarker) => (
                  <div key={biomarker.id}>• {biomarker.name}</div>
                ))}
                {category.biomarkers.length > 3 && (
                  <div className="text-slate-400">
                    +{category.biomarkers.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 bg-slate-50 rounded-b-lg border-t border-slate-200">
          <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
