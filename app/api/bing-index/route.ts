export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // 1. Database se wahi products uthayein jo index nahi hue hain
    const { data: products, error } = await supabase
      .from('products')
      .select('slug')
      .eq('is_indexed_bing', false) // Alag column rakhein taaki track rahe
      .limit(1000) // Bing ki limit badi hai, aap zyada le sakte hain

    if (error || !products || products.length === 0) {
      return NextResponse.json({ message: "No pending products for Bing", processed: 0 })
    }

    const HOST = "themarinecartel.com";
    const BING_API_KEY = process.env.BING_INDEXNOW_KEY; // Vercel Env se lein

    // 2. URLs ki list taiyar karein
    const urlList = products.map(p => `https://${HOST}/products/${p.slug}`);

    // 3. Bing IndexNow ko Bulk Request bhejein
    const bingResponse = await fetch('https://www.bing.com/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: BING_API_KEY,
        keyLocation: `https://${HOST}/${BING_API_KEY}.txt`,
        urlList: urlList,
      }),
    });

    if (bingResponse.ok) {
      // 4. Database update karein (Taaki baar baar wahi na bhejein)
      const slugs = products.map(p => p.slug);
      await supabase
        .from('products')
        .update({ is_indexed_bing: true })
        .in('slug', slugs);

      return NextResponse.json({ 
        success: true, 
        message: `${urlList.length} products sent to Bing`,
        urls: urlList 
      });
    } else {
      return NextResponse.json({ success: false, status: bingResponse.status }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}