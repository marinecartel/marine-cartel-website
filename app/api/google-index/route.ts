export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js'
import { google } from 'googleapis'
import { NextResponse } from 'next/server'

// 1. Supabase Admin Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 2. Google Auth Setup
const SCOPES = ['https://www.googleapis.com/auth/indexing'];

const jwtClient = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

export async function POST() {
  try {
    // Database mathi unindexed products fetch karo
    const { data: products, error } = await supabase
      .from('products')
      .select('id, slug')
      .eq('is_indexed', false)
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ message: "No pending products found", processed: 0 })
    }

    await jwtClient.authorize()
    const results = []
    let quotaHit = false

    for (const product of products) {
      if (!product.slug) continue

      // Fakht official primary canonical URL use karo
      const targetUrl = `https://themarinecartel.com/products/${product.slug}`

      try {
        await google.indexing('v3').urlNotifications.publish({
          auth: jwtClient,
          requestBody: {
            url: targetUrl,
            type: 'URL_UPDATED'
          }
        })

        // Success thay etle tarat database ma update kari do
        await supabase
          .from('products')
          .update({ is_indexed: true, last_indexed_at: new Date().toISOString() })
          .eq('id', product.id)

        results.push(product.id)
      } catch (e: any) {
        console.error(`Error indexing ${targetUrl}:`, e.message)
        
        // Jo quota exceed thay to aagal loop na chalaavo
        if (e.message?.includes('Quota exceeded') || e.code === 429) {
          quotaHit = true
          break
        }
      }
    }

    if (quotaHit) {
      return NextResponse.json({
        message: `Google Daily Quota Reached! Successfully processed ${results.length} items before limit.`,
        processed: results.length,
        quotaExceeded: true
      })
    }

    return NextResponse.json({ 
      message: "Sync Successful", 
      processed: results.length 
    })

  } catch (error: any) {
    console.error("Critical Google Index Route Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}