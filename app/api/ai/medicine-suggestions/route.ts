import { NextRequest, NextResponse } from 'next/server';
import { aiService, AISuggestionRequest } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body: AISuggestionRequest = await request.json();
    
    // Validate required fields
    if (!body.diagnosis && (!body.symptoms || body.symptoms.length === 0)) {
      return NextResponse.json(
        { error: 'Either diagnosis or symptoms are required' },
        { status: 400 }
      );
    }

    const suggestions = await aiService.suggestMedicines(body);
    
    return NextResponse.json({
      success: true,
      suggestions,
      count: suggestions.length,
    });
  } catch (error) {
    console.error('AI medicine suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate medicine suggestions' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const diagnosis = searchParams.get('diagnosis');
    const symptoms = searchParams.get('symptoms')?.split(',');
    const category = searchParams.get('category');
    const patientAge = searchParams.get('patientAge') ? parseInt(searchParams.get('patientAge')!) : undefined;
    const patientGender = searchParams.get('patientGender');
    const existingMedications = searchParams.get('existingMedications')?.split(',');
    const allergies = searchParams.get('allergies')?.split(',');

    const aiRequest: AISuggestionRequest = {
      diagnosis: diagnosis || undefined,
      symptoms: symptoms?.filter(s => s.trim()) || undefined,
      category: category || undefined,
      patientAge,
      patientGender: patientGender || undefined,
      existingMedications: existingMedications?.filter(m => m.trim()) || undefined,
      allergies: allergies?.filter(a => a.trim()) || undefined,
    };

    if (!aiRequest.diagnosis && (!aiRequest.symptoms || aiRequest.symptoms.length === 0)) {
      return NextResponse.json(
        { error: 'Either diagnosis or symptoms are required' },
        { status: 400 }
      );
    }

    const suggestions = await aiService.suggestMedicines(aiRequest);
    
    return NextResponse.json({
      success: true,
      suggestions,
      count: suggestions.length,
    });
  } catch (error) {
    console.error('AI medicine suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate medicine suggestions' },
      { status: 500 }
    );
  }
}
