const apiKey = "8f77ba1c7ff7478ebe5563282099b654";
const apiBase = "https://api.spoonacular.com/recipes";

async function fetchRecipes(cuisine) {
  const response = await fetch(
    `${apiBase}/complexSearch?cuisine=${cuisine}&apiKey=${apiKey}`
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

// Function to add recipe to calendar
function addRecipeToCalendar(recipe) {
  $('.ui.modal')
    .modal('show')
    ;
  sundayButton = document.getElementById("sunday-btn")
  sundayButton.addEventListener("click", function () {
    const recipeDiv = document.createElement("div");
    recipeDiv.className = "recipe";
    recipeDiv.innerText = recipe.title;
    dayColumn.querySelector(".recipes").appendChild(recipeDiv);
  })

  //const selectedDay = prompt(
  //  "Enter the day (e.g., Monday) to add this recipe:"
  //);
  //if (daysOfWeek.includes(selectedDay)) {
  //  const dayColumn = Array.from(calendar.children).find(
  //    (day) => day.querySelector("h3").innerText === selectedDay
  // );
  // const recipeDiv = document.createElement("div");
  //  recipeDiv.className = "recipe";
  //  recipeDiv.innerText = recipe.title;
  //  dayColumn.querySelector(".recipes").appendChild(recipeDiv);
  //} else {
  // alert("Invalid day. Please try again.");
  //}
}
document.getElementById("foodBtn").addEventListener("click", async () => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?number=1&apiKey=${apiKey}`
    );
    const data = await response.json();

    console.log(data);

    if (data.recipes && data.recipes.length > 0) {
      const { title, image, instructions } = data.recipes[0];
      console.log(title, image, instructions);

      const card = document.createElement("div");
      card.className = "ui card";
      card.innerHTML = `
        <div class="image">
          <img src="${image}" alt="${title}" style="max-width: 100%; height: auto;">
        </div>
        <div class="content">
          <div class="header">${title}</div>
          <div class="description">
            <p>${instructions}</p>
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
