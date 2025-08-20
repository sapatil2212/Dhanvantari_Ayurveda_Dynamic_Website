import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { medications, patientId } = body;
    
    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json(
        { error: 'Medications array is required' },
        { status: 400 }
      );
    }

    const warnings = await aiService.checkDrugInteractions(medications, patientId);
    
    return NextResponse.json({
      success: true,
      warnings,
      count: warnings.length,
      hasInteractions: warnings.length > 0,
      severityLevels: {
        low: warnings.filter(w => w.severity === 'LOW').length,
        moderate: warnings.filter(w => w.severity === 'MODERATE').length,
        high: warnings.filter(w => w.severity === 'HIGH').length,
        contraindicated: warnings.filter(w => w.severity === 'CONTRAINDICATED').length,
      },
    });
  } catch (error) {
    console.error('AI drug interactions error:', error);
    return NextResponse.json(
      { error: 'Failed to check drug interactions' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const medications = searchParams.get('medications')?.split(',');
    const patientId = searchParams.get('patientId');

    if (!medications || medications.length === 0) {
      return NextResponse.json(
        { error: 'Medications are required' },
        { status: 400 }
      );
    }

    const warnings = await aiService.checkDrugInteractions(medications, patientId || undefined);
    
    return NextResponse.json({
      success: true,
      warnings,
      count: warnings.length,
      hasInteractions: warnings.length > 0,
      severityLevels: {
        low: warnings.filter(w => w.severity === 'LOW').length,
        moderate: warnings.filter(w => w.severity === 'MODERATE').length,
        high: warnings.filter(w => w.severity === 'HIGH').length,
        contraindicated: warnings.filter(w => w.severity === 'CONTRAINDICATED').length,
      },
    });
  } catch (error) {
    console.error('AI drug interactions error:', error);
    return NextResponse.json(
      { error: 'Failed to check drug interactions' },
      { status: 500 }
    );
  }
}
