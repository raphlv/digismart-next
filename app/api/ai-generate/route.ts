import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function sanitizeAiOutput(raw: string): string {
  return raw
    .replace(/```[\w]*\n?/g, '')
    .replace(/---+\s*Support Pollinations\.AI[\s\S]*$/i, '')
    .replace(/\*\*Sponsor\*\*[\s\S]*$/i, '')
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      systemPrompt = '',
      userPrompt = '',
      jsonMode = false,
      temperature = 0.3,
      clientApiKey = '',
    } = body || {};

    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json({ error: 'userPrompt required' }, { status: 400 });
    }

    const geminiKey =
      (typeof clientApiKey === 'string' && clientApiKey.trim().length > 10
        ? clientApiKey.trim()
        : '') || process.env.GEMINI_API_KEY || '';

    // 1. Official Gemini API (via server env var GEMINI_API_KEY or client key)
    if (geminiKey) {
      for (const model of ['gemini-2.0-flash', 'gemini-1.5-flash']) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
            geminiKey
          )}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
                },
              ],
              generationConfig: {
                temperature,
                maxOutputTokens: 1800,
                ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
              },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const text = sanitizeAiOutput(
              data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
            );
            if (text.length > 20) {
              return NextResponse.json({
                text,
                provider: `Google Gemini (${model})`,
              });
            }
          }
        } catch (err) {
          console.warn(`Gemini ${model} failed:`, err);
        }
      }
    }

    // 2. Server-side Public AI Engine (avoids browser CORS issues)
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 14000);
    try {
      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          model: 'openai',
          temperature,
          ...(jsonMode ? { jsonMode: true } : {}),
        }),
      });
      clearTimeout(timer);

      if (res.ok) {
        const text = sanitizeAiOutput(await res.text());
        if (text.length > 20) {
          return NextResponse.json({
            text,
            provider: 'AI Engine (Server Proxy)',
          });
        }
      }
    } catch (err) {
      clearTimeout(timer);
      console.warn('Server AI call failed:', err);
    }

    return NextResponse.json({ text: '', provider: 'fallback' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'AI route error', text: '' },
      { status: 500 }
    );
  }
}
