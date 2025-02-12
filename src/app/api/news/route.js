import { Pool } from 'pg';
import { NextResponse } from 'next/server';

// Create a new pool instance outside of the handler
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET() {
  console.log('Environment check:', {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
  });

  let client;
  try {
    // Get a client from the pool
    console.log('Acquiring client from pool...');
    client = await pool.connect();

    // ✅ FIXED: Include "Snippet" in the query so we can extract the date
    console.log('Executing bird data query...');
    const { rows } = await client.query(`
      SELECT 
        "Title", 
        "Link", 
        "Snippet" -- Added Snippet here
      FROM bird_indigenous_news
    `);

    console.log(`Successfully fetched ${rows.length} rows`);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch bird data',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    // Always release the client back to the pool
    if (client) {
      console.log('bird_indigenous_news query complete, releasing client.');
      client.release();
    }
  }
}

