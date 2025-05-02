import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Get the code from the URL
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    // Redirect to sign-in page if no code is provided
    return NextResponse.redirect(new URL('/signin?error=missing_code', req.url));
  }
  
  try {
    // Exchange the code for tokens with backend
    const backendUrl = 'http://localhost:8000/api/auth/google/callback/';
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code,
        redirect_uri: 'http://localhost:3000/api/auth/google/callback'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Authentication failed');
    }

    const authData = await response.json();
    
    // Create landing page URL with tokens
    const redirectUrl = new URL('/', req.url);
    
    // Add tokens and user info to URL
    redirectUrl.searchParams.set('access_token', authData.access);
    redirectUrl.searchParams.set('id_token', authData.refresh || '');
    redirectUrl.searchParams.set('email', authData.user?.email || '');
    redirectUrl.searchParams.set('name', `${authData.user?.first_name || ''} ${authData.user?.last_name || ''}`.trim());
    redirectUrl.searchParams.set('authenticated', 'true');
    
    // Redirect to landing page with auth info
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Google auth error:', error);
    
    // Redirect to sign-in page with error
    const redirectUrl = new URL('/signin', req.url);
    redirectUrl.searchParams.set('error', 'google_auth_failed');
    
    return NextResponse.redirect(redirectUrl);
  }
} 