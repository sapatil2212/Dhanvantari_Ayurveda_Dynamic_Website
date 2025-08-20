import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPrescription, patientId, diagnosis } = body;
    
    if (!currentPrescription || !patientId || !diagnosis) {
      return NextResponse.json(
        { error: 'Current prescription, patient ID, and diagnosis are required' },
        { status: 400 }
      );
    }

    const optimization = await aiService.optimizePrescription(
      currentPrescription,
      patientId,
      diagnosis
    );
    
    return NextResponse.json({
      success: true,
      optimization,
      hasWarnings: optimization.warnings.length > 0,
      hasSuggestions: optimization.suggestions.length > 0,
      hasImprovements: optimization.improvements.length > 0,
      hasAlternatives: optimization.alternativeMedicines && optimization.alternativeMedicines.length > 0,
    });
  } catch (error) {
    console.error('AI prescription optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize prescription' },
      { status: 500 }
    );
  }
}
