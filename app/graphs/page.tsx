"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { toPng } from "html-to-image";
import Link from "next/link";

// Time range to days mapping
const TIME_RANGE_DAYS: Record<string, number> = {
  "Last 7 days": 7,
  "Last 2 weeks": 14,
  "Last 4 weeks": 28,
  "Last 3 months": 90,
  "Last 6 months": 180,
  "Last year": 365,
};
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Types
interface DataPoint {
  date: string;
  value: number;
  previousValue?: number;
}

interface Metric {
  id: string;
  name: string;
  icon: string;
  color: string;
  prefix?: string;
  suffix?: string;
  data: DataPoint[];
}

// Initial users data (cumulative ACTIVE paying customers from Supabase - accounting for cancellations)
// Updated: 2026-02-13 (100 total)
const USERS_INITIAL_DATA: DataPoint[] = [
  { date: "2025-12-23", value: 4 },
  { date: "2025-12-24", value: 5 },
  { date: "2025-12-25", value: 7 },
  { date: "2025-12-26", value: 8 },
  { date: "2025-12-27", value: 13 },
  { date: "2025-12-28", value: 15 },
  { date: "2025-12-29", value: 17 },
  { date: "2025-12-30", value: 18 },
  { date: "2025-12-31", value: 19 },
  { date: "2026-01-01", value: 19 },
  { date: "2026-01-02", value: 19 },
  { date: "2026-01-03", value: 20 },
  { date: "2026-01-04", value: 20 },
  { date: "2026-01-05", value: 20 },
  { date: "2026-01-06", value: 21 },
  { date: "2026-01-07", value: 21 },
  { date: "2026-01-08", value: 22 },
  { date: "2026-01-09", value: 23 },
  { date: "2026-01-10", value: 24 },
  { date: "2026-01-11", value: 25 },
  { date: "2026-01-12", value: 27 },
  { date: "2026-01-13", value: 32 },
  { date: "2026-01-14", value: 33 },
  { date: "2026-01-15", value: 34 },
  { date: "2026-01-16", value: 35 },
  { date: "2026-01-17", value: 37 },
  { date: "2026-01-18", value: 39 },
  { date: "2026-01-19", value: 40 },
  { date: "2026-01-20", value: 43 },
  { date: "2026-01-21", value: 45 },
  { date: "2026-01-22", value: 47 },
  { date: "2026-01-23", value: 47 },
  { date: "2026-01-24", value: 48 },
  { date: "2026-01-25", value: 48 },
  { date: "2026-01-26", value: 51 },
  { date: "2026-01-27", value: 52 },
  { date: "2026-01-28", value: 52 },
  { date: "2026-01-29", value: 52 },
  { date: "2026-01-30", value: 52 },
  { date: "2026-01-31", value: 53 },
  { date: "2026-02-01", value: 59 },
  { date: "2026-02-02", value: 61 },
  { date: "2026-02-03", value: 64 },
  { date: "2026-02-04", value: 69 },
  { date: "2026-02-05", value: 73 },
  { date: "2026-02-06", value: 77 },
  { date: "2026-02-07", value: 81 },
  { date: "2026-02-08", value: 84 },
  { date: "2026-02-09", value: 87 },
  { date: "2026-02-10", value: 93 },
  { date: "2026-02-11", value: 95 },
  { date: "2026-02-12", value: 98 },
  { date: "2026-02-13", value: 100 },
];

