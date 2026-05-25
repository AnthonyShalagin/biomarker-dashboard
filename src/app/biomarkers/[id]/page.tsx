"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Biomarker {
  id: string;
  name: string;
  unit: string;
  normalMin?: number;
  normalMax?: number;
  description?: string;
  category: {
    id: string;
    name: string;
  };
  readings: Array<{
    id: string;
    value: number;
    date: string;
    notes?: string;
  }>;
}

export default function BiomarkerDetail() {
  const params = useParams();
  const biomarkerId = params.id as string;
  const [biomarker, setBiomarker] = useState<Biomarker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!biomarkerId) return;

    const fetchBiomarker = async () => {
      try {
        const response = await fetch(`/api/biomarkers/${biomarkerId}`);
        const data = await response.json();

        // Transform dates for display
        const transformedData = {
          ...data,
          readings: data.readings.map((r: any) => ({
            ...r,
            date: new Date(r.date),
          })),
        };

        setBiomarker(transformedData);
      } catch (error) {
        console.error("Failed to fetch biomarker:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBiomarker();
  }, [biomarkerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading biomarker...</p>
        </div>
      </div>
    );
  }

  if (!biomarker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back
            </Link>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-slate-600">Biomarker not found</p>
        </div>
      </div>
    );
  }

  const chartData = biomarker.readings
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((reading) => ({
      date: new Date(reading.date).toLocaleDateString(),
      value: reading.value,
      notes: reading.notes,
    }));

  const stats = {
    latest: biomarker.readings[biomarker.readings.length - 1]?.value,
    average:
      biomarker.readings.length > 0
        ? biomarker.readings.reduce((sum, r) => sum + r.value, 0) /
          biomarker.readings.length
        : 0,
    min: biomarker.readings.length > 0 ? Math.min(...biomarker.readings.map(r => r.value)) : 0,
    max: biomarker.readings.length > 0 ? Math.max(...biomarker.readings.map(r => r.value)) : 0,
  };

  const isNormal =
    biomarker.normalMin !== undefined &&
    biomarker.normalMax !== undefined &&
    stats.latest !== undefined &&
    stats.latest >= biomarker.normalMin &&
    stats.latest <= biomarker.normalMax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium mb-4 block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {biomarker.name}
              </h1>
              <p className="text-slate-600 mt-1">
                {biomarker.category.name} • {biomarker.unit}
              </p>
              {biomarker.description && (
                <p className="text-slate-600 text-sm mt-2">
                  {biomarker.description}
                </p>
              )}
            </div>
            {stats.latest !== undefined && (
              <div
                className={`text-right px-4 py-3 rounded-lg ${
                  isNormal
                    ? "bg-green-50 text-green-900"
                    : "bg-orange-50 text-orange-900"
                }`}
              >
                <p className="text-sm font-medium">Latest Value</p>
                <p className="text-2xl font-bold">
                  {stats.latest.toFixed(2)} {biomarker.unit}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-slate-600 text-sm font-medium">Latest</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {stats.latest?.toFixed(2) || "—"}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-slate-600 text-sm font-medium">Average</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {stats.average.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-slate-600 text-sm font-medium">Minimum</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {stats.min.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-slate-600 text-sm font-medium">Maximum</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {stats.max.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Normal Range */}
        {biomarker.normalMin !== undefined && biomarker.normalMax !== undefined && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Normal Range
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-slate-600">
                Normal range: {biomarker.normalMin} - {biomarker.normalMax}{" "}
                {biomarker.unit}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isNormal
                    ? "bg-green-50 text-green-800"
                    : "bg-orange-50 text-orange-800"
                }`}
              >
                {isNormal ? "Within Normal Range" : "Outside Normal Range"}
              </span>
            </div>
          </div>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Trend Over Time
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  dot={{ fill: "#2563eb" }}
                  name={`${biomarker.name} (${biomarker.unit})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Readings Table */}
        {biomarker.readings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                All Readings
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-900">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {biomarker.readings
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() -
                        new Date(a.date).getTime()
                    )
                    .map((reading) => (
                      <tr key={reading.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 text-sm text-slate-900">
                          {new Date(reading.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-slate-900">
                          {reading.value.toFixed(2)} {biomarker.unit}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-600">
                          {reading.notes || "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {biomarker.readings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-slate-600">No readings available for this biomarker</p>
          </div>
        )}
      </main>
    </div>
  );
}
