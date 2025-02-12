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
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(`
      SELECT 
        species,
        archip,
        ext_date as extinction_year,
        description,
        red_list_category,
        story
      FROM bird_storya 
      ORDER BY ext_date
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bird data' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function PUT(request) {
  let client;
  try {
     client = await pool.connect();
    const { species, story } = await request.json();
  

    const { rows } = await client.query(
      `
      UPDATE bird_storya
      SET story = $1
      WHERE species = $2
      RETURNING *
    `,
      [story, species]
    );

    return NextResponse.json({...rows[0], status:200});
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}

export async function POST(request) {
  let client;
  try {
    const data = await request.json();
    client = await pool.connect();

    const { rows } = await client.query(
      `
      INSERT INTO bird_storya (
        species,//necesary
        archip,
        ext_date,
        description,
        red_list_category,
        story 
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [
        data.species,
        data.archip,
        data.ext_date,
        data.description,
        data.red_list_category,
        data.story,
      ]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to insert bird data' },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}
