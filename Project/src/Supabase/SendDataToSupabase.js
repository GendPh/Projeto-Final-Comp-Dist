// Supabase API configuration object
import { supabase } from './supabase_config.js';
// import { getUserIpAddress } from "../Js/GetUserIP.js";


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
//checkTable();

// Function to insert data into the ProjetoCompDist table in the Supabase database
// The data parameter is the object that will hold the user ip and json data {user_ip: data.ip, user_data: data.json}
const insertData = async (data) => {
  // const userIp = await getUserIpAddress();

  try {
    const { data, error } = await supabase
      .from('ProjetoCompDist')
      .insert([
        { user_ip: data.ip, user_data: data.json },
      ])
      .select()


    if (error) {
      console.error('Erro ao buscar dados:', error);
    } else {
      console.log('Dados enviados:', data);
    }
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
};

insertData();