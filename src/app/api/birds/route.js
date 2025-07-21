import { supabase } from '../../utils/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  // Log the Supabase URL to the server console for debugging
  console.log('API Route is connecting to Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  const { data, error } = await supabase
    .from('bird_stories')
    .select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PUT(request) {
  try {
    const { species, story, isFuture } = await request.json();

    let updateOperation;

    if (isFuture) {
      updateOperation = supabase
        .from('future_stories')
        .update({ story })
        .eq('species', species)
        .select()
        .single();
    } else {
      updateOperation = supabase
        .from('bird_stories')
        .update({ story })
        .eq('species', species)
        .select()
        .single();
    }

    const { data, error } = await updateOperation;

    if (error) throw error;

    return NextResponse.json({ ...data, status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const { data: newRecord, error } = await supabase
      .from('bird_stories')
      .insert([{
        species: data.species,
        archip: data.archip,
        ext_date: data.ext_date,
        description: data.description,
        iucn_category_2021: data.iucn_category_2021,
        common_name: data.common_name,
        story: data.story
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newRecord);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to insert bird data' },
      { status: 500 }
    );
  }
}
