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

// Fetch the nutrition of each ingredient 
async function FetchNutrition(name) {
  // Validate the input to ensure it is a non-empty string
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    console.error("Invalid ingredient name provided");
    return { error: "Invalid ingredient name" };
  }

  const edamamAppId = process.env.EDAMAM_APP_ID;
  const edamamAppKey = process.env.EDAMAM_APP_KEY;

  // Validate environment variables to ensure required API credentials are set
  if (!edamamAppId || !edamamAppKey) {
    console.error("Edamam API credentials are missing");
    return { error: "Missing Edamam API credentials" };
  }

  // Encode the ingredient name to ensure it is URL-safe
  const encodedName = encodeURIComponent(name.trim());
  const url = `https://api.edamam.com/api/nutrition-data?app_id=${edamamAppId}&app_key=${edamamAppKey}&ingr=${encodedName}`;

  try {
    // Make the API call with a timeout for better control over long requests
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    const response = await fetch(url, { signal: controller.signal });

    // Clear the timeout after the request completes
    clearTimeout(timeout);

    // Check if the response status is OK (200–299)
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}: ${response.statusText}`);
      return { error: `API error: ${response.status} - ${response.statusText}` };
    }

    // Parse the response and validate the data format
    const data = await response.json();

    if (!data || typeof data !== "object" || data.calories === undefined) {
      console.error("Unexpected API response format");
      return { error: "Invalid API response format" };
    }

    return { calories: data.calories };
  } catch (error) {
    // Handle specific error scenarios
    if (error.name === "AbortError") {
      console.error("Request timed out");
      return { error: "Request timed out" };
    }

    if (!navigator.onLine) {
      console.error("No internet connection");
      return { error: "No internet connection" };
    }

    // Log unexpected errors for debugging
    console.error("An unexpected error occurred:", error.message);
    return { error: error.message || "An unexpected error occurred" };
  }
}

// Export the FetchRecipes function
export { FetchRecipes, FetchNutrition };