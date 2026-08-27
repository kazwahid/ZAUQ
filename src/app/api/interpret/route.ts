import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ALLOWED_TAXONOMY } from '@/data/taxonomy';
import { InterpretResponseSchema, TaxonomyField } from '@/types/catalog';

// In-memory rate limiter for serverless abuse protection
const ipRateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per min per IP

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

// High-precision fashion taxonomy synonym & concept dictionary
function fallbackHeuristicParse(text: string, existingLabels: string[]) {
  const normalized = text.toLowerCase().trim();
  const tokens = normalized.split(/[\s,+/]+/).filter(Boolean);

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

  // Check matching tokens against allowed taxonomy directly
  for (const [field, allowedList] of Object.entries(ALLOWED_TAXONOMY)) {
    for (const val of allowedList) {
      const valLower = val.toLowerCase();
      if (normalized.includes(valLower) || tokens.some(t => t === valLower)) {
        if (!tags[field as TaxonomyField].includes(val)) {
          tags[field as TaxonomyField].push(val);
        }
      }
    }
  }

  // Deep fashion domain synonym mapping
  if (normalized.includes('wedding') || normalized.includes('shaadi') || normalized.includes('reception')) {
    tags.occasion.push('wedding-guest');
  }
  if (normalized.includes('cocktail') || normalized.includes('party') || normalized.includes('club') || normalized.includes('evening')) {
    tags.occasion.push('cocktail', 'party');
  }
  if (normalized.includes('date') || normalized.includes('romantic')) {
    tags.occasion.push('date-night');
  }
  if (normalized.includes('gala') || normalized.includes('black tie') || normalized.includes('red carpet')) {
    tags.occasion.push('gala', 'formal');
    tags.priceTier.push('luxury');
  }
  if (normalized.includes('office') || normalized.includes('work') || normalized.includes('corporate') || normalized.includes('meeting')) {
    tags.occasion.push('work');
    tags.setting.push('office');
    tags.silhouette.push('tailored', 'structured');
  }
  if (normalized.includes('beach') || normalized.includes('vacation') || normalized.includes('resort') || normalized.includes('sea') || normalized.includes('island')) {
    tags.setting.push('beach', 'resort');
    tags.occasion.push('vacation');
    tags.season.push('summer');
  }
  if (normalized.includes('rooftop') || normalized.includes('lounge') || normalized.includes('bar')) {
    tags.setting.push('rooftop');
    tags.occasion.push('cocktail');
  }
  if (normalized.includes('brunch') || normalized.includes('sunday') || normalized.includes('cafe') || normalized.includes('coffee')) {
    tags.occasion.push('brunch', 'casual');
    tags.setting.push('cafe');
  }

  // Fabrics & textures
  if (normalized.includes('linen')) tags.pattern.push('linen-texture');
  if (normalized.includes('silk') || normalized.includes('satin') || normalized.includes('glossy') || normalized.includes('lustrous')) {
    tags.pattern.push('silk-sheen');
  }
  if (normalized.includes('crochet') || normalized.includes('lace') || normalized.includes('net')) {
    tags.pattern.push('crochet');
  }
  if (normalized.includes('knit') || normalized.includes('ribbed') || normalized.includes('sweater') || normalized.includes('cardigan')) {
    tags.pattern.push('knit', 'ribbed');
  }

  // Silhouettes & cuts
  if (normalized.includes('oversized') || normalized.includes('baggy') || normalized.includes('loose')) {
    tags.silhouette.push('oversized', 'relaxed');
  }
  if (normalized.includes('tailored') || normalized.includes('sharp') || normalized.includes('blazer') || normalized.includes('suit')) {
    tags.silhouette.push('tailored', 'structured');
  }
  if (normalized.includes('wide leg') || normalized.includes('wide-leg') || normalized.includes('palazzo') || normalized.includes('trousers')) {
    tags.silhouette.push('wide-leg');
  }
  if (normalized.includes('flowy') || normalized.includes('breezy') || normalized.includes('flared') || normalized.includes('maxi')) {
    tags.silhouette.push('flowy');
  }
  if (normalized.includes('bodycon') || normalized.includes('fitted') || normalized.includes('tight') || normalized.includes('slip')) {
    tags.silhouette.push('bodycon');
  }

  // Aesthetics & vibes
  if (normalized.includes('old money') || normalized.includes('quiet luxury') || normalized.includes('clean aesthetic')) {
    tags.silhouette.push('minimalist', 'tailored');
    tags.palette.push('neutral', 'cream', 'earthy');
  }
  if (normalized.includes('streetwear') || normalized.includes('street') || normalized.includes('urban') || normalized.includes('edgy')) {
    tags.silhouette.push('oversized');
    tags.palette.push('monochrome', 'black');
    tags.occasion.push('casual');
  }
  if (normalized.includes('minimalist') || normalized.includes('minimal')) {
    tags.silhouette.push('minimalist');
  }

  // Categories
  if (normalized.includes('dress') || normalized.includes('gown') || normalized.includes('frock') || normalized.includes('sundress')) {
    tags.category.push('dress');
  }
  if (normalized.includes('top') || normalized.includes('shirt') || normalized.includes('blouse') || normalized.includes('tee')) {
    tags.category.push('top');
  }
  if (normalized.includes('outerwear') || normalized.includes('jacket') || normalized.includes('coat') || normalized.includes('blazer')) {
    tags.category.push('outerwear');
  }
  if (normalized.includes('set') || normalized.includes('co-ord') || normalized.includes('suit') || normalized.includes('two piece')) {
    tags.category.push('set');
  }
  if (normalized.includes('pants') || normalized.includes('bottom') || normalized.includes('trouser') || normalized.includes('skirt')) {
    tags.category.push('bottom');
  }

  // Deduplicate array values
  for (const field of Object.keys(tags) as TaxonomyField[]) {
    tags[field] = Array.from(new Set(tags[field]));
  }

  // Clean title label
  const words = text.trim().split(/\s+/);
  const label = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  return {
    label: label.slice(0, 35),
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

    // Cap length to 120 chars to prevent token abuse
    const cleanQuery = freeText.trim().slice(0, 120);
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
      console.warn('GEMINI_API_KEY not found in environment. Using fallback taxonomy parser.');
      const fallbackResult = fallbackHeuristicParse(cleanQuery, existingFilterLabels);
      return NextResponse.json({
        success: true,
        data: fallbackResult,
        isFallback: true,
        notice: 'Using deterministic heuristic engine (Set GEMINI_API_KEY for full AI parsing).',
      });
    }

    // 4. Construct Gemini prompt with strict JSON output contract
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const prompt = `
You are the fashion taxonomy parser for Zauq (ذوق) — an AI fashion discovery feed.
Your ONLY job is to interpret the user's natural language refinement text and map it into structured tags from our fixed vocabulary.

ALLOWED TAXONOMY:
${JSON.stringify(ALLOWED_TAXONOMY, null, 2)}

EXISTING ACTIVE FILTERS:
${JSON.stringify(existingFilterLabels)}

USER REFINEMENT: "${cleanQuery}"

STRICT RULES:
1. ONLY pick values that exist in the ALLOWED TAXONOMY for each field. DO NOT invent new words.
2. If a field has no match, return an empty array [].
3. Generate a clean, concise display label for the breadcrumb chip (e.g. "Beach Vacation", "Linen Silk", "Oversized Tailored").
4. Return ONLY valid JSON matching this schema:
{
  "label": "Short chip label (max 4 words)",
  "tags": {
    "occasion": ["vacation"],
    "setting": ["beach"],
    "palette": [],
    "pattern": [],
    "silhouette": [],
    "season": ["summer"],
    "category": [],
    "priceTier": [],
    "shopFor": []
  }
}
`;

    // 5. Call Gemini with a 6-second AbortController timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    let rawOutput = '';
    try {
      const response = await model.generateContent(prompt);
      clearTimeout(timeoutId);
      rawOutput = response.response.text();
    } catch (apiError: any) {
      clearTimeout(timeoutId);
      console.error('Gemini API call error or timeout:', apiError);
      // Graceful fallback to heuristic
      const fallbackResult = fallbackHeuristicParse(cleanQuery, existingFilterLabels);
      return NextResponse.json({
        success: true,
        data: fallbackResult,
        isFallback: true,
        notice: 'Still working with what you told me (AI took too long).',
      });
    }

    // 6. Parse and validate JSON with Zod
    let parsedJson: any;
    try {
      // Strip markdown code fences if present
      const cleanJson = rawOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedJson = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Malformed JSON from Gemini:', rawOutput);
      const fallbackResult = fallbackHeuristicParse(cleanQuery, existingFilterLabels);
      return NextResponse.json({
        success: true,
        data: fallbackResult,
        isFallback: true,
      });
    }

    const validated = InterpretResponseSchema.safeParse(parsedJson);
    if (!validated.success) {
      console.error('Zod schema validation failed on Gemini output:', validated.error);
      const fallbackResult = fallbackHeuristicParse(cleanQuery, existingFilterLabels);
      return NextResponse.json({
        success: true,
        data: fallbackResult,
        isFallback: true,
      });
    }

    // 7. Sanitize: enforce that all tags strictly exist in ALLOWED_TAXONOMY
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
