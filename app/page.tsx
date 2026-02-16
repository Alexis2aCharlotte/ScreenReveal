"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Animated Background */}
      <div className="gradient-bg" />
      <div className="noise-overlay" />
      
      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <main className="relative min-h-screen flex flex-col items-center justify-center p-8">
        {/* Logo & Title */}
        <div className="text-center mb-20 opacity-0 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-zinc-400">Built for creators</span>
          </div>
          
          <h1 className="text-7xl font-bold mb-6 tracking-tight">
            <span className="text-gradient-purple">PostX</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Crée des visuels époustouflants pour documenter ta journey sur Twitter/X
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Data Graphs Card */}
          <Link 
            href="/graphs" 
            className="group opacity-0 animate-fade-in-up delay-100"
          >
            <div className="glass-card shine-effect rounded-3xl p-8 h-full cursor-pointer">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-violet-500/40 transition-all duration-500">
                <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-white mb-3">
                Data Graphs
              </h2>

              {/* Description */}
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Génère des graphiques style Trust MRR. Revenue, users, followers...
              </p>

              {/* Preview */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-white">$24,500</span>
                  <span className="text-sm font-medium text-emerald-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    12%
                  </span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[35, 50, 40, 55, 45, 65, 60, 75, 70, 85, 80, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all duration-300 group-hover:opacity-100"
                      style={{ 
                        height: `${h}%`,
                        background: `linear-gradient(180deg, rgba(168, 85, 247, ${0.3 + (h/100) * 0.7}) 0%, rgba(99, 102, 241, ${0.1 + (h/100) * 0.4}) 100%)`,
                        opacity: 0.6 + (i / 12) * 0.4
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex items-center text-violet-400 font-medium group-hover:text-violet-300 transition-colors">
                <span>Créer un graph</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Photo Editor Card */}
          <Link 
            href="/editor" 
            className="group opacity-0 animate-fade-in-up delay-200"
          >
            <div className="glass-card shine-effect rounded-3xl p-8 h-full cursor-pointer">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-600/20 border border-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-pink-500/40 transition-all duration-500">
                <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-white mb-3">
                Photo Editor
              </h2>

              {/* Description */}
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Sublime tes screenshots avec des fonds colorés et la barre macOS.
              </p>

              {/* Preview */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-500/80 via-purple-500/80 to-pink-500/80">
                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="h-20 bg-black/20 flex items-center justify-center p-4">
                    <div className="w-full space-y-2">
                      <div className="h-2 bg-white/20 rounded w-3/4" />
                      <div className="h-2 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex items-center text-pink-400 font-medium group-hover:text-pink-300 transition-colors">
                <span>Éditer une photo</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-20 opacity-0 animate-fade-in-up delay-300">
          <p className="text-zinc-600 text-sm flex items-center gap-2">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>for indie hackers</span>
          </p>
        </div>
      </main>
    </>
  );
}
