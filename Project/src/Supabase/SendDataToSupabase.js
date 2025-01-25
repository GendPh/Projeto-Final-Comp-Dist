// Supabase API configuration object
import { supabase } from './supabase_config.js';

// Function to check the ProjetoCompDist table in the Supabase database
const checkTable = async () => {
  // Try to get the data from the ProjetoCompDist table
  try {
    // Get the data from the ProjetoCompDist table using the Supabase client 
    // and the select method with the "*" parameter to get all the columns of the table
    // The data and error variables are destructured from the response object
    let { data, error } = await supabase.from("ProjetoCompDist").select("*");
    // Check if there is an error in the response object 
    if (error) {
      // Log the error
      console.log("failed: ", error);
    } else {
      // Log the data
      console.log(data);
    }
  }
  // Catch any errors that occur in the try block
  catch (error) {
    // Log the error
    console.error(`Try catch error: ${error}`);
  }
};

// Call the checkTable function
checkTable();