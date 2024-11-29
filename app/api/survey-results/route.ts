import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const surveyResult = await request.json();

    // TODO: 여기에 데이터베이스 저장 로직 추가
    // 예: await db.surveyResults.create({ data: surveyResult });

    console.log('Survey result received:', surveyResult);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save survey result:', error);
    return NextResponse.json(
      { error: 'Failed to save survey result' },
      { status: 500 }
    );
  }
} 