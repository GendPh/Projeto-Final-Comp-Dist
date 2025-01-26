/**
 * When the window is loaded, this function fetches the user's IP,
 * retrieves the recipe information, and sends the data to Supabase.
 */
window.onload = async () => {
  try {
    // Fetch the user's IP address asynchronously
    const userIp = await getUserIp();

    // Check if the user's IP was successfully fetched
    if (!userIp) {
      return ShowFailed("Failed to retrieve user IP.");
    }

    // Fetch the recipe information asynchronously
    const recipe = await FetchRecipe();

    // Check if the recipe data was successfully fetched
    if (recipe.error) {
      return ShowFailed(`Recipe fetch failed: ${recipe.error}`);
    }

    // Attempt to save the recipe data to Supabase
    const sentDataToSupabase = await saveDataToSupabase(userIp, recipe);

    // If there was an error sending data to Supabase, show the error
    if (sentDataToSupabase.error) {
      return ShowFailed(`Failed to save data to Supabase: ${sentDataToSupabase.error}`);
    }

    // Show the recipe if no errors occurred
    ShowRecipe(recipe);
  } catch (error) {
    // Catch any unexpected errors that may have occurred
    ShowFailed(`Unexpected error: ${error.message || error}`);
  }
};


// Fetches a specific recipe by its ID, obtained from the URL query parameters.
async function FetchRecipe() {
  // Extract query parameters from the current page's URL.
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id'); // Retrieve the 'id' parameter from the query string.

  // Validate the recipe ID to ensure it is present and numeric.
  if (!recipeId || isNaN(recipeId)) {
    // Return an error if the ID is missing or not a valid number.
    return { error: "Invalid recipe ID" };
  }

  try {
    // Define the base URL for the API endpoint.
    const apiBaseUrl = "http://localhost:4000/api/recipe";

    // Perform the API request to fetch the recipe information using the recipe ID.
    const response = await fetch(`${apiBaseUrl}/${encodeURIComponent(recipeId)}`, {
      method: "GET", // HTTP GET method to retrieve data.
      headers: {
        "Content-Type": "application/json", // Indicate that the request expects a JSON response.
      },
    });

    // Check if the HTTP response status is within the success range (200–299).
    if (!response.ok) {
      // Return an error with the HTTP status code and status text if the request fails.
      return { error: `API request failed with status ${response.status}: ${response.statusText}` };
    }

    // Parse the response body as JSON data.
    const data = await response.json();

    // Validate the structure of the response to ensure it contains the expected data.
    if (!data || typeof data !== "object") {
      // Return an error if the response does not contain a valid JSON object.
      return { error: "Unexpected API response format" };
    }

    // Return the successfully fetched recipe data.
    return data;
  } catch (error) {
    // Handle errors that occur during the fetch operation.

    // Check if the error was caused by an aborted request (e.g., due to a timeout).
    if (error.name === "AbortError") {
      return { error: "Request was aborted" };
    }

    // Check if the user's browser is offline, preventing network requests.
    if (!navigator.onLine) {
      return { error: "No internet connection" };
    }

    // Return the error message for other types of exceptions.
    return { error: error.message || "An unexpected error occurred" };
  }
}

/**
 * Function to save data to the Supabase API.
 *
 * @param {string} userIp - The user's IP address to be saved.
 * @param {Object} data - The data object containing the information to save.
 * @returns {Object} - Returns the response from the API or an error object.
 */
async function saveDataToSupabase(userIp, data) {
  // Base URL for the API endpoint
  const apiUrl = "http://localhost:4000/api/supabase";

  // Validate inputs to ensure they are provided and correctly formatted
  if (!userIp || typeof userIp !== "string") {
    return { error: "Invalid user IP. It must be a non-empty string." };
  }
  if (!data || typeof data !== "object") {
    return { error: "Invalid data. It must be a non-null object." };
  }

  try {
    // Make the POST request to the API
    const response = await fetch(apiUrl, {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Indicate JSON content
      },
      body: JSON.stringify({ user_Ip: userIp, data }), // Send the payload as a JSON string
    });

    // Handle HTTP errors if the response is not in the 2xx range
    if (!response.ok) {
      let errorMessage;
      try {
        // Attempt to parse the error response as JSON
        const error = await response.json();
        errorMessage = error.error || `HTTP error ${response.status}: ${response.statusText}`;
      } catch {
        // Fallback for non-JSON error responses
        errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
      }
      return { error: errorMessage };
    }

    // Parse and return the API response
    const result = await response.json();

    // Validate the expected structure of the API response
    if (!result || typeof result !== "object") {
      return { error: "Unexpected response format from API." };
    }

    return result; // Return the parsed response
  } catch (err) {
    // Handle network or unexpected errors
    return { error: err.message || "An unexpected error occurred while saving data." };
  }
}


