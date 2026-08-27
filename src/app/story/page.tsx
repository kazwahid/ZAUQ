'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check, Compass } from 'lucide-react';
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
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/80 backdrop-blur-xl border-b border-[#E8E2D9]/60 px-5 sm:px-10 h-16 flex items-center justify-between">
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
        {/* Act I: The Name & Meaning */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 relative">
          {/* Ambient Glow */}
          <div className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-[#E8E2D9]/50 to-transparent blur-3xl -z-10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <span className="inline-block text-[11px] font-mono uppercase tracking-[0.3em] text-[#8C827A]">
              The Origin
            </span>

            <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl tracking-[0.15em] font-light text-[#111111] uppercase">
              ZAUQ
            </h1>

            <p className="font-serif text-xl sm:text-2xl md:text-3xl text-[#57504B] font-light italic leading-relaxed">
              The taste to know what feels right.
            </p>

            <div className="w-12 h-px bg-[#111111]/30 mx-auto pt-2" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] animate-pulse block">
              Scroll to explore
            </span>
          </motion.div>
        </section>

        {/* Act II: What Taste Means */}
        <section className="py-24 sm:py-36 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block">
              01 · The Philosophy
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#111111] font-normal leading-[1.15] tracking-tight">
              Zauq means taste.
            </h2>

            <div className="space-y-6 text-lg sm:text-xl md:text-2xl text-[#57504B] font-light leading-relaxed max-w-2xl">
              <p>Not simply what you like.</p>
              <p className="font-serif text-[#111111] italic">
                But the instinct to recognize what feels right to you.
              </p>
              <p className="text-base sm:text-lg text-[#786E65] pt-2">
                It is the quiet confidence that discernment isn’t about wearing more, but selecting with intention.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Act III: The Landscape & Problem */}
        <section className="py-24 sm:py-36 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block">
              02 · The Landscape
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#111111] font-normal leading-[1.15] tracking-tight">
              There is too much to choose from.
            </h2>

            <div className="grid sm:grid-cols-3 gap-6 pt-4">
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
        <section className="py-24 sm:py-36 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block">
              03 · The Approach
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#111111] font-normal leading-[1.15] tracking-tight">
              So we built a different way to look.
            </h2>

            <p className="text-lg sm:text-xl text-[#57504B] leading-relaxed max-w-2xl font-light">
              You don’t start with a category. You start with an idea.
            </p>

            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8E2D9] shadow-xl space-y-4 max-w-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#111111]" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C827A] block">
                A Natural Thought
              </span>
              <p className="font-serif text-2xl sm:text-3xl text-[#111111] italic leading-snug">
                &ldquo;Something understated for a summer wedding. Linen. Relaxed. Neutral. A little more polished, but not formal.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-[#786E65] pt-2 border-t border-[#F2ECE4]">
                Zauq understands the subtle aesthetic intention behind every word.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Act V: The Transformation Demo */}
        <section className="py-24 sm:py-36 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block">
              04 · The Transformation
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#111111] font-normal leading-[1.15] tracking-tight">
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
            <div className="min-h-[260px]">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="p-8 rounded-3xl bg-white border border-[#E8E2D9] shadow-md space-y-3"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C827A]">
                      Step 1: The Human Input
                    </span>
                    <p className="font-serif text-2xl text-[#111111] italic">
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
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="p-8 rounded-3xl bg-white border border-[#E8E2D9] shadow-md space-y-4"
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
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
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
        <section className="py-24 sm:py-36 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] block">
              05 · The Principle
            </span>

            <blockquote className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#111111] font-light leading-snug italic border-l-2 border-[#111111] pl-6 sm:pl-8 py-2">
              &ldquo;We don’t believe more choice means better choice. Zauq isn’t here to show you everything. It’s here to help you find what matters.&rdquo;
            </blockquote>

            <div className="space-y-4 text-base sm:text-lg text-[#57504B] leading-relaxed max-w-2xl font-light">
              <p>
                Zauq uses AI quietly in the background to understand the language people naturally use when expressing what they want to wear.
              </p>
              <p className="font-serif text-2xl sm:text-3xl text-[#111111] font-medium pt-2">
                The AI isn’t the product. Your taste is.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Act VII: Interactive Moment */}
        <section className="py-24 sm:py-36 px-6 sm:px-12 max-w-4xl mx-auto border-t border-[#E8E2D9]">
          <motion.div {...FADE_UP} className="space-y-6">
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
                <p className="text-xs sm:text-sm text-[#57504B] italic">
                  You had an idea. We helped you find its shape.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:underline pt-2"
                >
                  <span>Curate this look in Ask Zauq &rarr;</span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Final Cinematic Climax Moment */}
        <section className="py-32 sm:py-48 px-6 text-center bg-[#111111] text-white rounded-t-[3rem] relative overflow-hidden">
          {/* Subtle Ambient Background Flare */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-stone-700/20 blur-3xl pointer-events-none" />

          <motion.div {...FADE_UP} className="max-w-2xl mx-auto space-y-8 relative z-10">
            <h2 className="font-serif text-4xl sm:text-6xl font-light leading-tight tracking-tight">
              Good taste isn&apos;t about following more.
              <br />
              <span className="italic text-stone-300 font-serif">
                It&apos;s about knowing what feels right.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-stone-400 font-light max-w-md mx-auto">
              Zauq turns what you have in mind into what’s worth looking at.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
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
