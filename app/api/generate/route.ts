import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Redis } from '@upstash/redis';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const { url, siteData } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

    // Build a richer prompt if we have site data
    const siteInfo = siteData ? `
Additional information about this website:
- Collects email addresses: ${siteData.collectsEmails ? 'Yes' : 'No'}
- Uses cookies/tracking: ${siteData.usesCookies ? 'Yes' : 'No'}
- Has payment processing: ${siteData.hasPayments ? 'Yes' : 'No'}
- Has user accounts: ${siteData.hasAccounts ? 'Yes' : 'No'}
- Shares data with third parties: ${siteData.sharesData ? 'Yes' : 'No'}
` : '';

    const prompt = `Generate a professional, comprehensive privacy policy for a website with the URL: ${url}.

IMPORTANT: Use "${today}" as the Effective Date and Last Updated date. Do not use [Insert Date] or any placeholder.
${siteInfo}
The privacy policy should include:
1. Introduction and overview
2. What information we collect
3. How we use the information
4. Cookies and tracking
5. Third party services
6. Data retention
7. User rights (GDPR/CCPA)
8. Contact information
9. Changes to this policy

Format it cleanly with clear headings and professional language. Make it appropriate for a small to medium sized business website. Use the domain name as the company name.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a legal document specialist who writes clear, professional privacy policies for websites.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
    });

    const policy = completion.choices[0].message.content;
    const id = Math.random().toString(36).substring(2, 10);

    // Save both the policy text AND the structured data
    await redis.set(`policy-${id}`, JSON.stringify({
      policy,
      url,
      siteData: siteData || null,
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({ policy, id });

  } catch (error) {
    console.error('OpenAI error:', error);
    return NextResponse.json(
      { error: 'Failed to generate policy. Please try again.' },
      { status: 500 }
    );
  }
}