/**
 * Function to fetch the user's public IP address using the ipify API.
 *
 * @returns {Promise<string|null>} - Returns the user's IP address as a string, 
 *                                   or null if an error occurs.
 */
async function getUserIp() {
  try {
    const response = await fetch("https://api64.ipify.org?format=json");

    // Check if the response is successful
    if (!response.ok) {
      console.error(`Failed to fetch IP. HTTP error ${response.status}: ${response.statusText}`);
      return null; // Return null if the request fails
    }

    // Parse the JSON response
    const data = await response.json();

    // Validate the expected structure of the response
    if (!data || typeof data.ip !== "string") {
      console.error("Unexpected response format from IP API.");
      return null; // Return null if the structure is invalid
    }

    console.log(data.ip)

    return data.ip; // Return the user's IP address
  } catch (error) {
    // Handle network or unexpected errors
    console.error("Error fetching user IP:", error.message || error);
    return null; // Return null if an exception occurs
  }
}






// DOM elements for various sections of the page.
// Loader element shown while data is being fetched.
const loaderContainer = document.getElementById("loader");
// Element to display the title of the recipe.
const titleEl = document.getElementById("title");
// Container for recipe details.
const recipeContainer = document.getElementById("recipe-container");
// Image element to display the recipe's image.
const recipeImage = document.getElementById("recipe-image");
// Element for displaying the recipe description.
const recipeDesc = document.getElementById("recipe-desc");
// Table to list the ingredients of the recipe.
const reciteTableIngredients = document.getElementById("ingredients");
// Element to display the total calories of the recipe.
const totalCaloriesElement = document.getElementById("total-calories");
// Container for error messages.
const failedContainer = document.getElementById("failed");
// Element to display a specific error message.
const failedMessageEl = document.getElementById("error-message");

// Function to display the recipe details on the page.
function ShowRecipe(recipe) {

  // Hide the loader by adding the "hidden" class to its container.
  loaderContainer.classList.add("hidden");

  // Update the page title with the recipe's title.
  titleEl.textContent = "Recipe - " + recipe.title;
  titleEl.classList.remove("hidden")
  // Show the recipe container by replacing the "hidden" class with "block".
  recipeContainer.classList.replace("hidden", "block");

  // Update the recipe image source and description.
  recipeImage.src = recipe.image;
  recipeDesc.innerHTML = recipe.desc;

  // Populate the ingredients table with each ingredient as a row.
  recipe.ingredients.forEach(ingredient => {
    reciteTableIngredients.innerHTML += TableRow(ingredient);
  });

  // Display the total calories of the recipe.
  totalCaloriesElement.textContent = recipe.total + " Kcal";
}

// Helper function to generate an HTML table row for an ingredient.
function TableRow(ingredient) {
  // Returns a string of HTML representing a single table row for the ingredient.
  return `
  <tr class="border-b">
    <td class="p-1">${ingredient.amount}</td> <!-- Displays the ingredient amount -->
    <td class="p-1 border-x">${ingredient.unit}</td> <!-- Displays the unit of measurement -->
    <td class="p-1 border-r">${ingredient.name}</td> <!-- Displays the ingredient name -->
    <td class="p-1">${ingredient.calories} Kcal</td> <!-- Displays the calories for this ingredient -->
  </tr>
  `;
}

// Function to display an error message when the recipe fails to load.
function ShowFailed(message) {
  // Hide the loader by adding the "hidden" class to its container.
  loaderContainer.classList.add("hidden");

  // Show the error message container by replacing the "hidden" class with "block".
  failedContainer.classList.replace("hidden", "block");

  // Set the error message text content to the provided message.
  failedMessageEl.textContent = message;
}
