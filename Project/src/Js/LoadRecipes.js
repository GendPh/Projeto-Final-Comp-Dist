// This file is responsible for fetching the recipes from the API and displaying them on the page using JavaScript. 
// The FetchRecipes function is called when the page loads, and it fetches the recipes from the API. 
// If the request is successful, the recipes are displayed on the page. If there is an error, an error message is displayed instead.

// Variables to store the loader, recipes container, and failed container
const loaderContainer = document.getElementById('loader');
const recipesContainer = document.getElementById('recipes-container');
const failedContainer = document.getElementById('failed');

// Function to create the recipe element
const RecipeElement = (recipe) => {
  return `
  <div class="border border-gray-300 p-5 rounded-lg shadow-md animate__animated animate__bounceIn text-balance flex flex-col justify-between gap-y-1">
    <h2 class="text-xl font-bold text-center">${recipe.title}</h2>
    <img src="${recipe.image}" alt="recipe ${recipe.title}" class="rounded-md min-h-[200px]" >
    <a href="#?id=${recipe.id}" class="block" target="_self" rel="noopener noreferrer" aria-label="View recipe ${recipe.id}" title="View recipe ${recipe.id}"> 
      <button
              class="cursor-pointer w-full p-1 bg-amber-700 hover:bg-amber-600 transition-colors duration-300 text-white font-bold text-xl rounded-md">View</button>
    </a>
  </div>
  `;
};


// Function to show the recipes
function ShowRecipes(recipes) {
  // Set a timeout of 2s to simulate loading time
  setTimeout(() => {
    // Toggle the hidden class to hide the loader
    loaderContainer.classList.add("hidden");
    // Toggle the hidden class to show the recipes container
    recipesContainer.classList.replace("hidden", "grid");
    // Loop through the recipes and add them to the recipes container
    recipes.forEach(recipe => {
      recipesContainer.innerHTML += RecipeElement(recipe);
    });
  }, 2000);
}

// Function to show the error message
function ShowFailed(message) {
  // Set a timeout of 1s to simulate loading time
  const failedSpan = document.getElementById('error-message');
  setTimeout(() => {
    // Toggle the hidden class to hide the loader
    loaderContainer.classList.add("hidden");
    // Toggle the hidden class to show the error container
    failedContainer.classList.replace("hidden", "block");
    // Set the error message
    failedSpan.textContent = message;
  }, 1000);
}

async function FetchRecipes() {
  try {
    const response = await fetch('http://server:4000/api/recipes'); //alterado de localhost para server, a fim de funcionar no ambiente docker
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// Window load event listener to fetch the recipes when the page loads and display them
window.onload = async () => {
  // Fetch the recipes from the API
  const recipes = await FetchRecipes();

  if (recipes.results) {
    ShowRecipes(recipes.results);
    // Handle the results here
  } else if (recipes.error) {
    // Handle the error here
    ShowFailed(recipes.error);
  }
}