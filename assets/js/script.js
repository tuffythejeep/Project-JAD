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
        <div class="ui form">
          <div class="field">
            <label>Select Day:</label>
            <select class="daySelect">
              <option value="">Choose...</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
        </div>
        <button class="ui button add-to-calendar">Add to Calendar</button>
      </div>
    `;
    card.querySelector(".add-to-calendar").addEventListener("click", () => addRecipeToCalendar(recipe, card));
    recipeCards.appendChild(card);
  });
}

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
let calendarData = {}; 

function initializeCalendar() {
  daysOfWeek.forEach((day) => {
    calendarData[day] = [];
    const dayColumn = document.createElement("div");
    dayColumn.className = "column";
    dayColumn.innerHTML = `<h3>${day}</h3><div class="recipes"></div>`;
    calendar.appendChild(dayColumn);
  });
  
  loadCalendarData();
}

function loadCalendarData() {
  const storedData = localStorage.getItem("calendarData");
  if (storedData) {
    calendarData = JSON.parse(storedData);
    
   
    daysOfWeek.forEach((day) => {
      const dayColumn = Array.from(calendar.children).find(
        (column) => column.querySelector("h3").textContent.trim() === day
      );
      if (dayColumn) {
        const recipes = calendarData[day];
        const recipesContainer = dayColumn.querySelector(".recipes");
        recipesContainer.innerHTML = ""; 
        
        recipes.forEach((recipeTitle) => {
          const recipeDiv = document.createElement("div");
          recipeDiv.className = "recipe";
          recipeDiv.innerText = recipeTitle;
          recipesContainer.appendChild(recipeDiv);
        });
      }
    });
  }
}
initializeCalendar();

function addRecipeToCalendar(recipe, card) {
  const daySelect = card.querySelector(".daySelect");
  const selectedDay = daySelect.value;

  if (!selectedDay) {
    console.error("No day selected.");
    return;
  }

  const dayColumn = Array.from(calendar.children).find(
    (column) => column.querySelector("h3").textContent.trim() === selectedDay
  );

  if (dayColumn) {
    const recipeDiv = document.createElement("div");
    recipeDiv.className = "recipe";
    recipeDiv.innerText = recipe.title;
    dayColumn.querySelector(".recipes").appendChild(recipeDiv);

    if (!calendarData[selectedDay]) {
      calendarData[selectedDay] = [];
    }

    if (!calendarData[selectedDay].includes(recipe.title)) {
      calendarData[selectedDay].push(recipe.title);

      localStorage.setItem("calendarData", JSON.stringify(calendarData));
    } else {
      console.log("Recipe already exists in", selectedDay);
    }
  } else {
    console.error("Day column not found for", selectedDay);
  }
}
document.querySelectorAll(".ui.menu .item").forEach((item) => {
  item.addEventListener("click", async (event) => {
    const cuisine = event.target.id;
    const recipes = await fetchRecipes(cuisine);
    displayRecipes(recipes);
  });
});
document.getElementById("foodBtn").addEventListener("click", async () => {
  try {
    const response = await fetch(
      `${spoonacularApiBase}/random?number=1&apiKey=${spoonacularApiKey}`
    );
    const data = await response.json();

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
    } else {
      console.error("No recipes found in the response.");
    }
  } catch (error) {
    console.error("Error fetching food of the day:", error);
  }
});

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
  fetch("https://v2.jokeapi.dev/joke/Pun?type=single")
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