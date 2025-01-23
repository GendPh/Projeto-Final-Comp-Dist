/*
  This file is used to store the configuration object that contains the environment variables from the .env file.
  The configuration object is exported to be used in the other files.

  The configuration object contains the following environment variables:
  - SPOONACULAR_URL: The base URL of the Spoonacular API.
  - SPOONACULAR_KEY: The API key of the Spoonacular API.
  - EDAMAM_APP_URL: The base URL of the Edamam API.
  - EDAMAM_APP_ID: The APP ID of the Edamam API.
  - EDAMAM_APP_KEY: The APP Key of the Edamam API.
  - SUPABASE_URL: The base URL of the Supabase API.
  - SUPABASE_ANON_KEY: The API key of the Supabase API.
*/

// Import the dotenv package to read the .env file
import dotenv from 'dotenv';
// Read the .env file
dotenv.config();

// Spoonacular API configuration object
const spoonacularApiConfig = {
  // The base URL of the Spoonacular API
  url: process.env["SPOONACULAR_URL"],
  // The API key of the Spoonacular
  apiKey: process.env["SPOONACULAR_KEY"]
}

// Edamam API configuration object
const edamamApiConfig = {
  // The base URL of the Edamam API with the APP ID and APP Key
  url: process.env["EDAMAM_APP_URL"] + "app_id=" + process.env["EDAMAM_APP_ID"] + "&app_key=" + process.env["EDAMAM_APP_KEY"],
}

// Supabase API configuration object
const supabaseConfig = {
  // The base URL of the Supabase API
  url: process.env["SUPABASE_URL"],
  // The API key of the Supabase API
  apiKey: process.env["SUPABASE_ANON_KEY"]
}

// Export the configuration object
export { spoonacularApiConfig, edamamApiConfig, supabaseConfig };