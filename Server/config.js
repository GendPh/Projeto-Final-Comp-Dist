// Export the configuration object based on the NODE_ENV
import express from 'express';
// Import the dotenv module
import dotenv from 'dotenv';
// Import CORS module
import cors from 'cors';

// Import the FetchRecipes function
import { FetchRecipes } from './Recipes.js';

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


// Endpoint to fetch recipes
app.get('/api/recipes', async (req, res) => {
  const spoonacularUrl = process.env.SPOONACULAR_URL;
  const spoonacularKey = process.env.SPOONACULAR_KEY;

  // Check if the Spoonacular URL and API key are present in the environment variables
  if (!spoonacularUrl || !spoonacularKey) {
    return res.status(500).json({ error: 'Spoonacular URL or API key is missing' });
  }

  // Call the FetchRecipes function
  const result = await FetchRecipes(spoonacularUrl, spoonacularKey);

  // Send the result back as a response
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }

  return res.json(result);
});

// Start the server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


