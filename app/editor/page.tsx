"use client";

import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import Link from "next/link";

// Gradient presets inspired by Screen Studio
const GRADIENT_PRESETS = [
  { from: "#667eea", to: "#764ba2", name: "Purple Dream" },
  { from: "#f093fb", to: "#f5576c", name: "Pink Sunset" },
  { from: "#4facfe", to: "#00f2fe", name: "Ocean Blue" },
  { from: "#43e97b", to: "#38f9d7", name: "Fresh Mint" },
  { from: "#fa709a", to: "#fee140", name: "Warm Flame" },
  { from: "#a8edea", to: "#fed6e3", name: "Soft Peach" },
  { from: "#ff9a9e", to: "#fecfef", name: "Lady Lips" },
  { from: "#ffecd2", to: "#fcb69f", name: "Peach" },
  { from: "#667eea", to: "#f093fb", name: "Magic" },
  { from: "#5ee7df", to: "#b490ca", name: "Aqua Splash" },
  { from: "#d299c2", to: "#fef9d7", name: "Dusty Grass" },
  { from: "#89f7fe", to: "#66a6ff", name: "Sky" },
  { from: "#fddb92", to: "#d1fdff", name: "Morning" },
  { from: "#a1c4fd", to: "#c2e9fb", name: "Winter" },
  { from: "#cd9cf2", to: "#f6f3ff", name: "Lavender" },
  { from: "#e0c3fc", to: "#8ec5fc", name: "Cloudy" },
  { from: "#f5f7fa", to: "#c3cfe2", name: "Silver" },
  { from: "#0f0c29", to: "#302b63", name: "Deep Space" },
  { from: "#141e30", to: "#243b55", name: "Royal Blue" },
  { from: "#232526", to: "#414345", name: "Dark Metal" },
  { from: "#000000", to: "#434343", name: "Dark" },
  { from: "#3a1c71", to: "#d76d77", name: "Sunset Vibes" },
  { from: "#11998e", to: "#38ef7d", name: "Green Beach" },
  { from: "#fc466b", to: "#3f5efb", name: "Cherry" },
];

const SOLID_COLORS = [
  "#0f172a", "#1e293b", "#334155", "#475569",
  "#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd",
  "#ec4899", "#f472b6", "#f9a8d4", "#fbcfe8",
  "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe",
  "#10b981", "#34d399", "#6ee7b7", "#a7f3d0",
  "#f59e0b", "#fbbf24", "#fcd34d", "#fde68a",
  "#ef4444", "#f87171", "#fca5a5", "#fecaca",
  "#ffffff", "#f8fafc", "#e2e8f0", "#cbd5e1",
];

type BackgroundType = "gradient" | "solid";

