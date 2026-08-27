'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check, Compass, ChevronDown } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

const DEMO_TRANSFORMATION = {
  thought: 'Something understated for a summer wedding under $250. Linen, relaxed, but polished.',
  brief: [
    { label: 'Wedding Guest', category: 'Occasion' },
    { label: 'Relaxed Tailoring', category: 'Silhouette' },
    { label: 'Pure Linen', category: 'Fabric' },
    { label: 'Sand & Ivory', category: 'Palette' },
    { label: '< $250', category: 'Budget' },
  ],
  edits: [
    {
      title: 'Ivory Linen Wrap Maxi Dress',
      brand: 'Atelier Nöir',
      price: 195,
      reason: 'Breezy woven linen with tailored waist drape',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    },
    {
      title: 'Double-Breasted Linen Blazer & Trousers',
      brand: 'Sartoria Vane',
      price: 240,
      reason: 'Lightweight unstructured linen in soft oat',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
    },
    {
      title: 'Pleated Linen Midi Slip',
      brand: "Studio L'Ombre",
      price: 180,
      reason: 'Clean architectural seams with relaxed flow',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    },
  ],
};

const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function StoryPage() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [interactiveInput, setInteractiveInput] = useState('');
  const [hasTested, setHasTested] = useState(false);

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactiveInput.trim()) return;
    triggerHaptic('medium');
    setHasTested(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111111] selection:bg-[#111111] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Minimal Floating Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/85 backdrop-blur-xl border-b border-[#E8E2D9]/60 px-5 sm:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#786E65] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Return</span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] text-white text-xs font-medium hover:bg-black transition-all active:scale-95 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Zauq</span>
        </Link>
      </header>

      {/* Main Narrative Presentation */}
      <div className="pt-20">
        {/* Act I: The Hero with Borderless Calligraphic Emblem above ZAUQ */}
        <section className="min-h-[88vh] flex flex-col items-center justify-center text-center px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-2xl mx-auto flex flex-col items-center"
          >
            {/* Borderless Pure Calligraphic Emblem */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 text-[#111111] mb-1">
              <svg viewBox="0 0 512 512" className="w-full h-full fill-current" xmlns="http://www.w3.org/2000/svg">
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
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-[0.2em] font-normal text-[#111111] uppercase">
              ZAUQ
            </h1>

            <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#57504B] font-normal leading-relaxed">
              The taste to know what feels right.
            </p>

            <div className="w-10 h-px bg-[#111111]/20 mx-auto" />
          </motion.div>

          {/* Minimal Cinematic Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#8C827A]"
          >
            <span className="text-[9px] font-mono uppercase tracking-widest">Explore</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </motion.div>
        </section>

        {/* Act II: What Taste Means */}
        <section className="py-20 sm:py-32 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block">
              01 · The Philosophy
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] font-normal leading-[1.2] tracking-tight">
              Zauq means taste.
            </h2>

            <div className="space-y-4 text-base sm:text-lg md:text-xl text-[#57504B] leading-relaxed max-w-2xl">
              <p>Not simply what you like.</p>
              <p className="font-serif text-xl sm:text-2xl text-[#111111]">
                But the instinct to recognize what feels right to you.
              </p>
              <p className="text-sm sm:text-base text-[#786E65] pt-1">
                It is the quiet confidence that discernment isn’t about wearing more, but selecting with intention.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Act III: The Landscape & Problem */}
        <section className="py-20 sm:py-32 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block">
              02 · The Landscape
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] font-normal leading-[1.2] tracking-tight">
              There is too much to choose from.
            </h2>

            <div className="grid sm:grid-cols-3 gap-5 pt-3">
              <div className="p-6 rounded-3xl bg-white border border-[#E8E2D9] shadow-2xs space-y-2">
                <span className="text-2xl font-serif text-[#111111]">10,000+</span>
                <p className="text-xs text-[#786E65] leading-relaxed">
                  Products in endless e-commerce grids that demand hours of scrolling.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#E8E2D9] shadow-2xs space-y-2">
                <span className="text-2xl font-serif text-[#111111]">30+ Filters</span>
                <p className="text-xs text-[#786E65] leading-relaxed">
                  Rigid checkboxes that fail to understand mood, setting, or aesthetic nuances.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#E8E2D9] shadow-2xs space-y-2">
                <span className="text-2xl font-serif text-[#111111]">0 Context</span>
                <p className="text-xs text-[#786E65] leading-relaxed">
                  Yet knowing what you want doesn’t always mean knowing how to find it.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Act IV: The Shift */}
        <section className="py-20 sm:py-32 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block">
              03 · The Approach
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] font-normal leading-[1.2] tracking-tight">
              So we built a different way to look.
            </h2>

            <p className="text-base sm:text-lg text-[#57504B] leading-relaxed max-w-2xl">
              You don’t start with a category. You start with an idea.
            </p>

            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#E8E2D9] shadow-xl space-y-3 max-w-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#111111]" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C827A] block">
                A Natural Thought
              </span>
              <p className="font-serif text-xl sm:text-2xl text-[#111111] leading-snug">
                &ldquo;Something understated for a summer wedding. Linen. Relaxed. Neutral. A little more polished, but not formal.&rdquo;
              </p>
              <p className="text-xs text-[#786E65] pt-2 border-t border-[#F2ECE4]">
                Zauq understands the subtle aesthetic intention behind every word.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Act V: The Transformation Demo */}
        <section className="py-20 sm:py-32 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block">
              04 · The Transformation
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] font-normal leading-[1.2] tracking-tight">
              From thought &rarr; to considered edit.
            </h2>

            {/* Interactive Timeline Tabs */}
            <div className="flex gap-2 p-1.5 rounded-full bg-white border border-[#E8E2D9] w-fit">
              {['01 · Thought', '02 · Brief', '03 · Your Edit'].map((tab, idx) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveStep(idx);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeStep === idx
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-[#786E65] hover:text-[#111111]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Transformation Content Cards */}
            <div className="min-h-[240px]">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="p-7 rounded-3xl bg-white border border-[#E8E2D9] shadow-md space-y-3"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C827A]">
                      Step 1: The Human Input
                    </span>
                    <p className="font-serif text-xl sm:text-2xl text-[#111111]">
                      &ldquo;{DEMO_TRANSFORMATION.thought}&rdquo;
                    </p>
                    <p className="text-xs text-[#786E65]">
                      No categories clicked. No checkboxes selected. Pure language.
                    </p>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="p-7 rounded-3xl bg-white border border-[#E8E2D9] shadow-md space-y-4"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C827A]">
                      Step 2: Zauq Taxonomy Translation
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {DEMO_TRANSFORMATION.brief.map((b) => (
                        <div
                          key={b.label}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#111111]"
                        >
                          <span className="text-[10px] text-[#8C827A] uppercase">{b.category}:</span>
                          <span className="font-semibold">{b.label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[#786E65]">
                      Structured multidimensional intent mapped in milliseconds.
                    </p>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="grid sm:grid-cols-3 gap-3"
                  >
                    {DEMO_TRANSFORMATION.edits.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl bg-white border border-[#E8E2D9] p-3 shadow-xs space-y-2 flex flex-col justify-between"
                      >
                        <div className="w-full h-36 rounded-xl overflow-hidden bg-[#FAF8F5]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div>
                          <p className="text-[9px] uppercase font-bold text-[#8C827A]">{item.brand}</p>
                          <h4 className="font-serif text-xs font-semibold text-[#111111] truncate">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-[#57504B] line-clamp-2 mt-0.5">{item.reason}</p>
                        </div>
                        <span className="text-xs font-bold text-[#111111]">${item.price}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        {/* Act VI: Intelligence in Background */}
        <section className="py-20 sm:py-32 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block">
              05 · The Principle
            </span>

            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#111111] font-normal leading-snug border-l-2 border-[#111111] pl-6 sm:pl-8 py-1">
              &ldquo;We don’t believe more choice means better choice. Zauq isn’t here to show you everything. It’s here to help you find what matters.&rdquo;
            </blockquote>

            <div className="space-y-3 text-base sm:text-lg text-[#57504B] leading-relaxed max-w-2xl font-light">
              <p>
                Zauq uses AI quietly in the background to understand the language people naturally use when expressing what they want to wear.
              </p>
              <p className="font-serif text-xl sm:text-2xl text-[#111111] font-medium pt-2">
                The AI isn’t the product. Your taste is.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Act VII: Interactive Moment */}
        <section className="py-20 sm:py-32 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block">
              06 · Interactive Experience
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-normal leading-tight">
              Test an idea in your mind
            </h2>
            <p className="text-sm text-[#786E65] max-w-xl">
              Type an outfit mood or occasion. Watch how intent transforms into shape.
            </p>

            <form onSubmit={handleTestSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg">
              <input
                type="text"
                value={interactiveInput}
                onChange={(e) => setInteractiveInput(e.target.value)}
                placeholder="e.g., 'black silk slip dress for an evening gala'..."
                className="flex-1 px-4 py-3.5 rounded-2xl bg-white border border-[#E8E2D9] text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#111111] shadow-inner"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-[#111111] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all active:scale-95 shrink-0"
              >
                Shape Brief
              </button>
            </form>

            {hasTested && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-white border border-[#E8E2D9] shadow-md max-w-lg space-y-3"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111111]">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>That is Zauq.</span>
                </div>
                <p className="text-xs sm:text-sm text-[#57504B]">
                  You had an idea. We helped you find its shape.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:underline pt-1"
                >
                  <span>Curate this look in Ask Zauq &rarr;</span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Final Pure Obsidian Dark Finale (Zero cheap glow, Single-line Proposition) */}
        <section className="py-28 sm:py-40 px-6 text-center bg-[#111111] text-white rounded-t-[3rem] relative">
          <motion.div {...FADE_UP} className="max-w-3xl mx-auto space-y-8 relative z-10">
            <h2 className="font-serif text-3xl sm:text-5xl font-light leading-tight tracking-tight">
              Good taste isn&apos;t about following more.
              <br />
              <span className="text-stone-300 font-serif">
                It&apos;s about knowing what feels right.
              </span>
            </h2>

            {/* Single Line Proposition */}
            <p className="text-xs sm:text-sm md:text-base text-stone-400 font-normal whitespace-nowrap overflow-hidden text-ellipsis px-2">
              Zauq turns what you have in mind into what’s worth looking at.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#111111] font-semibold text-sm hover:bg-stone-100 shadow-2xl transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-[#111111]" />
                <span>Ask Zauq</span>
                <ArrowRight className="w-4 h-4 text-[#111111]" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/10 text-white border border-white/15 text-xs font-medium hover:bg-white/20 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Catalogue</span>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
