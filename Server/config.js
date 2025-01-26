// Export the configuration object based on the NODE_ENV
import express from 'express';
// Import the dotenv module
import dotenv from 'dotenv';
// Import CORS module
import cors from 'cors';

// Import the FetchRecipes function
import { FetchRecipes, FetchNutrition } from './Recipes.js';

// Import Supabase createClient module
import { createClient } from '@supabase/supabase-js';

// Load the environment variables
dotenv.config();

// Create an express application
const app = express();

const port = process.env.SERVER_PORT || 4000;

// Enable CORS
app.use(cors({
  // Allow requests from the specified origin only (frontend application)
  origin: '*'
}));

app.use(express.json());

// Endpoint to fetch a list of recipes
app.get('/api/recipes', async (req, res) => {
  const spoonacularUrl = process.env.SPOONACULAR_URL; // Get the base URL for Spoonacular API from environment variables
  const spoonacularKey = process.env.SPOONACULAR_KEY; // Get the Spoonacular API key from environment variables

  // Validate that the Spoonacular URL and API key are provided
  if (!spoonacularUrl || !spoonacularKey) {
    return res.status(500).json({ error: 'Spoonacular URL or API key is missing' }); // Return a 500 response if critical configuration is missing
  }

  try {
    // Call the FetchRecipes function to get the recipes from the Spoonacular API
    const result = await FetchRecipes(spoonacularUrl, spoonacularKey);

    // Check if the FetchRecipes function encountered an error
    if (result.error) {
      return res.status(500).json({ error: result.error }); // Return a 500 response with the specific error message
    }

    // If successful, send the recipe data as a JSON response
    return res.json(result);
  } catch (error) {
    // Handle unexpected errors such as network issues or invalid responses
    console.error("Error fetching recipes:", error.message); // Log the error for debugging purposes
    res.status(500).json({ error: `An unexpected error occurred: ${error.message}` }); // Return a 500 response with the error message
  }
});

// Endpoint to fetch a recipe and its nutritional details
app.get('/api/recipe/:id', async (req, res) => {
  const { id } = req.params; // Extract the recipe ID from the URL route parameter
  const spoonacularKey = process.env.SPOONACULAR_KEY; // Get the Spoonacular API key from environment variables

  // Validate that the recipe ID and API key are provided
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing recipe ID" });
  }
  if (!spoonacularKey) {
    return res.status(500).json({ error: "Missing Spoonacular API key" });
  }

  try {
    // Construct the Spoonacular API URL using the recipe ID and API key
    const spoonacularUrl = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${spoonacularKey}`;

    // Fetch the recipe information from the Spoonacular API
    const recipeResponse = await fetch(spoonacularUrl);

    // Check if the API request was successful
    if (!recipeResponse.ok) {
      return res.status(recipeResponse.status).json({
        error: `Failed to fetch recipe: ${recipeResponse.statusText}`
      });
    }

    // Parse the API response as JSON
    const recipeData = await recipeResponse.json();

    // Validate the structure of the response
    if (!recipeData || !recipeData.extendedIngredients) {
      return res.status(500).json({ error: "Invalid response from Spoonacular API" });
    }

    const ingredients = recipeData.extendedIngredients; // Extract the ingredients array from the API response
    let totalCalories = 0; // Initialize a counter for total calories

    // Create an array of promises to fetch nutritional data for each ingredient
    const ingredientPromises = ingredients.map(async (ingredient) => {
      const ingredientName = `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`; // Construct the ingredient description

      // Fetch nutritional information for the ingredient
      const nutritionData = await FetchNutrition(ingredientName);

      // Check for errors in the nutritional data and handle accordingly
      const ingredientCalories = nutritionData.error ? 0 : nutritionData.calories;

      totalCalories += ingredientCalories; // Accumulate the calories for the recipe

      // Return the formatted ingredient object
      return {
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        calories: ingredientCalories,
      };
    });

    // Wait for all ingredient promises to resolve
    const reciteIngredients = await Promise.all(ingredientPromises);

    // Construct the final response object with all recipe details
    const finalObject = {
      title: recipeData.title, // Recipe title
      image: recipeData.image, // Recipe image URL
      desc: recipeData.summary, // Recipe description/summary
      ingredients: reciteIngredients, // Processed ingredients with nutritional data
      total: totalCalories, // Total calories for the recipe
    };

    // Return the final recipe object as the API response
    res.json(finalObject);
  } catch (error) {
    // Handle unexpected errors such as network issues, API failures, or invalid responses
    console.error("Error fetching recipe:", error.message); // Log the error for debugging
    res.status(500).json({ error: `An error occurred: ${error.message}` }); // Return a 500 response with the error message
  }
});

// Create a Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Endpoint to handle POST requests for saving data to Supabase
app.post('/api/supabase', async (req, res) => {
  // Extract user_Ip and data from the request body
  const { user_Ip, data } = req.body;

  // Validate that user_Ip and data are present and of the correct types
  if (!user_Ip || typeof user_Ip !== 'string') {
    return res.status(400).json({ error: 'Invalid input: user_Ip is required and must be a string.' });
  }

  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid input: data is required and must be an object.' });
  }

  try {
    // Insert the provided data into the Supabase table "ProjetoCompDist"
    const { data: insertedData, error: supabaseError } = await supabase
      .from('ProjetoCompDist') // Specify the table name
      .insert([
        {
          user_ip: user_Ip, // Save the user's IP address
          user_data: data,  // Save the associated data
        },
      ])
      .select(); // Retrieve the inserted data for confirmation

    // Check for errors during the insertion process
    if (supabaseError) {
      console.error('Supabase error:', supabaseError); // Log the error for debugging
      return res.status(500).json({ error: 'Failed to save data to Supabase. Please try again later.' });
    }

    // Respond with a success message and optionally the saved data
    res.status(200).json({
      message: 'Data successfully saved to Supabase.',
      savedData: insertedData,
    });
  } catch (err) {
    // Handle unexpected errors and log them for debugging
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'An unexpected error occurred while saving data.' });
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});