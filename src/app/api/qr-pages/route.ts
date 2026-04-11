import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) slug += chars[Math.floor(Math.random() * chars.length)];
  return slug;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { category, message, sender_name, recipient_name, music_url, images, theme } = body;

    if (!category || !message) {
      return NextResponse.json({ error: 'Category and message are required' }, { status: 400 });
    }

    let slug = generateSlug();
    // Ensure uniqueness
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase.from('qr_pages').select('id').eq('slug', slug).single();
      if (!existing) break;
      slug = generateSlug();
      attempts++;
    }

    const { data, error } = await supabase.from('qr_pages').insert({
      user_id: session.user.id,
      slug,
      category,
      message,
      sender_name: sender_name || null,
      recipient_name: recipient_name || null,
      music_url: music_url || null,
      images: images || [],
      theme: theme || 'midnight',
    }).select().single();

    if (error) {
      console.error('Error creating QR page:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ page: data });
  } catch (err: any) {
    console.error('QR pages POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('qr_pages')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ pages: data });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Page ID required' }, { status: 400 });

    const { error } = await supabase
      .from('qr_pages')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
