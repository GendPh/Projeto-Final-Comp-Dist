


// Storage inf the recipes fetched from the API to not run over and over and waste calls
const first10Recipes = [
  {
    id: 715415,
    title: 'Red Lentil Soup with Chicken and Turnips',
    image: 'https://img.spoonacular.com/recipes/715415-312x231.jpg',
    imageType: 'jpg'
  },
  {
    id: 716406,
    title: 'Asparagus and Pea Soup: Real Convenience Food',
    image: 'https://img.spoonacular.com/recipes/716406-312x231.jpg',
    imageType: 'jpg'
  },
  {
    id: 644387,
    title: 'Garlicky Kale',
    image: 'https://img.spoonacular.com/recipes/644387-312x231.jpg',
    imageType: 'jpg'
  },
  {
    id: 715446,
    title: 'Slow Cooker Beef Stew',
    image: 'https://img.spoonacular.com/recipes/715446-312x231.jpg',
    imageType: 'jpg'
  },
  {
    id: 782601,
    title: 'Red Kidney Bean Jambalaya',
    image: 'https://img.spoonacular.com/recipes/782601-312x231.jpg',
    imageType: 'jpg'
  },
  {
    id: 716426,
    title: 'Cauliflower, Brown Rice, and Vegetable Fried Rice',
    image: 'https://img.spoonacular.com/recipes/716426-312x231.jpg',
    imageType: 'jpg'
  },
  {
    id: 716004,
    title: 'Quinoa and Chickpea Salad with Sun-Dried Tomatoes and Dried Cherries',
    image: 'https://img.spoonacular.com/recipes/716004-312x231.jpg',
    imageType: 'jpg'
  },
  {
    id: 716627,
    title: 'Easy Homemade Rice and Beans',
    image: 'https://img.spoonacular.com/recipes/716627-312x231.jpg',
    imageType: 'jpg'
  },
  {
    id: 664147,
    title: 'Tuscan White Bean Soup with Olive Oil and Rosemary',
    image: 'https://img.spoonacular.com/recipes/664147-312x231.jpg',
    imageType: 'jpg'
  },
  {
    id: 640941,
    title: 'Crunchy Brussels Sprouts Side Dish',
    image: 'https://img.spoonacular.com/recipes/640941-312x231.jpg',
    imageType: 'jpg'
  }
];


export const RecipeElement = (recipe) => {
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


const window = globalThis;

/* 
Load the recipes from the storage and display them on the page
*/
window.onload = async () => {
  // Get the recipes container
  const recipesContainer = document.getElementById("recipes-container");
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.classList.add("hidden");
    // Toggle the hidden class to show the recipes container
    recipesContainer.classList.replace("hidden", "grid");

    first10Recipes.forEach(recipe => {
      recipesContainer.innerHTML += RecipeElement(recipe);
    });
  }, 2000);
};
