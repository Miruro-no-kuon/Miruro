export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  if (path === '/exchange-token') {
    return handleTokenExchange(context);
  } else {
    return new Response('Not found', { status: 404 });
  }
}

async function handleTokenExchange(context) {
  const request = context.request;
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const data = await request.json();
    const code = data.code;
    if (!code) {
      return new Response('Authorization code is required', { status: 400 });
    }

    const payload = {
      client_id: context.env.VITE_CLIENT_ID,
      client_secret: context.env.VITE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: context.env.VITE_REDIRECT_URI,
    };

    const apiResponse = await fetch('https://anilist.co/api/v2/oauth/token', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity',
      },
    });

    const responseBody = await apiResponse.text();
    if (!apiResponse.ok) {
      console.error('API response error:', responseBody);
      throw new Error(`API responded with status: ${apiResponse.status}`);
    }

    const responseData = JSON.parse(responseBody);
    if (responseData.access_token) {
      return new Response(
        JSON.stringify({ accessToken: responseData.access_token }),
        {
          headers: { 'Content-Type': 'application.json' },
        },
      );
    } else {
      console.error(
        'Access token not found in the API response:',
        responseBody,
      );
      throw new Error('Access token not found in the response');
    }
  } catch (error) {
    console.error(`Error when handling token exchange: ${error}`);
    return new Response(
      JSON.stringify({
        error: 'Failed to exchange token',
        details: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application.json' },
      },
    );
  }
}