// Initial newsletter data (cumulative ACTIVE subscribers from Supabase - only 'subscribed' status)
// Updated: 2026-02-13 (962 total)
const NEWSLETTER_INITIAL_DATA: DataPoint[] = [
  { date: "2025-12-05", value: 8 },
  { date: "2025-12-06", value: 15 },
  { date: "2025-12-07", value: 18 },
  { date: "2025-12-08", value: 24 },
  { date: "2025-12-09", value: 37 },
  { date: "2025-12-10", value: 42 },
  { date: "2025-12-11", value: 46 },
  { date: "2025-12-12", value: 49 },
  { date: "2025-12-13", value: 54 },
  { date: "2025-12-14", value: 61 },
  { date: "2025-12-15", value: 70 },
  { date: "2025-12-16", value: 77 },
  { date: "2025-12-17", value: 89 },
  { date: "2025-12-18", value: 99 },
  { date: "2025-12-19", value: 104 },
  { date: "2025-12-20", value: 107 },
  { date: "2025-12-21", value: 121 },
  { date: "2025-12-22", value: 172 },
  { date: "2025-12-23", value: 238 },
  { date: "2025-12-24", value: 285 },
  { date: "2025-12-25", value: 335 },
  { date: "2025-12-26", value: 360 },
  { date: "2025-12-27", value: 382 },
  { date: "2025-12-28", value: 391 },
  { date: "2025-12-29", value: 422 },
  { date: "2025-12-30", value: 449 },
  { date: "2025-12-31", value: 459 },
  { date: "2026-01-01", value: 460 },
  { date: "2026-01-02", value: 464 },
  { date: "2026-01-03", value: 486 },
  { date: "2026-01-04", value: 520 },
  { date: "2026-01-05", value: 530 },
  { date: "2026-01-06", value: 535 },
  { date: "2026-01-07", value: 546 },
  { date: "2026-01-08", value: 562 },
  { date: "2026-01-09", value: 568 },
  { date: "2026-01-10", value: 576 },
  { date: "2026-01-11", value: 587 },
  { date: "2026-01-12", value: 620 },
  { date: "2026-01-13", value: 654 },
  { date: "2026-01-14", value: 659 },
  { date: "2026-01-15", value: 663 },
  { date: "2026-01-16", value: 666 },
  { date: "2026-01-17", value: 670 },
  { date: "2026-01-18", value: 673 },
  { date: "2026-01-19", value: 681 },
  { date: "2026-01-20", value: 693 },
  { date: "2026-01-21", value: 702 },
  { date: "2026-01-22", value: 706 },
  { date: "2026-01-23", value: 714 },
  { date: "2026-01-24", value: 730 },
  { date: "2026-01-25", value: 739 },
  { date: "2026-01-26", value: 746 },
  { date: "2026-01-27", value: 749 },
  { date: "2026-01-28", value: 757 },
  { date: "2026-01-29", value: 763 },
  { date: "2026-01-30", value: 768 },
  { date: "2026-01-31", value: 775 },
  { date: "2026-02-01", value: 788 },
  { date: "2026-02-02", value: 796 },
  { date: "2026-02-03", value: 806 },
  { date: "2026-02-04", value: 884 },
  { date: "2026-02-05", value: 893 },
  { date: "2026-02-06", value: 900 },
  { date: "2026-02-07", value: 913 },
  { date: "2026-02-08", value: 925 },
  { date: "2026-02-09", value: 929 },
  { date: "2026-02-10", value: 937 },
  { date: "2026-02-11", value: 943 },
  { date: "2026-02-12", value: 955 },
  { date: "2026-02-13", value: 962 },
];

// Default metrics
const DEFAULT_METRICS: Metric[] = [
  {
    id: "mrr",
    name: "Revenue (MRR)",
    icon: "💰",
    color: "#a855f7",
    prefix: "$",
    data: [],
  },
  {
    id: "users",
    name: "Paid Users",
    icon: "👥",
    color: "#3b82f6",
    data: USERS_INITIAL_DATA,
  },
  {
    id: "newsletter",
    name: "Newsletter",
    icon: "📧",
    color: "#10b981",
    data: NEWSLETTER_INITIAL_DATA,
  },
  {
    id: "followers",
    name: "Followers",
    icon: "🐦",
    color: "#f59e0b",
    data: [],
  },
];

// Gradient presets for the chart card
const CHART_THEMES = [
  { id: "dark", name: "Dark", bg: "#0c0c10", cardBg: "#131318" },
  { id: "midnight", name: "Midnight", bg: "#08081a", cardBg: "#0f0f24" },
  { id: "charcoal", name: "Charcoal", bg: "#121212", cardBg: "#1a1a1a" },
];

