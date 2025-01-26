import { spoonacularApiConfig } from "./envConfig.js";
import { RecipeElement } from "./LocalStorageRecipes.js";

async function FetchRecipes() {
  // Create an AbortController instance to abort the fetch request if it takes too long
  const controller = new AbortController();
  // Timeout of 5 seconds
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    // Fetch the recipes from the Spoonacular API
    const response = await fetch(`${spoonacularApiConfig.url}?apiKey=${spoonacularApiConfig.apiKey}&number=10&offset=0`, { signal: controller.signal });

    // Clear the timeout when the fetch request is complete
    clearTimeout(timeout);

    // Check if the response is successful
    if (!response.ok) {
      // Get the error message from the response
      const error = await response.json();
      // Check if the error is due to an invalid or missing API key
      if (response.status === 401 || response.status === 403) {
        return { error: "Invalid or missing API key" };
      }
      // Check if the error is due to rate limiting
      if (response.status === 429) {
        return { error: "Rate limit exceeded. Please try again later." };
      }
      // Return the error message
      return { error: error.message || `HTTP error ${response.status}: ${response.statusText}` };
    }

    // Parse the response as JSON data
    const data = await response.json();

    // Check if the data is valid
    if (!data || !Array.isArray(data.results)) {
      return { error: "Invalid or missing data in the response" };
    }

    // Check if the data contains any recipes or not
    if (!data.results.length) {
      return { error: "No recipes found" };
    }

    // Return the recipes data
    return { results: data.results };

  } catch (error) {
    // Clear the timeout when an error occurs
    clearTimeout(timeout);

    // Check if the fetch request was aborted
    if (error.name === "AbortError") {
      return { error: "Request timed out" };
    }

    // Check if there is no internet connection
    if (!navigator.onLine) {
      return { error: "No internet connection" };
    }

    // Return the error message
    return { error: error.message || "An unexpected error occurred" };
  }
}




const loaderContainer = document.getElementById('loader');
const recipesContainer = document.getElementById('recipes-container');
const failedContainer = document.getElementById('failed');

window.onload = async () => {
  const recipes = await FetchRecipes();

  if (recipes.results) {
    console.log("Recipes: ", recipes.results);
    // Handle the results here
  } else if (recipes.error) {
    console.log("Error: ", recipes.error);
    // Handle the error here
  }
}
