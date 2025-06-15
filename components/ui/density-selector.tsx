"use client";

import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { useSeatsOptimized } from "@/hooks/use-seats-optimized";

export function DensitySelector() {
  const [isDensitySelectOpen, setIsDensitySelectOpen] = useState(false);
  const { densityValue, updateDensity } = useSeatsOptimized();

  // 背景クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDensitySelectOpen) {
        const target = event.target as Element;
        if (!target.closest("[data-density-selector]")) {
          setIsDensitySelectOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDensitySelectOpen]);

  return (
    <div className="relative" data-density-selector>
      <div
        className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-2 cursor-pointer hover:bg-white/90 transition-all duration-200 hover:shadow-xl"
        onClick={() => setIsDensitySelectOpen(!isDensitySelectOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Users className="w-3 h-3 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-600">
              社内人口密度率
            </div>
            <div className="text-sm font-bold text-gray-800">
              {densityValue}%
            </div>
          </div>
          <div
            className={`ml-1 transition-transform duration-200 ${
              isDensitySelectOpen ? "rotate-180" : ""
            }`}
          >
            <svg
              className="w-3 h-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ドロップダウンリスト */}
      {isDensitySelectOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 py-2 min-w-[180px] max-h-64 overflow-y-auto z-50">
          {Array.from({ length: 11 }, (_, i) => i * 10).map((value) => (
            <button
              key={value}
              onClick={() => {
                updateDensity(value);
                setIsDensitySelectOpen(false);
              }}
              className={`
                w-full px-3 py-2 text-left transition-all duration-200 flex items-center justify-between hover:bg-blue-50
                ${
                  densityValue === value
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "text-gray-700"
                }
              `}
            >
              <span className="font-medium text-sm">{value}%</span>
              {densityValue === value && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
