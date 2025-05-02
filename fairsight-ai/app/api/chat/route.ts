import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    
    // Forward the request to LM Studio
    const response = await fetch('http://127.0.0.1:1234/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    // Get the response from LM Studio
    const data = await response.json();
    
    // Return the response to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request to LM Studio:', error);
    return NextResponse.json(
      { error: 'Failed to connect to LM Studio server' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 