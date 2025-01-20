export async function sendMessage(content: string): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://zmusic-pal-back.zeabur.app';

  try {
    const response = await fetch(`${apiUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${errorText}`);
    }

    const data = await response.json();
    if (typeof data.response !== 'string') {
      throw new Error(`Invalid response format from API: ${JSON.stringify(data)}`);
    }

    return data.response;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(`Unable to connect to the server (${apiUrl}). Please check your network connection or server status.`);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error occurred: ${JSON.stringify(error)}`);
  }
}

