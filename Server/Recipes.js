/**
 * Function to fetch recipes from the Spoonacular API.
 * The function handles timeouts, various error scenarios, and validates the response format.
 * @param {string} spoonacularUrl - The base URL of the Spoonacular API.
 * @param {string} spoonacularKey - The API key to authenticate the request.
 * @returns {Object} - Returns the list of recipes or an error object.
 */
async function FetchRecipes(spoonacularUrl, spoonacularKey) {
  // Create an AbortController to handle timeouts
  const controller = new AbortController();

  // Set a timeout of 5 seconds for the request
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    // Make the request to the Spoonacular API with the necessary parameters
    const response = await fetch(
      `${spoonacularUrl}?apiKey=${spoonacularKey}&number=10&offset=0`,
      { signal: controller.signal }
    );

    // Clear the timeout once the request completes or fails
    clearTimeout(timeout);

    // Check if the response is not OK (e.g., status 4xx, 5xx)
    if (!response.ok) {
      const error = await response.json();

      // Handle specific HTTP error statuses
      if (response.status === 401 || response.status === 403) {
        return { error: "Invalid or missing API key" };
      }
      if (response.status === 429) {
        return { error: "Rate limit exceeded. Please try again later." };
      }

      // Generic error handling for other HTTP statuses
      return { error: error.message || `HTTP error ${response.status}: ${response.statusText}` };
    }

    // Parse the JSON response from the API
    const data = await response.json();

    // Validate that the response contains the expected structure
    if (!data || !Array.isArray(data.results)) {
      return { error: "Invalid or missing data in the response" };
    }

    // Check if there are any recipes in the response
    if (!data.results.length) {
      return { error: "No recipes found" };
    }

    // Return the recipes if everything is fine
    return { results: data.results };

  } catch (error) {
    // Clear the timeout if the request fails
    clearTimeout(timeout);

    // Handle the specific case where the request is aborted due to timeout
    if (error.name === "AbortError") {
      return { error: "Request timed out" };
    }

    // Handle the case where there is no internet connection
    if (!navigator.onLine) {
      return { error: "No internet connection" };
    }

    // Return any other errors
    return { error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Function to fetch nutrition data for an ingredient from the Edamam API.
 * Ensures input validation, error handling, and improved response handling.
 * @param {string} name - The name of the ingredient for which nutrition data is being requested.
 * @returns {Object} - Returns an object with the calorie count or an error message.
 */
async function FetchNutrition(name) {
  // Validate the input to ensure it is a non-empty string
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    console.error("Invalid ingredient name provided");
    return { error: "Invalid ingredient name" };
  }

  const edamamAppId = process.env.EDAMAM_APP_ID;
  const edamamAppKey = process.env.EDAMAM_APP_KEY;

  // Validate environment variables to ensure the required API credentials are set
  if (!edamamAppId || !edamamAppKey) {
    console.error("Edamam API credentials are missing");
    return { error: "Missing Edamam API credentials" };
  }

  // Encode the ingredient name to ensure it is URL-safe
  const encodedName = encodeURIComponent(name.trim());
  const url = `https://api.edamam.com/api/nutrition-data?app_id=${edamamAppId}&app_key=${edamamAppKey}&ingr=${encodedName}`;

  try {
    // Create an AbortController to handle request timeouts
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Set a 5-second timeout for the request

    // Make the request to the Edamam API with the AbortController's signal
    const response = await fetch(url, { signal: controller.signal });

    // Clear the timeout once the request completes or fails
    clearTimeout(timeout);

    // Check if the response status is OK (200–299)
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}: ${response.statusText}`);
      return { error: `API error: ${response.status} - ${response.statusText}` };
    }

    // Parse the response JSON
    const data = await response.json();

    // Validate the response format
    if (!data || typeof data !== "object" || data.calories === undefined) {
      console.error("Unexpected API response format");
      return { error: "Invalid API response format" };
    }

    // Return the calories data if the response is valid
    return { calories: data.calories };

  } catch (error) {
    // Handle specific error scenarios

    // Check for timeout error
    if (error.name === "AbortError") {
      console.error("Request timed out");
      return { error: "Request timed out" };
    }

    // Check for network connectivity issues
    if (!navigator.onLine) {
      console.error("No internet connection");
      return { error: "No internet connection" };
    }

    // Log any other unexpected errors
    console.error("An unexpected error occurred:", error.message);
    return { error: error.message || "An unexpected error occurred" };
  }
}

// Export the FetchRecipes function
export { FetchRecipes, FetchNutrition };