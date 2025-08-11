import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Save typing history entry
export async function POST(request: NextRequest) {
  try {
    const { fieldType, value, userId } = await request.json();

    if (!fieldType || !value) {
      return NextResponse.json(
        { error: 'Field type and value are required' },
        { status: 400 }
      );
    }

    // Try to find existing entry and increment frequency
    const existingEntry = await prisma.typingHistory.findUnique({
      where: {
        fieldType_value_userId: {
          fieldType,
          value: value.trim(),
          userId: userId || null,
        },
      },
    });

    if (existingEntry) {
      // Update frequency
      await prisma.typingHistory.update({
        where: { id: existingEntry.id },
        data: { 
          frequency: existingEntry.frequency + 1,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new entry
      await prisma.typingHistory.create({
        data: {
          fieldType,
          value: value.trim(),
          userId: userId || null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving typing history:', error);
    return NextResponse.json(
      { error: 'Failed to save typing history' },
      { status: 500 }
    );
  }
}

// Get typing suggestions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fieldType = searchParams.get('fieldType');
    const query = searchParams.get('query');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!fieldType || !query) {
      return NextResponse.json(
        { error: 'Field type and query are required' },
        { status: 400 }
      );
    }

    // Get suggestions that match the query
    const suggestions = await prisma.typingHistory.findMany({
      where: {
        fieldType,
        value: {
          contains: query,
        },
        ...(userId && { userId }),
      },
      orderBy: [
        { frequency: 'desc' },
        { updatedAt: 'desc' },
      ],
      take: limit,
      select: {
        value: true,
        frequency: true,
      },
    });

    // Also get global suggestions (without userId) if we're searching with a userId
    let globalSuggestions: any[] = [];
    if (userId) {
      globalSuggestions = await prisma.typingHistory.findMany({
        where: {
          fieldType,
          value: {
            contains: query,
          },
          userId: null, // Global suggestions
        },
        orderBy: [
          { frequency: 'desc' },
          { updatedAt: 'desc' },
        ],
        take: Math.floor(limit / 2),
        select: {
          value: true,
          frequency: true,
        },
      });
    }

    // Combine and deduplicate suggestions
    const allSuggestions = [...suggestions, ...globalSuggestions];
    const uniqueSuggestions = allSuggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.value === suggestion.value)
      )
      .slice(0, limit);

    return NextResponse.json({ suggestions: uniqueSuggestions });
  } catch (error) {
    console.error('Error getting typing suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to get typing suggestions' },
      { status: 500 }
    );
  }
}
