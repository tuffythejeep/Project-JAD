const spoonacularApiKey = "8f77ba1c7ff7478ebe5563282099b654";
const spoonacularApiBase = "https://api.spoonacular.com/recipes";

async function fetchRecipes(cuisine) {
  const response = await fetch(
    `${spoonacularApiBase}/complexSearch?cuisine=${cuisine}&apiKey=${spoonacularApiKey}`
  );
  const data = await response.json();
  return data.results;
}

function displayRecipes(recipes) {
  const recipeCards = document.getElementById("recipeCards");
  recipeCards.innerHTML = "";
  recipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "ui card recipe-card";
    card.innerHTML = `
      <div class="image">
        <img src="${recipe.image}" alt="${recipe.title}">
      </div>
      <div class="content">
        <a class="header">${recipe.title}</a>
      </div>
    `;
    card.addEventListener("click", () => addRecipeToCalendar(recipe));
    recipeCards.appendChild(card);
  });
}

document.querySelectorAll(".ui.menu .item").forEach((item) => {
  item.addEventListener("click", async (event) => {
    const cuisine = event.target.id;
    const recipes = await fetchRecipes(cuisine);
    displayRecipes(recipes);
  });
});

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const calendar = document.getElementById("calendar");
daysOfWeek.forEach((day) => {
  const dayColumn = document.createElement("div");
  dayColumn.className = "column";
  dayColumn.innerHTML = `<h3>${day}</h3><div class="recipes"></div>`;
  calendar.appendChild(dayColumn);
});

function addRecipeToCalendar(recipe) {
  $(".ui.modal").modal("show");

  const dayButtons = document.querySelectorAll(".ui.modal .content button");
  dayButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const selectedDay = button.textContent.trim();

      const dayColumn = Array.from(
        document.getElementById("calendar").children
      ).find(
        (column) =>
          column.querySelector("h3").textContent.trim() === selectedDay
      );

      if (dayColumn) {
        const recipeDiv = document.createElement("div");
        recipeDiv.className = "recipe";
        recipeDiv.innerText = recipe.title;
        dayColumn.querySelector(".recipes").appendChild(recipeDiv);
      } else {
        console.error("Day column not found for", selectedDay);
      }

      $(".ui.modal").modal("hide");
    });
  });
}

document.getElementById("foodBtn").addEventListener("click", async () => {
  try {
    const response = await fetch(
      `${spoonacularApiBase}/random?number=1&apiKey=${spoonacularApiKey}`
    );
    const data = await response.json();

    console.log(data);

    if (data.recipes && data.recipes.length > 0) {
      const { title, image, instructions } = data.recipes[0];

      const card = document.createElement("div");
      card.className = "ui card";
      card.innerHTML = `
        <div class="image">
          <img src="${image}" alt="${title}" style="max-width: 100%; height: auto;">
        </div>
        <div class="content">
          <div class="header">${title}</div>
          <div class="description">
            <div>${instructions}</div>
          </div>
        </div>
      `;

      const modalContent = document.getElementById("modalContent");
      modalContent.innerHTML = "";
      modalContent.appendChild(card);

      $(".ui.modal").modal("show");
    } else {
      console.error("No recipes found in the response.");
    }
  } catch (error) {
    console.error("Error fetching food of the day:", error);
  }
});

const getJokeBtn = document.getElementById("getJokeBtn");
const jokeText = document.getElementById("jokeText");

getJokeBtn.addEventListener("click", getFoodJoke);

function getFoodJoke() {
  fetch("https://v2.jokeapi.dev/joke/Programming?type=single")
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        jokeText.textContent = "Oops! No food jokes available right now.";
      } else {
        jokeText.textContent = data.joke;
      }
    })
    .catch((error) => {
      jokeText.textContent = "Oops! Something went wrong.";
      console.error("Error fetching joke:", error);
    });
}
