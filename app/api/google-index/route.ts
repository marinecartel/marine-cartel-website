export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { google } from 'googleapis'
import { NextResponse } from 'next/server'

// 1. Supabase Admin Client (Service Role Key use karein taaki update permission mile)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

// 2. Google Auth Setup (Aapki JSON key ka data yahan aayega)
const SCOPES = ['https://www.googleapis.com/auth/indexing'];

const jwtClient = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

export async function POST() {
  try {
    // 1. Database se products nikalein (ID aur Slug dono lein)
    const { data: products, error } = await supabase
      .from('products')
      .select('id, slug') // Model ki jagah slug lein agar URL mein slug hai
      .eq('is_indexed', false)
      .limit(100) // 100 products x 2 variants = 200 daily limit

    if (error || !products || products.length === 0) {
      return NextResponse.json({ message: "No pending products found", processed: 0 })
    }

    await jwtClient.authorize()
    const results = []

    for (const product of products) {
      // Dono variants ke URLs banayein
      const url1 = `https://themarinecartel.com/products/${product.slug}`
      const url2 = `https://www.themarinecartel.com/products/${product.slug}`
      
      const targetUrls = [url1, url2]

      try {
        for (const targetUrl of targetUrls) {
          await google.indexing('v3').urlNotifications.publish({
            auth: jwtClient,
            requestBody: {
              url: targetUrl,
              type: 'URL_UPDATED'
            }
          })
        }
        
        // Dono variants submit hone ke baad hi database update karein
        await supabase
          .from('products')
          .update({ is_indexed: true, last_indexed_at: new Date().toISOString() })
          .eq('id', product.id)
          
        results.push(product.id)
      } catch (e: any) {
        console.error(`Error indexing:`, e.message)
      }
    }

    return NextResponse.json({ 
      message: "Sync Successful for both variants", 
      processed: results.length 
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}