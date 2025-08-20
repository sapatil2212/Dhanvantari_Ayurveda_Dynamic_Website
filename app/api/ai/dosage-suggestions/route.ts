import { NextRequest, NextResponse } from 'next/server';
import { aiService, AISuggestionRequest } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { medicineName, ...patientInfo } = body;
    
    if (!medicineName) {
      return NextResponse.json(
        { error: 'Medicine name is required' },
        { status: 400 }
      );
    }

    const request: AISuggestionRequest = {
      ...patientInfo,
      medicineName,
    };

    const suggestions = await aiService.suggestDosage(medicineName, request);
    
    return NextResponse.json({
      success: true,
      suggestions,
      count: suggestions.length,
    });
  } catch (error) {
    console.error('AI dosage suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate dosage suggestions' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const medicineName = searchParams.get('medicineName');
    const patientAge = searchParams.get('patientAge') ? parseInt(searchParams.get('patientAge')!) : undefined;
    const patientGender = searchParams.get('patientGender');
    const existingMedications = searchParams.get('existingMedications')?.split(',');
    const allergies = searchParams.get('allergies')?.split(',');

    if (!medicineName) {
      return NextResponse.json(
        { error: 'Medicine name is required' },
        { status: 400 }
      );
    }

    const request: AISuggestionRequest = {
      medicineName,
      patientAge,
      patientGender: patientGender || undefined,
      existingMedications: existingMedications?.filter(m => m.trim()) || undefined,
      allergies: allergies?.filter(a => a.trim()) || undefined,
    };

    const suggestions = await aiService.suggestDosage(medicineName, request);
    
    return NextResponse.json({
      success: true,
      suggestions,
      count: suggestions.length,
    });
  } catch (error) {
    console.error('AI dosage suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate dosage suggestions' },
      { status: 500 }
    );
  }
}
