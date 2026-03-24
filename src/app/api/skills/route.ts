import { NextRequest, NextResponse } from 'next/server';

// Simple proxy to ESCO API to fetch skills for given concept (occupation/category).
// Because ESCO returns huge data, we limit to first 50 skill labels.
// No API key required. Docs: https://ec.europa.eu/esco/api-docs/

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') || '';
  if (!category) {
    return NextResponse.json({ skills: [] });
  }

  try {
    const query = encodeURIComponent(category);
    const url = `https://ec.europa.eu/esco/api/search?text=${query}&type=skill&limit=50&language=en`;
    const escoRes = await fetch(url, { cache: 'no-store' });
    if (!escoRes.ok) throw new Error('ESCO error');
    const data = await escoRes.json();
    const skills = (data.results || []).map((r: any) => r.title).filter(Boolean);
    return NextResponse.json({ skills });
  } catch (e) {
    return NextResponse.json({ skills: [] });
  }
}
