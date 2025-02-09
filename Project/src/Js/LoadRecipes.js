// This file is responsible for fetching recipes from the API and displaying them on the page using JavaScript.
// The FetchRecipes function is called when the page loads to retrieve recipes from the API.
// If the request is successful, the recipes are displayed on the page. If there is an error, an error message is displayed instead.

// Selectors for DOM elements related to the loader, recipes, and error container
const loaderContainer = document.getElementById('loader'); // Loader displayed while recipes are being loaded
const recipesContainer = document.getElementById('recipes-container'); // Container where recipes will be displayed
const recipesElement = document.getElementById('recipes'); // Element that contains the recipes
const failedContainer = document.getElementById('failed'); // Container to display error messages

/**
 * Function to generate the HTML for a single recipe element
 * @param {Object} recipe - Object containing recipe data (id, title, image)
 * @returns {string} - HTML string for displaying a recipe
 */
const RecipeElement = (recipe) => {
  return `
    <div class="border border-gray-300 p-5 rounded-lg shadow-md animate__animated animate__fadeIn text-balance flex flex-col justify-between gap-y-1">
      <h2 class="text-xl font-bold text-center">${recipe.title}</h2>
      <img src="${recipe.image}" alt="recipe ${recipe.title}" class="rounded-md min-h-[200px]" >
      <a href="recipe.html?id=${recipe.id}" class="block" target="_self" rel="noopener noreferrer" aria-label="View recipe ${recipe.id}" title="View recipe ${recipe.id}"> 
        <button
          class="cursor-pointer w-full p-1 bg-amber-700 hover:bg-amber-600 transition-colors duration-300 text-white font-bold text-xl rounded-md">View</button>
      </a>
    </div>
  `;
};

/**
 * Function to display recipes in the recipes container
 * @param {Array} recipes - Array containing recipes returned by the API
 */
function ShowRecipes(recipes) {
  // Hide the loader after recipes are loaded
  loaderContainer.classList.add("hidden");
  // Show the recipes container
  recipesContainer.classList.replace("hidden", "block");
  // Clear current recipe content
  recipesElement.innerHTML = "";
  // Add each recipe to the container
  recipes.forEach(recipe => {
    recipesElement.innerHTML += RecipeElement(recipe);
  });
}

/**
 * Function to display error messages in case of failures
 * @param {string} message - The error message to display
 */
function ShowFailed(message) {
  const failedSpan = document.getElementById('error-message');

  // Hide the loader
  loaderContainer.classList.add("hidden");
  // Show the error container
  failedContainer.classList.replace("hidden", "block");
  // Set the error message
  failedSpan.textContent = message;
}

/**
 * Function to fetch recipes from the custom API
 * @returns {Object} - Contains recipes or an error message
 */
async function FetchRecipes() {
  try {
    // Make a request to the local server managing the recipes
    const response = await fetch('http://localhost:4000/api/recipes');
    // Parse the response as JSON
    const data = await response.json();
    return data;
  } catch (error) {
    // Return an error object in case of failure
    return { error: error.message };
  }
}

/* Example recipe structure for local testing
let recipes = [
  { id: 715415, title: "Red Lentil Soup with Chicken and Turnips", image: "https://img.spoonacular.com/recipes/715415-312x231.jpg" },
  { id: 716406, title: "Asparagus and Pea Soup: Real Convenience Food", image: "https://img.spoonacular.com/recipes/716406-312x231.jpg" },
  ...
];
*/

// Variable to store recipes returned by the API
let recipes = [];

/**
 * Event listener for page load to fetch and display recipes
 */
window.onload = async () => {
  // Fetch recipes from the API
  const { results, error } = await FetchRecipes();

  if (!error) {
    // Store the fetched recipes
    recipes = results;
    // Display recipes on the page
    ShowRecipes(recipes);
  } else {
    // Display an error message if the request fails
    ShowFailed(error);
  }
};

// Reference to the search input field for recipes
const searchInput = document.getElementById('search-recipe');

/**
 * Function to search for recipes based on user input
 * @param {Event} event - Form submission event
 */
function searchRecipe(event) {
  event.preventDefault(); // Prevent the default form submission behavior
  const searchValue = searchInput.value.trim().toLowerCase(); // Normalize the search input

  // If the search field is empty, display all recipes
  if (searchValue === "") {
    ShowRecipes(recipes);
    return;
  }

  // Filter recipes based on the search input
  const filteredRecipes = recipes.filter(recipe => {
    const searchParts = searchValue.split(/\s+/); // Split input into words
    const title = recipe.title.toLowerCase(); // Normalize the title for comparison
    return searchParts.every(part => title.includes(part)); // Ensure all words are in the title
  });

  // Display filtered recipes or show a message if no matches are found
  if (filteredRecipes.length !== 0) {
    ShowRecipes(filteredRecipes);
  } else {
    recipesElement.innerHTML = "<p>No recipes found</p>";
  }
}