export default function EditorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("gradient");
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0]);
  const [selectedColor, setSelectedColor] = useState(SOLID_COLORS[0]);
  const [showWindowBar, setShowWindowBar] = useState(true);
  const [padding, setPadding] = useState(64);
  const [borderRadius, setBorderRadius] = useState(12);
  const [shadow, setShadow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [logoColor, setLogoColor] = useState<"white" | "black">("white");
  
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleExport = async () => {
    if (!image) return;
    
    try {
      // Load the original image at full resolution
      const img = new Image();
      img.src = image;
      await new Promise((resolve) => { img.onload = resolve; });
      
      // Target width similar to graph exports (700px content + padding)
      const targetContentWidth = 700;
      const scale = targetContentWidth / img.naturalWidth;
      
      const imgWidth = Math.round(img.naturalWidth * scale);
      const imgHeight = Math.round(img.naturalHeight * scale);
      
      // Calculate dimensions
      const windowBarHeight = showWindowBar ? 36 : 0;
      const totalImageHeight = imgHeight + windowBarHeight;
      
      // Keep padding fixed (not scaled) to match preview exactly
      const fixedPadding = padding;
      const logoExtraSpace = showLogo ? 40 : 0;
      const canvasWidth = imgWidth + (fixedPadding * 2);
      const canvasHeight = totalImageHeight + (fixedPadding * 2) + logoExtraSpace;
      
      // Create canvas with 2x for Retina quality at target size
      const retinaScale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth * retinaScale;
      canvas.height = canvasHeight * retinaScale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(retinaScale, retinaScale);
      
      // High quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      // Draw background with rounded corners (20px like preview)
      const bgRadius = 20;
      if (backgroundType === "gradient") {
        // CSS linear-gradient(135deg) goes from top-left to bottom-right
        // Calculate proper gradient points for 135 degree angle
        const angle = 135 * Math.PI / 180;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const length = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight) / 2;
        
        const x1 = centerX - Math.cos(angle) * length;
        const y1 = centerY - Math.sin(angle) * length;
        const x2 = centerX + Math.cos(angle) * length;
        const y2 = centerY + Math.sin(angle) * length;
        
        const gradient = ctx.createLinearGradient(x2, y2, x1, y1);
        gradient.addColorStop(0, selectedGradient.from);
        gradient.addColorStop(1, selectedGradient.to);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = selectedColor;
      }
      ctx.beginPath();
      ctx.roundRect(0, 0, canvasWidth, canvasHeight, bgRadius);
      ctx.fill();
      
      // Draw shadow
      if (shadow) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 60;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 25;
      }
      
      // Draw rounded rect background for image
      const imageX = fixedPadding;
      const imageY = fixedPadding;
      ctx.fillStyle = "#1e1e1e";
      ctx.beginPath();
      ctx.roundRect(imageX, imageY, imgWidth, totalImageHeight, borderRadius);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw window bar
      if (showWindowBar) {
        ctx.fillStyle = "#1e1e1e";
        ctx.beginPath();
        ctx.roundRect(imageX, imageY, imgWidth, windowBarHeight, [borderRadius, borderRadius, 0, 0]);
        ctx.fill();
        
        // Draw dots
        const dotY = imageY + windowBarHeight / 2;
        const dotRadius = 6;
        const colors = ["#ff5f57", "#febc2e", "#28c840"];
        colors.forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(imageX + 20 + (i * 20), dotY, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Draw border line
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(imageX, imageY + windowBarHeight);
        ctx.lineTo(imageX + imgWidth, imageY + windowBarHeight);
        ctx.stroke();
      }
      
      // Draw image with clip for rounded corners
      ctx.save();
      ctx.beginPath();
      const imgY = imageY + windowBarHeight;
      const cornerRadius = showWindowBar ? [0, 0, borderRadius, borderRadius] : borderRadius;
      ctx.roundRect(imageX, imgY, imgWidth, imgHeight, cornerRadius);
      ctx.clip();
      ctx.drawImage(img, imageX, imgY, imgWidth, imgHeight);
      ctx.restore();
      
      // Draw logo - centered in the bottom padding area (which is larger)
      if (showLogo) {
        ctx.fillStyle = logoColor === "white" ? "#ffffff" : "#000000";
        ctx.font = "900 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Center logo in the bottom padding + extra logo space
        const bottomPadding = fixedPadding + logoExtraSpace;
        const logoY = fixedPadding + totalImageHeight + (bottomPadding / 2);
        ctx.fillText("NICHES HUNTER", canvasWidth / 2, logoY);
      }
      
      // Export
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `postx-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const getBackground = () => {
    if (backgroundType === "gradient") {
      return `linear-gradient(135deg, ${selectedGradient.from} 0%, ${selectedGradient.to} 100%)`;
    }
    return selectedColor;
  };

  return (
    <>
      {/* Animated Background */}
      <div className="gradient-bg" />
      <div className="noise-overlay" />

      <main className="relative min-h-screen flex">
        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          {!image ? (
            <label
              htmlFor="file-upload"
              className={`upload-zone relative w-full max-w-2xl aspect-video rounded-3xl flex flex-col items-center justify-center cursor-pointer ${
                isDragging ? "drag-over" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/20 flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-zinc-300 text-lg font-medium mb-2">
                Glisse ton screenshot ici
              </p>
              <p className="text-zinc-500 text-sm">ou clique pour sélectionner</p>
            </label>
          ) : (
            <div className="flex flex-col items-center gap-8">
              {/* Preview Container */}
              <div
                ref={previewRef}
                className="relative"
                style={{
                  background: getBackground(),
                  paddingTop: `${padding}px`,
                  paddingLeft: `${padding}px`,
                  paddingRight: `${padding}px`,
                  paddingBottom: showLogo ? `${padding + 40}px` : `${padding}px`,
                  borderRadius: "20px",
                  maxWidth: "750px",
                }}
              >
                {/* Screenshot with window bar */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: `${borderRadius}px`,
                    boxShadow: shadow
                      ? "0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)"
                      : "none",
                  }}
                >
                  {/* macOS Window Bar */}
                  {showWindowBar && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#1e1e1e] border-b border-[#333]">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                  )}
                  {/* Image */}
                  <img
                    src={image}
                    alt="Screenshot"
                    className="block max-w-full"
                    style={{
                      maxHeight: "70vh",
                      borderRadius: showWindowBar
                        ? `0 0 ${borderRadius}px ${borderRadius}px`
                        : `${borderRadius}px`,
                      imageRendering: "auto",
                      WebkitBackfaceVisibility: "hidden",
                      backfaceVisibility: "hidden",
                    }}
                  />
                </div>
                
                {/* Niches Hunter Logo - positioned at bottom center */}
                {showLogo && (
                  <div 
                    className="absolute left-0 right-0 flex items-center justify-center"
                    style={{ 
                      bottom: `${(padding + 40) / 2}px`,
                      transform: "translateY(50%)",
                    }}
                  >
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

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setImage(null)}
                  className="glass-btn px-6 py-3 rounded-xl text-white font-medium"
                >
                  Changer l&apos;image
                </button>
                <button
                  onClick={handleExport}
                  className="accent-btn px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exporter PNG
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="w-80 glass-panel p-6 overflow-y-auto">
          {/* Header with back button */}
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
              <h1 className="text-lg font-semibold text-white">Photo Editor</h1>
              <p className="text-xs text-zinc-500">Sublime tes screenshots</p>
            </div>
          </div>

          {/* Background Type Toggle */}
          <div className="mb-6">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
              Fond
            </label>
            <div className="flex gap-2 p-1 glass-card rounded-xl">
              <button
                onClick={() => setBackgroundType("gradient")}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                  backgroundType === "gradient"
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Gradient
              </button>
              <button
                onClick={() => setBackgroundType("solid")}
                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                  backgroundType === "solid"
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Couleur
              </button>
            </div>
          </div>

          {/* Gradient Presets */}
          {backgroundType === "gradient" && (
            <div className="mb-6">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
                Gradients
              </label>
              <div className="grid grid-cols-6 gap-2">
                {GRADIENT_PRESETS.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedGradient(gradient)}
                    className={`gradient-preset w-full aspect-square rounded-lg ${
                      selectedGradient === gradient ? "active" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                    }}
                    title={gradient.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Solid Colors */}
          {backgroundType === "solid" && (
            <div className="mb-6">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
                Couleurs
              </label>
              <div className="grid grid-cols-8 gap-2">
                {SOLID_COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`gradient-preset w-full aspect-square rounded-md ${
                      selectedColor === color ? "active" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Window Bar Toggle */}
          <div className="mb-6">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
              Barre de fenêtre
            </label>
            <button
              onClick={() => setShowWindowBar(!showWindowBar)}
              className={`glass-toggle w-full py-3 px-4 rounded-xl flex items-center justify-between ${
                showWindowBar ? "active" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-sm font-medium text-zinc-300">macOS</span>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-all relative ${
                  showWindowBar ? "bg-violet-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                    showWindowBar ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Shadow Toggle */}
          <div className="mb-6">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 block">
              Ombre
            </label>
            <button
              onClick={() => setShadow(!shadow)}
              className={`glass-toggle w-full py-3 px-4 rounded-xl flex items-center justify-between ${
                shadow ? "active" : ""
              }`}
            >
              <span className="text-sm font-medium text-zinc-300">Activer l&apos;ombre</span>
              <div
                className={`w-10 h-6 rounded-full transition-all relative ${
                  shadow ? "bg-violet-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                    shadow ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
            </button>
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

          {/* Padding Slider */}
          <div className="mb-6">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 flex justify-between">
              <span>Padding</span>
              <span className="text-violet-400 normal-case">{padding}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="128"
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
            />
          </div>

          {/* Border Radius Slider */}
          <div className="mb-8">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 flex justify-between">
              <span>Arrondi</span>
              <span className="text-violet-400 normal-case">{borderRadius}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="32"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setPadding(64);
              setBorderRadius(12);
              setShadow(true);
              setShowWindowBar(true);
              setShowLogo(true);
              setLogoColor("white");
              setSelectedGradient(GRADIENT_PRESETS[0]);
              setSelectedColor(SOLID_COLORS[0]);
            }}
            className="w-full py-3 px-4 rounded-xl glass-btn text-zinc-400 hover:text-white text-sm font-medium"
          >
            Réinitialiser
          </button>
        </div>
      </main>
    </>
  );
}
