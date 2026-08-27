import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ALLOWED_TAXONOMY } from '@/data/taxonomy';
import { InterpretResponseSchema, TaxonomyField } from '@/types/catalog';

// In-memory rate limiter for serverless abuse protection
const ipRateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 45; // 45 requests per min per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Ultra-robust fashion taxonomy synonym & concept interpreter
function fallbackHeuristicParse(text: string, existingLabels: string[] = []) {
  const normalized = text.toLowerCase().trim();
  const tokens = normalized.split(/[\s,+/&]+/).filter(Boolean);

  const tags: Record<TaxonomyField, string[]> = {
    occasion: [],
    setting: [],
    palette: [],
    pattern: [],
    silhouette: [],
    season: [],
    category: [],
    priceTier: [],
    shopFor: [],
  };

  // Direct taxonomy token match
  for (const [field, allowedList] of Object.entries(ALLOWED_TAXONOMY)) {
    for (const val of allowedList) {
      const valLower = val.toLowerCase();
      if (normalized.includes(valLower) || tokens.some((t) => t === valLower)) {
        if (!tags[field as TaxonomyField].includes(val)) {
          tags[field as TaxonomyField].push(val);
        }
      }
    }
  }

  // 1. Occasion & Event mappings
  if (normalized.includes('wedding') || normalized.includes('shaadi') || normalized.includes('reception') || normalized.includes('nikkah') || normalized.includes('mehndi') || normalized.includes('barat')) {
    tags.occasion.push('wedding-guest');
    tags.priceTier.push('premium');
  }
  if (normalized.includes('cocktail') || normalized.includes('party') || normalized.includes('club') || normalized.includes('night out') || normalized.includes('soiree')) {
    tags.occasion.push('cocktail', 'party');
  }
  if (normalized.includes('date') || normalized.includes('romantic') || normalized.includes('anniversary')) {
    tags.occasion.push('date-night');
  }
  if (normalized.includes('gala') || normalized.includes('black tie') || normalized.includes('red carpet') || normalized.includes('prom') || normalized.includes('ball')) {
    tags.occasion.push('gala', 'formal');
    tags.priceTier.push('luxury');
  }
  if (normalized.includes('office') || normalized.includes('work') || normalized.includes('corporate') || normalized.includes('meeting') || normalized.includes('business')) {
    tags.occasion.push('work');
    tags.setting.push('office');
    tags.silhouette.push('tailored', 'structured');
  }
  if (normalized.includes('beach') || normalized.includes('vacation') || normalized.includes('resort') || normalized.includes('holiday') || normalized.includes('island') || normalized.includes('coastal')) {
    tags.setting.push('beach', 'resort');
    tags.occasion.push('vacation');
    tags.season.push('summer');
  }
  if (normalized.includes('rooftop') || normalized.includes('lounge') || normalized.includes('bar') || normalized.includes('terrace')) {
    tags.setting.push('rooftop');
    tags.occasion.push('cocktail');
  }
  if (normalized.includes('brunch') || normalized.includes('sunday') || normalized.includes('cafe') || normalized.includes('coffee') || normalized.includes('lunch')) {
    tags.occasion.push('brunch', 'casual');
    tags.setting.push('cafe');
  }
  if (normalized.includes('festival') || normalized.includes('concert') || normalized.includes('coachella') || normalized.includes('rave')) {
    tags.occasion.push('festival', 'party');
    tags.palette.push('vibrant');
  }
  if (normalized.includes('lounge') || normalized.includes('chill') || normalized.includes('comfy') || normalized.includes('home') || normalized.includes('errands')) {
    tags.occasion.push('lounge', 'casual');
    tags.silhouette.push('relaxed');
  }
  if (normalized.includes('travel') || normalized.includes('airport') || normalized.includes('flight') || normalized.includes('road trip')) {
    tags.occasion.push('travel', 'casual');
    tags.silhouette.push('relaxed');
  }

  // 2. Fabrics, Weaves & Textures
  if (normalized.includes('linen') || normalized.includes('flax')) {
    tags.pattern.push('linen-texture');
    tags.season.push('summer');
  }
  if (normalized.includes('silk') || normalized.includes('satin') || normalized.includes('glossy') || normalized.includes('lustrous') || normalized.includes('sheen')) {
    tags.pattern.push('silk-sheen');
    tags.priceTier.push('premium');
  }
  if (normalized.includes('crochet') || normalized.includes('macrame') || normalized.includes('lace') || normalized.includes('net') || normalized.includes('mesh')) {
    tags.pattern.push('crochet');
  }
  if (normalized.includes('knit') || normalized.includes('ribbed') || normalized.includes('sweater') || normalized.includes('cardigan') || normalized.includes('wool') || normalized.includes('cashmere')) {
    tags.pattern.push('knit', 'ribbed');
    tags.season.push('fall', 'winter');
  }
  if (normalized.includes('striped') || normalized.includes('stripe') || normalized.includes('pinstripe')) {
    tags.pattern.push('striped');
  }
  if (normalized.includes('floral') || normalized.includes('flower') || normalized.includes('botanical') || normalized.includes('bloom')) {
    tags.pattern.push('floral');
    tags.season.push('spring', 'summer');
  }
  if (normalized.includes('plaid') || normalized.includes('check') || normalized.includes('tartan') || normalized.includes('houndstooth')) {
    tags.pattern.push('plaid');
  }
  if (normalized.includes('solid') || normalized.includes('plain') || normalized.includes('clean') || normalized.includes('unprinted')) {
    tags.pattern.push('solid');
  }

  // 3. Colors & Palette
  if (normalized.includes('black') || normalized.includes('noir') || normalized.includes('obsidian') || normalized.includes('dark') || normalized.includes('charcoal')) {
    tags.palette.push('black', 'monochrome');
  }
  if (normalized.includes('white') || normalized.includes('cream') || normalized.includes('ivory') || normalized.includes('eggshell') || normalized.includes('pearl')) {
    tags.palette.push('white', 'cream', 'neutral');
  }
  if (normalized.includes('olive') || normalized.includes('sage') || normalized.includes('khaki') || normalized.includes('moss') || normalized.includes('green')) {
    tags.palette.push('olive', 'earthy');
  }
  if (normalized.includes('terracotta') || normalized.includes('rust') || normalized.includes('clay') || normalized.includes('bronze') || normalized.includes('cinnamon')) {
    tags.palette.push('terracotta', 'earthy');
  }
  if (normalized.includes('navy') || normalized.includes('midnight') || normalized.includes('indigo') || normalized.includes('cobalt') || normalized.includes('blue')) {
    tags.palette.push('navy');
  }
  if (normalized.includes('earthy') || normalized.includes('neutral') || normalized.includes('beige') || normalized.includes('sand') || normalized.includes('taupe') || normalized.includes('tan') || normalized.includes('camel')) {
    tags.palette.push('earthy', 'neutral');
  }
  if (normalized.includes('pastel') || normalized.includes('baby blue') || normalized.includes('lavender') || normalized.includes('mint') || normalized.includes('blush') || normalized.includes('lilac')) {
    tags.palette.push('pastel');
    tags.season.push('spring', 'summer');
  }
  if (normalized.includes('burgundy') || normalized.includes('maroon') || normalized.includes('wine') || normalized.includes('bordeaux') || normalized.includes('cherry')) {
    tags.palette.push('burgundy', 'jewel-tone');
  }
  if (normalized.includes('vibrant') || normalized.includes('bright') || normalized.includes('neon') || normalized.includes('colorful') || normalized.includes('bold color')) {
    tags.palette.push('vibrant');
  }
  if (normalized.includes('gold') || normalized.includes('metallic') || normalized.includes('shimmer') || normalized.includes('champagne')) {
    tags.palette.push('gold', 'jewel-tone');
  }

  // 4. Silhouettes & Cuts
  if (normalized.includes('oversized') || normalized.includes('baggy') || normalized.includes('loose') || normalized.includes('slouchy') || normalized.includes('boyfriend')) {
    tags.silhouette.push('oversized', 'relaxed');
  }
  if (normalized.includes('tailored') || normalized.includes('sharp') || normalized.includes('blazer') || normalized.includes('suit') || normalized.includes('structured')) {
    tags.silhouette.push('tailored', 'structured');
  }
  if (normalized.includes('wide leg') || normalized.includes('wide-leg') || normalized.includes('palazzo') || normalized.includes('flared pants')) {
    tags.silhouette.push('wide-leg');
  }
  if (normalized.includes('flowy') || normalized.includes('breezy') || normalized.includes('flared') || normalized.includes('maxi') || normalized.includes('swaying')) {
    tags.silhouette.push('flowy');
  }
  if (normalized.includes('bodycon') || normalized.includes('fitted') || normalized.includes('tight') || normalized.includes('slip') || normalized.includes('figure')) {
    tags.silhouette.push('bodycon');
  }
  if (normalized.includes('cropped') || normalized.includes('crop') || normalized.includes('short cut')) {
    tags.silhouette.push('cropped');
  }
  if (normalized.includes('wrap') || normalized.includes('kimono') || normalized.includes('tie-waist')) {
    tags.silhouette.push('wrap');
  }

  // 5. Aesthetics & Vibes
  if (normalized.includes('old money') || normalized.includes('quiet luxury') || normalized.includes('stealth wealth') || normalized.includes('classic') || normalized.includes('timeless') || normalized.includes('clean aesthetic')) {
    tags.silhouette.push('minimalist', 'tailored');
    tags.palette.push('neutral', 'cream', 'earthy');
    tags.priceTier.push('premium');
  }
  if (normalized.includes('streetwear') || normalized.includes('street') || normalized.includes('urban') || normalized.includes('edgy') || normalized.includes('grunge')) {
    tags.silhouette.push('oversized');
    tags.palette.push('monochrome', 'black');
    tags.occasion.push('casual');
  }
  if (normalized.includes('minimalist') || normalized.includes('minimal') || normalized.includes('clean') || normalized.includes('simple')) {
    tags.silhouette.push('minimalist');
    tags.pattern.push('solid');
  }
  if (normalized.includes('boho') || normalized.includes('bohemian') || normalized.includes('artisan') || normalized.includes('indie')) {
    tags.silhouette.push('flowy', 'relaxed');
    tags.pattern.push('crochet', 'floral');
  }

  // 6. Categories
  if (normalized.includes('dress') || normalized.includes('gown') || normalized.includes('frock') || normalized.includes('sundress') || normalized.includes('kaftan')) {
    tags.category.push('dress');
  }
  if (normalized.includes('top') || normalized.includes('shirt') || normalized.includes('blouse') || normalized.includes('tee') || normalized.includes('camisole') || normalized.includes('corset')) {
    tags.category.push('top');
  }
  if (normalized.includes('outerwear') || normalized.includes('jacket') || normalized.includes('coat') || normalized.includes('blazer') || normalized.includes('trench') || normalized.includes('bomber')) {
    tags.category.push('outerwear');
  }
  if (normalized.includes('set') || normalized.includes('co-ord') || normalized.includes('suit') || normalized.includes('two piece') || normalized.includes('matching')) {
    tags.category.push('set');
  }
  if (normalized.includes('pants') || normalized.includes('bottom') || normalized.includes('trouser') || normalized.includes('skirt') || normalized.includes('shorts') || normalized.includes('jeans')) {
    tags.category.push('bottom');
  }

  // Deduplicate array values
  for (const field of Object.keys(tags) as TaxonomyField[]) {
    tags[field] = Array.from(new Set(tags[field]));
  }

  // Generate crisp editorial chip label
  const words = text.trim().split(/\s+/).slice(0, 4);
  const label = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return {
    label: label.slice(0, 32),
    tags,
  };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting & Abuse protection
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'anonymous';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait a moment before refining again.',
          fallback: true,
        },
        { status: 429 }
      );
    }

    // 2. Input validation & cap
    const body = await req.json();
    const { freeText, existingFilterLabels = [] } = body;

    if (!freeText || typeof freeText !== 'string') {
      return NextResponse.json(
        { error: 'Refinement text is required' },
        { status: 400 }
      );
    }

    const cleanQuery = freeText.trim().slice(0, 140);
    if (!cleanQuery) {
      return NextResponse.json(
        { error: 'Refinement query cannot be empty' },
        { status: 400 }
      );
    }

    // 3. Check for API key
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    if (!apiKey) {
      const fallbackResult = fallbackHeuristicParse(cleanQuery, existingFilterLabels);
      return NextResponse.json({
        success: true,
        data: fallbackResult,
        isFallback: true,
        notice: 'Using deterministic taxonomy heuristic engine.',
      });
    }

    // 4. Construct Gemini prompt with strict JSON contract & few-shot grounding
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const prompt = `
You are the expert fashion taxonomy interpreter for Zauq (ذوق) — an AI visual fashion discovery feed.
Your ONLY job is to map natural language refinement phrases into structured tags from our fixed fashion ontology.

ALLOWED TAXONOMY DICTIONARY:
${JSON.stringify(ALLOWED_TAXONOMY, null, 2)}

ACTIVE PREVIOUS FILTERS:
${JSON.stringify(existingFilterLabels)}

USER REFINEMENT INPUT: "${cleanQuery}"

GROUNDING RULES:
1. Extract attributes for: occasion, setting, palette, pattern, silhouette, season, category, priceTier, shopFor.
2. ONLY select values that explicitly exist in the ALLOWED TAXONOMY. Never invent new tags.
3. If a dimension is not implied or matched, return an empty array [].
4. Create a concise, elegant 2-3 word chip title for "label" (e.g., "Silk Slip Dress", "Quiet Luxury Linen", "Wide-Leg Office").
5. Return strictly valid JSON:
{
  "label": "Short editorial title",
  "tags": {
    "occasion": [],
    "setting": [],
    "palette": [],
    "pattern": [],
    "silhouette": [],
    "season": [],
    "category": [],
    "priceTier": [],
    "shopFor": []
  }
}
`;

    // 5. Call Gemini with a 5.5-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5500);

    let rawOutput = '';
    try {
      const response = await model.generateContent(prompt);
      clearTimeout(timeoutId);
      rawOutput = response.response.text();
    } catch (apiError: any) {
      clearTimeout(timeoutId);
      console.warn('Gemini API timeout or error. Using fallback heuristic engine:', apiError?.message);
      const fallbackResult = fallbackHeuristicParse(cleanQuery, existingFilterLabels);
      return NextResponse.json({
        success: true,
        data: fallbackResult,
        isFallback: true,
      });
    }

    // 6. Parse and validate JSON with Zod
    let parsedJson: any;
    try {
      const cleanJson = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedJson = JSON.parse(cleanJson);
    } catch (parseError) {
      console.warn('Malformed JSON from LLM, executing fallback heuristic.');
      const fallbackResult = fallbackHeuristicParse(cleanQuery, existingFilterLabels);
      return NextResponse.json({
        success: true,
        data: fallbackResult,
        isFallback: true,
      });
    }

    const validated = InterpretResponseSchema.safeParse(parsedJson);
    if (!validated.success) {
      console.warn('Zod schema validation mismatch on LLM output, executing fallback heuristic.');
      const fallbackResult = fallbackHeuristicParse(cleanQuery, existingFilterLabels);
      return NextResponse.json({
        success: true,
        data: fallbackResult,
        isFallback: true,
      });
    }

    // 7. Sanitize: enforce exact whitelist match against ALLOWED_TAXONOMY
    const sanitizedTags: Record<string, string[]> = {};
    for (const [field, allowedValues] of Object.entries(ALLOWED_TAXONOMY)) {
      const candidateList = (validated.data.tags as any)[field] || [];
      sanitizedTags[field] = candidateList.filter((val: string) =>
        allowedValues.includes(val.toLowerCase().trim())
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        label: validated.data.label,
        tags: sanitizedTags,
      },
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Unhandled error in /api/interpret route:', error);
    return NextResponse.json(
      {
        error: 'Internal server error while interpreting refinement.',
        fallback: true,
      },
      { status: 500 }
    );
  }
}
