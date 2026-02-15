"use client";

import { useState } from "react";
import Link from "next/link";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: "error", text: "Please select a file" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Successfully imported ${result.imported} records`,
        });
        setFile(null);
      } else {
        setMessage({ type: "error", text: result.error || "Import failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to upload file" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Import Data</h1>
              <p className="text-slate-600 mt-1">Upload biomarker readings from CSV</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                CSV Format
              </h2>
              <p className="text-slate-600 mb-4">
                Your CSV file should have the following columns:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                <p>categoryName,biomarkerName,unit,value,date,normalMin,normalMax</p>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                <strong>Example:</strong>
              </p>
              <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <p>Cardiovascular,Total Cholesterol,mg/dL,200,2024-01-15,0,200</p>
                <p>Metabolic,Glucose,mg/dL,95,2024-01-15,70,100</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Select CSV File
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  {file ? (
                    <div>
                      <p className="text-slate-900 font-medium">{file.name}</p>
                      <p className="text-slate-500 text-sm">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-600">
                        Click to select a CSV file or drag and drop
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        Maximum file size: 10MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Importing..." : "Import Data"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