// Background presets for export wrapper
const EXPORT_BACKGROUNDS = [
  { id: "none", name: "Aucun", value: "transparent", dark: true },
  // Niches Hunter branded backgrounds (black/green)
  { id: "nh-dark", name: "NH Dark", value: "linear-gradient(135deg, #000000 0%, #0a1f0a 50%, #0d2818 100%)", dark: true },
  { id: "nh-vertical", name: "NH Vertical", value: "linear-gradient(180deg, #0d2818 0%, #0a1f0a 50%, #000000 100%)", dark: true },
  { id: "nh-emerald", name: "NH Emerald", value: "linear-gradient(135deg, #0a0a0a 0%, #064e3b 100%)", dark: true },
  { id: "nh-matrix", name: "NH Matrix", value: "linear-gradient(180deg, #000000 0%, #003300 50%, #001a00 100%)", dark: true },
  { id: "nh-glow", name: "NH Glow", value: "radial-gradient(ellipse at center, #0d3320 0%, #000000 70%)", dark: true },
  // Light backgrounds
  { id: "gradient-mint", name: "Fresh Mint", value: "linear-gradient(135deg, #ffffff 0%, #dcfce7 40%, #a7f3d0 100%)", dark: false },
  { id: "gradient-purple", name: "Purple", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", dark: true },
  { id: "gradient-blue", name: "Ocean", value: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)", dark: true },
  { id: "gradient-emerald", name: "Emerald", value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", dark: false },
  { id: "solid-black", name: "Black", value: "#000000", dark: true },
  { id: "solid-white", name: "White", value: "#ffffff", dark: false },
];

export default function GraphsPage() {
  const [metrics, setMetrics] = useState<Metric[]>(DEFAULT_METRICS);
  const [selectedMetric, setSelectedMetric] = useState<Metric>(DEFAULT_METRICS[2]); // Newsletter by default
  const [selectedTheme, setSelectedTheme] = useState(CHART_THEMES[0]);
  const [selectedBackground, setSelectedBackground] = useState(EXPORT_BACKGROUNDS[0]);
  const [showVerified, setShowVerified] = useState(true);
  const [verifiedSource, setVerifiedSource] = useState("Supabase");
  const [timeRange, setTimeRange] = useState("Last 4 weeks");
  const [showLogo, setShowLogo] = useState(true);
  const [logoColor, setLogoColor] = useState<"white" | "black">("white");
  
  // Form state for adding data
  const [newDate, setNewDate] = useState("");
  const [newValue, setNewValue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  const chartRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Wait for client-side mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("postx-metrics");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Always use initial data for newsletter and users (they are the source of truth)
      // This ensures new data points added to the code are always reflected
      const updatedMetrics = parsed.map((m: Metric) => {
        if (m.id === "newsletter") {
          return { ...m, data: NEWSLETTER_INITIAL_DATA };
        }
        if (m.id === "users") {
          return { ...m, data: USERS_INITIAL_DATA };
        }
        return m;
      });
      setMetrics(updatedMetrics);
      // Select newsletter by default
      const newsletterMetric = updatedMetrics.find((m: Metric) => m.id === "newsletter");
      setSelectedMetric(newsletterMetric || updatedMetrics[0] || DEFAULT_METRICS[2]);
    } else {
      // First time - select newsletter
      setSelectedMetric(DEFAULT_METRICS[2]);
    }
  }, []);

  // Save to localStorage when metrics change
  useEffect(() => {
    localStorage.setItem("postx-metrics", JSON.stringify(metrics));
  }, [metrics]);

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    const days = TIME_RANGE_DAYS[timeRange] || 28;
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return selectedMetric.data.filter(point => {
      const pointDate = new Date(point.date);
      return pointDate >= cutoffDate;
    });
  }, [selectedMetric.data, timeRange]);

  // Calculate stats based on filtered data
  const currentValue = filteredData.length > 0 
    ? filteredData[filteredData.length - 1].value 
    : 0;
  
  // Compare first value of period to last value (growth over the period)
  const startValue = filteredData.length > 0 
    ? filteredData[0].value 
    : currentValue;
  
  const percentChange = startValue > 0 
    ? ((currentValue - startValue) / startValue * 100).toFixed(1)
    : "0";
  
  const isPositive = parseFloat(percentChange) >= 0;

  // Format value with prefix/suffix (for Y-axis)
  const formatValue = (value: number) => {
    const formatted = value >= 1000 
      ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
      : String(value);
    return `${selectedMetric.prefix || ""}${formatted}${selectedMetric.suffix || ""}`;
  };

  // Format large numbers for display (only client-side to avoid hydration mismatch)
  const formatDisplayValue = (value: number) => {
    if (!isMounted) return `${selectedMetric.prefix || ""}${value}${selectedMetric.suffix || ""}`;
    return `${selectedMetric.prefix || ""}${value.toLocaleString()}${selectedMetric.suffix || ""}`;
  };

  // Add new data point
  const handleAddData = () => {
    if (!newDate || !newValue) return;
    
    const updatedMetrics = metrics.map(m => {
      if (m.id === selectedMetric.id) {
        const newData = [...m.data, { date: newDate, value: parseFloat(newValue) }];
        // Sort by date
        newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return { ...m, data: newData };
      }
      return m;
    });
    
    setMetrics(updatedMetrics);
    setSelectedMetric(updatedMetrics.find(m => m.id === selectedMetric.id) || selectedMetric);
    setNewDate("");
    setNewValue("");
    setShowAddForm(false);
  };

  // Delete data point
  const handleDeleteData = (index: number) => {
    const updatedMetrics = metrics.map(m => {
      if (m.id === selectedMetric.id) {
        const newData = m.data.filter((_, i) => i !== index);
        return { ...m, data: newData };
      }
      return m;
    });
    
    setMetrics(updatedMetrics);
    setSelectedMetric(updatedMetrics.find(m => m.id === selectedMetric.id) || selectedMetric);
  };

  // Export chart as PNG
  const handleExport = async () => {
    if (!chartRef.current) return;
    
    try {
      const dataUrl = await toPng(chartRef.current, {
        pixelRatio: 4, // High quality export (4x resolution)
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      });
      
      const link = document.createElement("a");
      link.download = `postx-${selectedMetric.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      {/* Animated Background */}
      <div className="gradient-bg" />
      <div className="noise-overlay" />

      <main className="relative min-h-screen flex">
        {/* Chart Preview Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Export Wrapper with Background */}
          <div
            ref={chartRef}
            className="rounded-3xl overflow-hidden"
            style={{ 
              background: selectedBackground.value,
              padding: selectedBackground.id === "none" ? "0" : "24px"
            }}
          >
            {/* Chart Card */}
            <div
              className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl"
              style={{ 
                backgroundColor: selectedTheme.bg,
                minWidth: "700px"
              }}
            >
              <div 
                className="p-8"
                style={{ backgroundColor: selectedTheme.cardBg }}
              >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                {/* Value & Change */}
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-white tracking-tight">
                    {formatDisplayValue(currentValue)}
                  </span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    isPositive 
                      ? "text-emerald-400 bg-emerald-400/10" 
                      : "text-red-400 bg-red-400/10"
                  }`}>
                    {isPositive ? "↑" : "↓"} {Math.abs(parseFloat(percentChange))}%
                  </span>
                </div>

                {/* Right side badges */}
                <div className="flex items-center gap-3">
                  {showVerified && (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <span>Verified by</span>
                      <span className="bg-[#635bff] text-white px-2 py-0.5 rounded text-xs font-bold">
                        {verifiedSource === "Stripe" ? "S" : verifiedSource[0]}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedMetric.color }}
                    />
                    <span className="text-white text-sm font-medium">
                      {selectedMetric.name.split(" ")[0]}
                    </span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                    <span className="text-white text-sm">{timeRange}</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64">
                {filteredData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={selectedMetric.color} stopOpacity={0.5} />
                          <stop offset="50%" stopColor={selectedMetric.color} stopOpacity={0.2} />
                          <stop offset="100%" stopColor={selectedMetric.color} stopOpacity={0} />
                        </linearGradient>
                        {/* Glow filter for the line */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        {/* Drop shadow for depth */}
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={selectedMetric.color} floodOpacity="0.3" />
                        </filter>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#52525b", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        tickFormatter={(value) => formatValue(value)}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#52525b", fontSize: 12 }}
                        dx={-10}
                        width={60}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(24, 24, 27, 0.9)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          padding: "12px 16px",
                          backdropFilter: "blur(10px)",
                        }}
                        labelStyle={{ color: "#a1a1aa", fontSize: 12, marginBottom: 4 }}
                        formatter={(value) => [formatDisplayValue(value as number), selectedMetric.name]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={selectedMetric.color}
                        strokeWidth={3}
                        fill="url(#colorValue)"
                        filter="url(#glow)"
                        style={{ filter: "url(#shadow)" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-zinc-400 font-medium mb-1">Pas encore de données</p>
                      <p className="text-zinc-600 text-sm">Ajoute des données via le panneau</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-center text-zinc-500 text-sm">
                Last updated: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
            </div>
            
            {/* Niches Hunter Logo */}
            {showLogo && selectedBackground.id !== "none" && (
              <div className="mt-4 flex items-center justify-center">
                <span 
                  className="text-lg"
                  style={{ 
                    color: logoColor === "white" ? "#ffffff" : "#000000",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
                    fontWeight: 900,
                    letterSpacing: "0.1em"
                  }}
                >
                  NICHES HUNTER
                </span>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="mt-8 accent-btn px-8 py-4 rounded-2xl text-white font-medium flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter PNG
          </button>
        </div>

        {/* Control Panel */}
        <div className="w-96 glass-panel p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl glass-btn flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-white">Data Graphs</h1>
              <p className="text-xs text-zinc-500">Visualise ta croissance</p>
            </div>
          </div>

          {/* Metric Selector */}
          <div className="mb-6">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
              Métrique
            </label>
            <div className="grid grid-cols-2 gap-2">
              {metrics.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric)}
                  className={`glass-toggle p-4 rounded-xl text-left transition-all ${
                    selectedMetric.id === metric.id ? "active" : ""
                  }`}
                >
                  <span className="text-2xl mb-2 block">{metric.icon}</span>
                  <span className="text-sm font-medium text-white block">{metric.name.split(" ")[0]}</span>
                  <span className="text-xs text-zinc-500">
                    {metric.data.length} points
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Add Data */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Données
              </label>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
              >
                + Ajouter
              </button>
            </div>

            {showAddForm && (
              <div className="glass-card rounded-xl p-4 mb-3">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1.5 block">Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="glass-input w-full rounded-lg px-3 py-2.5 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1.5 block">Valeur</label>
                    <input
                      type="number"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="1000"
                      className="glass-input w-full rounded-lg px-3 py-2.5 text-white text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddData}
                  className="w-full py-2.5 rounded-lg accent-btn text-white text-sm font-medium"
                >
                  Ajouter
                </button>
              </div>
            )}

            {/* Data points list (filtered by period) */}
            <div className="max-h-40 overflow-y-auto space-y-2">
              {filteredData.length === 0 ? (
                <div className="text-center py-4 text-zinc-500 text-sm">
                  Aucune donnée pour cette période
                </div>
              ) : (
                filteredData.slice().reverse().map((point, index) => {
                  // Find the original index in selectedMetric.data for deletion
                  const originalIndex = selectedMetric.data.findIndex(
                    p => p.date === point.date && p.value === point.value
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between glass-card rounded-xl px-4 py-3"
                    >
                      <div>
                        <span className="text-white text-sm font-medium">
                          {formatDisplayValue(point.value)}
                        </span>
                        <span className="text-zinc-500 text-xs ml-2">
                          {formatDate(point.date)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteData(originalIndex)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Theme */}
          <div className="mb-6">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
              Thème carte
            </label>
            <div className="flex gap-2">
              {CHART_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`glass-toggle flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                    selectedTheme.id === theme.id ? "active text-white" : "text-zinc-400"
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div className="mb-6">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
              Fond d&apos;export
            </label>
            <div className="grid grid-cols-5 gap-2">
              {EXPORT_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setSelectedBackground(bg)}
                  className={`aspect-square rounded-xl transition-all border-2 ${
                    selectedBackground.id === bg.id 
                      ? "border-violet-500 scale-105" 
                      : "border-transparent hover:border-zinc-600"
                  }`}
                  style={{ 
                    background: bg.value === "transparent" 
                      ? "repeating-conic-gradient(#27272a 0% 25%, #18181b 0% 50%) 50% / 12px 12px"
                      : bg.value 
                  }}
                  title={bg.name}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              {selectedBackground.name}
            </p>
          </div>

          {/* Time Range */}
          <div className="mb-6">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
              Période
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="glass-input w-full rounded-xl px-4 py-3 text-white text-sm appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
            >
              <option>Last 7 days</option>
              <option>Last 2 weeks</option>
              <option>Last 4 weeks</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>

          {/* Verified Badge */}
          <div className="mb-6">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
              Badge vérifié
            </label>
            <button
              onClick={() => setShowVerified(!showVerified)}
              className={`glass-toggle w-full py-3 px-4 rounded-xl flex items-center justify-between mb-3 ${
                showVerified ? "active" : ""
              }`}
            >
              <span className="text-sm font-medium text-zinc-300">Afficher badge</span>
              <div
                className={`w-10 h-6 rounded-full transition-all relative ${
                  showVerified ? "bg-violet-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                    showVerified ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
            </button>
            
            {showVerified && (
              <input
                type="text"
                value={verifiedSource}
                onChange={(e) => setVerifiedSource(e.target.value)}
                placeholder="Stripe, Supabase..."
                className="glass-input w-full rounded-xl px-4 py-3 text-white text-sm"
              />
            )}
          </div>

          {/* Logo Toggle */}
          <div className="mb-6">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
              Logo Niches Hunter
            </label>
            <button
              onClick={() => setShowLogo(!showLogo)}
              className={`glass-toggle w-full py-3 px-4 rounded-xl flex items-center justify-between mb-3 ${
                showLogo ? "active" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-wider text-white">NH</span>
                <span className="text-sm font-medium text-zinc-300">Afficher logo</span>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-all relative ${
                  showLogo ? "bg-emerald-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                    showLogo ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
            </button>
            
            {showLogo && (
              <div className="flex gap-2">
                <button
                  onClick={() => setLogoColor("white")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    logoColor === "white" 
                      ? "bg-white text-black" 
                      : "glass-btn text-zinc-400 hover:text-white"
                  }`}
                >
                  Blanc
                </button>
                <button
                  onClick={() => setLogoColor("black")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    logoColor === "black" 
                      ? "bg-zinc-800 text-white border border-zinc-600" 
                      : "glass-btn text-zinc-400 hover:text-white"
                  }`}
                >
                  Noir
                </button>
              </div>
            )}
          </div>

          {/* Clear Data */}
          <button
            onClick={() => {
              if (confirm("Supprimer toutes les données de cette métrique ?")) {
                const updatedMetrics = metrics.map(m => 
                  m.id === selectedMetric.id ? { ...m, data: [] } : m
                );
                setMetrics(updatedMetrics);
                setSelectedMetric(updatedMetrics.find(m => m.id === selectedMetric.id) || selectedMetric);
              }
            }}
            className="w-full py-3 px-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            Supprimer les données
          </button>
        </div>
      </main>
    </>
  );
}
