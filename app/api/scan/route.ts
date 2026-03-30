import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }

  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ComplyFlow/1.0)',
      },
    });

    const html = await response.text();
    const lowerHtml = html.toLowerCase();

    const hasPrivacy =
      lowerHtml.includes('privacy policy') ||
      lowerHtml.includes('privacy-policy') ||
      lowerHtml.includes('/privacy');

    const hasTerms =
      lowerHtml.includes('terms of service') ||
      lowerHtml.includes('terms and conditions') ||
      lowerHtml.includes('/terms');

    const hasCookies =
      lowerHtml.includes('cookie') ||
      lowerHtml.includes('gdpr') ||
      lowerHtml.includes('consent');

    const score = [hasPrivacy, hasTerms, hasCookies].filter(Boolean).length;
    const complianceScore = Math.round((score / 3) * 100);

    return NextResponse.json({
      url: fullUrl,
      missingPrivacy: !hasPrivacy,
      missingTerms: !hasTerms,
      missingCookies: !hasCookies,
      complianceScore,
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Could not scan this website. Please check the URL and try again.' },
      { status: 500 }
    );
  }
}
