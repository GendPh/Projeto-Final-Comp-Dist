// Function to fetch recipes from Spoonacular API
async function FetchRecipes(spoonacularUrl, spoonacularKey) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // Set a timeout for the request

  try {
    // Make the request to the Spoonacular API
    const response = await fetch(`${spoonacularUrl}?apiKey=${spoonacularKey}&number=10&offset=0`, { signal: controller.signal });

    // Clear the timeout after the request completes
    clearTimeout(timeout);

    if (!response.ok) {
      const error = await response.json();
      if (response.status === 401 || response.status === 403) {
        return { error: "Invalid or missing API key" };
      }
      if (response.status === 429) {
        return { error: "Rate limit exceeded. Please try again later." };
      }
      return { error: error.message || `HTTP error ${response.status}: ${response.statusText}` };
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.results)) {
      return { error: "Invalid or missing data in the response" };
    }

    if (!data.results.length) {
      return { error: "No recipes found" };
    }

    return { results: data.results };

  } catch (error) {
    clearTimeout(timeout);

    if (error.name === "AbortError") {
      return { error: "Request timed out" };
    }

    if (!navigator.onLine) {
      return { error: "No internet connection" };
    }

    return { error: error.message || "An unexpected error occurred" };
  }
}

// Export the FetchRecipes function
export { FetchRecipes };