'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

export default function StoryPage() {
  const [interactiveIntent, setInteractiveIntent] = useState('');
  const [interactiveOutput, setInteractiveOutput] = useState<{
    tags: string[];
    summary: string;
  } | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);

  const handleTestIntent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactiveIntent.trim() || isInterpreting) return;
    triggerHaptic('medium');
    setIsInterpreting(true);

    setTimeout(() => {
      setIsInterpreting(false);
      setInteractiveOutput({
        tags: ['Occasion: Dinner', 'Fabric: Mulberry Silk', 'Aesthetic: Minimalist', 'Tier: Premium'],
        summary: 'Understated slip silhouettes in neutral tones with subtle sheen',
      });
      triggerHaptic('light');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1615] selection:bg-[#111111] selection:text-white relative">
      {/* Top Quiet Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D9]/60 px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#786E65] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Zauq</span>
        </Link>
        <span className="font-serif text-sm tracking-[0.2em] uppercase font-medium text-[#111111]">
          ZAUQ
        </span>
        <Link
          href="/"
          className="px-3.5 py-1.5 rounded-full bg-[#111111] text-white text-xs font-medium hover:bg-black transition-all"
        >
          Ask Zauq
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-28 sm:space-y-36">
        {/* Beat 01 — ذوق (The Mark & Word) */}
        <section className="text-center space-y-6 pt-8 sm:pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-white border border-[#E8E2D9] p-5 shadow-xl flex items-center justify-center"
          >
            {/* Calligraphic Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full text-[#111111] fill-current">
              <g stroke="none">
                <path d="M125 155 C120 185 110 235 95 280 C80 325 65 348 90 350 C120 352 165 330 200 305 C210 298 215 310 205 318 C160 355 105 375 70 370 C40 365 55 320 75 270 C92 225 105 175 108 145 C110 135 128 142 125 155 Z"/>
                <polygon points="120,95 138,113 120,131 102,113" />
                <path d="M220 250 C205 230 205 200 225 190 C245 180 270 195 270 225 C270 260 245 285 220 305 C195 325 180 355 175 390 C173 400 160 395 162 385 C170 345 190 310 218 285 C235 270 248 250 248 225 C248 208 236 200 226 205 C216 210 216 228 226 242 C230 248 225 255 220 250 Z"/>
                <path d="M340 230 C325 210 325 185 345 175 C365 165 390 180 390 210 C390 240 365 265 340 275 C305 290 275 315 260 350 C240 395 265 440 315 445 C370 450 425 410 455 355 C460 345 470 352 465 362 C430 425 365 470 300 465 C240 460 210 405 235 345 C255 300 295 270 335 255 C350 250 368 238 368 212 C368 195 356 188 346 193 C336 198 335 215 345 228 C350 234 345 240 340 230 Z"/>
                <polygon points="345,105 363,123 345,141 327,123" />
                <polygon points="385,95 403,113 385,131 367,113" />
                <path d="M280 145 C295 135 310 135 320 140 C325 142 320 150 315 148 C305 145 295 145 285 152 C280 155 275 150 280 145 Z"/>
              </g>
            </svg>
          </motion.div>

          <h1 className="font-serif text-5xl sm:text-7xl tracking-tight text-[#111111] font-normal">
            ذوق
          </h1>
          <p className="font-serif text-2xl sm:text-3xl tracking-widest uppercase text-[#57504B]">
            ZAUQ
          </p>
          <p className="text-sm sm:text-base text-[#786E65] font-serif italic max-w-sm mx-auto">
            The taste to know what feels right.
          </p>
        </section>

        {/* Beat 02 — Taste */}
        <section className="border-t border-[#E8E2D9] pt-14 text-center sm:text-left space-y-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C827A]">01 · The Meaning</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] leading-snug">
            Zauq means taste.
          </h2>
          <p className="text-base sm:text-lg text-[#57504B] leading-relaxed max-w-xl">
            Not simply what you like. But the instinct to recognize what feels right to you.
          </p>
        </section>

        {/* Beat 03 — Too Much Choice */}
        <section className="border-t border-[#E8E2D9] pt-14 space-y-6">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C827A]">02 · The Landscape</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] leading-snug">
            There is too much to choose from.
          </h2>
          <p className="text-base sm:text-lg text-[#57504B] leading-relaxed max-w-xl">
            Thousands of pieces. Hundreds of fleeting trends. Endless checkbox filter trees.
          </p>
          <p className="text-base sm:text-lg text-[#57504B] leading-relaxed max-w-xl">
            Yet knowing what you want doesn’t always mean knowing how to find it.
          </p>
        </section>

        {/* Beat 04 — Intent */}
        <section className="border-t border-[#E8E2D9] pt-14 space-y-6">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C827A]">03 · The Shift</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] leading-snug">
            So we built a different way to look.
          </h2>
          <p className="text-base sm:text-lg text-[#57504B] leading-relaxed max-w-xl">
            You don’t start with a category. You start with an idea.
          </p>
          <div className="p-6 rounded-3xl bg-white border border-[#E8E2D9] shadow-md space-y-2 max-w-lg">
            <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider block">An Intent:</span>
            <p className="font-serif text-lg text-[#111111] italic">
              &ldquo;Something understated for a summer wedding. Linen. Relaxed. Neutral. A little more polished, but not formal.&rdquo;
            </p>
            <p className="text-xs text-[#786E65] pt-2 border-t border-[#F2ECE4]">
              Zauq understands the aesthetic intention behind the words.
            </p>
          </div>
        </section>

        {/* Beat 05 — The Transformation */}
        <section className="border-t border-[#E8E2D9] pt-14 space-y-6">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C827A]">04 · The Transformation</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] leading-snug">
            From thought &rarr; to considered edit.
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs">
              <span className="text-[10px] font-mono text-[#8C827A] uppercase block mb-1">01 · Thought</span>
              <p className="text-xs text-[#111111] font-medium leading-relaxed">
                &ldquo;Something elegant for a summer wedding under $250.&rdquo;
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] shadow-xs">
              <span className="text-[10px] font-mono text-[#8C827A] uppercase block mb-1">02 · Zauq Brief</span>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-white text-[9px] font-semibold text-[#111111] border border-[#E8E2D9]">
                  Wedding Guest
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[9px] font-semibold text-[#111111] border border-[#E8E2D9]">
                  Elegant
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[9px] font-semibold text-[#111111] border border-[#E8E2D9]">
                  Summer
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[9px] font-semibold text-[#111111] border border-[#E8E2D9]">
                  &lt; $250
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111111] text-white shadow-md">
              <span className="text-[10px] font-mono text-stone-400 uppercase block mb-1">03 · Your Edit</span>
              <p className="text-xs text-stone-200 font-medium leading-relaxed">
                6 carefully selected pieces. 1-by-1 reel discovery. Zero clutter.
              </p>
            </div>
          </div>
        </section>

        {/* Beat 06 — Intelligence in Background */}
        <section className="border-t border-[#E8E2D9] pt-14 space-y-6">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C827A]">05 · Philosophy</span>
          <blockquote className="font-serif text-2xl sm:text-3xl text-[#111111] leading-relaxed italic border-l-2 border-[#111111] pl-6 my-4">
            &ldquo;We don’t believe more choice means better choice. Zauq isn’t here to show you everything. It’s here to help you find what matters.&rdquo;
          </blockquote>

          <p className="text-sm sm:text-base text-[#57504B] leading-relaxed max-w-xl">
            Zauq uses AI to understand the natural language people use when describing what they want. It interprets occasion, aesthetic, colour, fabric, budget, and mood.
          </p>

          <p className="font-serif text-xl sm:text-2xl text-[#111111] font-medium pt-2">
            The AI isn’t the product. Your taste is.
          </p>
        </section>

        {/* Beat 07 — Interactive Experience Demonstration */}
        <section className="border-t border-[#E8E2D9] pt-14 space-y-6">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8C827A]">06 · Interactive Taste</span>
          <h2 className="font-serif text-3xl text-[#111111]">
            Experience the philosophy
          </h2>
          <p className="text-xs sm:text-sm text-[#786E65]">
            Describe an outfit concept below to see how Zauq shapes your intent:
          </p>

          <form onSubmit={handleTestIntent} className="flex gap-2 max-w-lg">
            <input
              type="text"
              value={interactiveIntent}
              onChange={(e) => setInteractiveIntent(e.target.value)}
              placeholder="e.g., 'silk slip dress for a moody rooftop dinner'..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white border border-[#E8E2D9] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
            />
            <button
              type="submit"
              disabled={!interactiveIntent.trim() || isInterpreting}
              className="px-5 py-3 rounded-2xl bg-[#111111] text-white text-xs font-semibold hover:bg-black transition-all active:scale-95 shrink-0"
            >
              {isInterpreting ? 'Shaping...' : 'Shape'}
            </button>
          </form>

          {interactiveOutput && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs max-w-lg space-y-2"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A] block">
                Zauq Understood:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {interactiveOutput.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-[10px] font-semibold text-[#111111]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#57504B] italic pt-1">
                &ldquo;{interactiveOutput.summary}&rdquo;
              </p>
            </motion.div>
          )}
        </section>

        {/* Beat 08 — The Belief & Return to Product CTA */}
        <section className="border-t border-[#E8E2D9] pt-14 pb-12 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="font-serif text-3xl sm:text-5xl text-[#111111] font-normal leading-tight">
              Good taste isn&apos;t about following more.
              <br />
              It&apos;s about knowing what feels right.
            </h2>
            <p className="text-xs sm:text-sm text-[#786E65] max-w-md mx-auto">
              Zauq turns what you have in mind into what’s worth looking at.
            </p>
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-black shadow-xl transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Ask Zauq &rarr;</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
