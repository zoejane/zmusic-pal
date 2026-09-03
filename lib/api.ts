import { getAiApiUrl, isAiPalEnabled } from "@/lib/ai"

export async function sendMessage(content: string): Promise<string> {
  if (!isAiPalEnabled()) {
    throw new Error("AI Pal is disabled on this static site. A FastAPI backend is required.")
  }

  const apiUrl = getAiApiUrl()
  if (!apiUrl) {
    throw new Error("AI Pal is enabled but NEXT_PUBLIC_API_URL is not set.")
  }

  try {
    const response = await fetch(`${apiUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${errorText}`)
    }

    const data = await response.json()
    if (typeof data.response !== "string") {
      throw new Error(`Invalid response format from API: ${JSON.stringify(data)}`)
    }

    return data.response
  } catch (error) {
    console.error("Error in sendMessage:", error)
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(`Unable to connect to the server (${apiUrl}). Please check your network connection or server status.`)
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Unknown error occurred: ${JSON.stringify(error)}`)
  }
}
