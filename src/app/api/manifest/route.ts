import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    const manifestData = fs.readFileSync(manifestPath, 'utf-8');
    
    return new NextResponse(manifestData, {
      status: 200,
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error loading manifest:', error);
    return NextResponse.json(
      { error: 'Manifest not found' },
      { status: 404 }
    );
  }
}

