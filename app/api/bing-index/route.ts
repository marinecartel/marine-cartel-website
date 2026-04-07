import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { urls } = body;

    const BING_API_KEY = "2d9d2c7ec8a346f6b41104a608a1c2c3"; // Apni key yahan check karke dalein
    const HOST = "www.marinecartel.store";

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ success: false, error: "Invalid URLs array" }, { status: 400 });
    }

    const response = await fetch('https://www.bing.com/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: HOST,
        key: BING_API_KEY,
        keyLocation: `https://${HOST}/${BING_API_KEY}.txt`,
        urlList: urls,
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Bing IndexNow Success" });
    } else {
      return NextResponse.json({ success: false, status: response.status }, { status: response.status });
    }
  } catch (error) {
    console.error("Bing Index Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}