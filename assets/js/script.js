const apiKey = "8f77ba1c7ff7478ebe5563282099b654";
const apiBase = "https://api.spoonacular.com/recipes";

async function fetchRecipes(cuisine) {
    const response = await fetch(
      `${apiBase}/complexSearch?cuisine=${cuisine}&apiKey=${apiKey}`
    );
    const data = await response.json();
    return data.results;
  }
  