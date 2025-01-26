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
/* 
// Import the dotenv package
import dotenv from 'dotenv';

// Load the .env file
dotenv.config();

// Spoonacular API configuration object
const spoonacularApiConfig = {
  url: process.env.SPOONACULAR_URL,
  apiKey: process.env.SPOONACULAR_KEY,
};

console.log('Loaded Spoonacular Config:', spoonacularApiConfig);

// Edamam API configuration object
const edamamApiConfig = {
  url: process.env.EDAMAM_APP_URL + "app_id=" + process.env.EDAMAM_APP_ID + "&app_key=" + process.env.EDAMAM_APP_KEY,
};

// Supabase API configuration object
const supabaseConfig = {
  url: process.env.SUPABASE_URL,
  apiKey: process.env.SUPABASE_ANON_KEY,
};

// console.log(spoonacularApiConfig, edamamApiConfig, supabaseConfig);

export { spoonacularApiConfig, edamamApiConfig, supabaseConfig };
 */


// env.js
import { config } from 'dotenv';
config();  // Carrega as variáveis do arquivo .env

// Expondo as variáveis para o front-end
window.env = {
  SPOONACULAR_URL: process.env.SPOONACULAR_URL,
  SPOONACULAR_KEY: process.env.SPOONACULAR_KEY,
  EDAMAM_APP_URL: process.env.EDAMAM_APP_URL,
  EDAMAM_APP_ID: process.env.EDAMAM_APP_ID,
  EDAMAM_APP_KEY: process.env.EDAMAM_APP_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
};