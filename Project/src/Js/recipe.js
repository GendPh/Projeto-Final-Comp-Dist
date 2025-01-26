// When window loads fetch the recipe information
window.onload = async () => {

  // local data
  /* const recipe = {
    "title": "Easy Homemade Rice and Beans",
    "image": "https://img.spoonacular.com/recipes/716627-556x370.jpg",
    "desc": "Easy Homemade Rice and Beans is a main course that serves 2. One serving contains <b>446 calories</b>, <b>19g of protein</b>, and <b>4g of fat</b>. For <b>$1.06 per serving</b>, this recipe <b>covers 26%</b> of your daily requirements of vitamins and minerals. A mixture of optional: of hot sauce, canned tomatoes, water, and a handful of other ingredients are all it takes to make this recipe so yummy. This recipe from cooking2perfection.blogspot.com has 471 fans. It is a good option if you're following a <b>gluten free, dairy free, lacto ovo vegetarian, and vegan</b> diet. From preparation to the plate, this recipe takes around <b>35 minutes</b>. Overall, this recipe earns a <b>tremendous spoonacular score of 98%</b>. <a href=\"https://spoonacular.com/recipes/easy-homemade-rice-and-beans-1311839\">Easy Homemade Rice and Beans</a>, <a href=\"https://spoonacular.com/recipes/easy-homemade-rice-and-beans-1303021\">Easy Homemade Rice and Beans</a>, and <a href=\"https://spoonacular.com/recipes/easy-homemade-rice-and-beans-1230117\">Easy Homemade Rice and Beans</a> are very similar to this recipe.",
    "ingredients": [
      {
        "name": "black beans",
        "amount": 15,
        "unit": "ounce",
        "calories": 1450
      },
      {
        "name": "canned tomatoes",
        "amount": 10,
        "unit": "ounce",
        "calories": 45
      },
      {
        "name": "chili powder",
        "amount": 2,
        "unit": "tsp",
        "calories": 15
      },
      {
        "name": "cumin",
        "amount": 0.5,
        "unit": "tsp",
        "calories": 3
      },
      {
        "name": "ground pepper",
        "amount": 0.25,
        "unit": "tsp",
        "calories": 1
      },
      {
        "name": "optional: of hot sauce",
        "amount": 4,
        "unit": "dashes",
        "calories": 0
      },
      {
        "name": "olive oil",
        "amount": 1,
        "unit": "tsp",
        "calories": 39
      },
      {
        "name": "onion",
        "amount": 0.25,
        "unit": "cup",
        "calories": 16
      },
      {
        "name": "rice",
        "amount": 0.5,
        "unit": "cup",
        "calories": 351
      },
      {
        "name": "water",
        "amount": 3,
        "unit": "Tbsp",
        "calories": 0
      }
    ],
    "total": 1920
  } */

  //Recipe information
  const recipe = await FetchRecipe();

  console.log(recipe);

  // If no error shows the recipe container other wise shows a failed container with message
  if (!recipe.error) {
    ShowRecipe(recipe)
  } else {
    ShowFailed(recipe.error)
  }
}

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
