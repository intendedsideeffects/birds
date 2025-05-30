import { supabase } from '../../utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Environment check:', {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    nodeEnv: process.env.NODE_ENV,
  });

  try {
    console.log('Executing news data query...');
    const { data, error } = await supabase
      .from('bird_indigenous_news')
      .select('Title, Link, Snippet');

    if (error) throw error;

    console.log(`Successfully fetched ${data.length} rows`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Database Error:', {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch news data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

