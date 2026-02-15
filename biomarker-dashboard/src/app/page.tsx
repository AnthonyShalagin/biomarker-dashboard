"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BiomarkerCategoryCard } from "@/components/BiomarkerCategoryCard";

interface Category {
  id: string;
  name: string;
  icon?: string;
  biomarkers: any[];
  readings: any[];
}

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("API returned non-array data:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setError(error instanceof Error ? error.message : "Failed to load biomarkers");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading biomarkers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Biomarker Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Track your health metrics over time
              </p>
            </div>
            <Link
              href="/import"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Import Data
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-medium">Error loading biomarkers:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
        
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              No biomarkers found. Start by importing data.
            </p>
            <Link
              href="/import"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Import Data
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <BiomarkerCategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
