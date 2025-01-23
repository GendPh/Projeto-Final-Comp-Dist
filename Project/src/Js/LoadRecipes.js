

async function FetchRecipes() {
  try {
    const response = await fetch(`${urlRecipeUnique}?apiKey=${recipeKeyUnique}&number=10&offset=0`);
    const data = await response.json();

    if (response.status !== 200) {
      console.log("Error: ", data.message);
      return { results: [], offset: 0, number: 0, totalResults: 0 }; // Return a default value in case of error
    }

    console.log(data);

    return data.results;

  } catch (error) {
    console.log(error);
    return { results: [], offset: 0, number: 0, totalResults: 0 }; // Return a default value in case of error
  }
}