import { NextResponse } from 'next/server';
import { syncIzmirMuseums } from '@/lib/adapters/izmirAdapter';

export async function GET() {
  try {
    const result = await syncIzmirMuseums();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Müzeler eşitlenirken bir hata oluştu.',
          count: result.count,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        count: result.count,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Sunucu tarafında beklenmeyen bir hata oluştu.';
    return NextResponse.json(
      {
        success: false,
        error: message,
        count: 0,
      },
      { status: 500 }
    );
  }
}
