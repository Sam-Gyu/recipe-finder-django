
class Recipe {
    constructor(id, name, course, description, instructions, duration, rate, image) {
        this.id = id;
        this.name = name;
        this.course = course;
        this.description = description;
        this.instructions = instructions;
        this.duration = duration;
        this.rate = rate;
        this.image = image;
    }
}

class Favorite {
    constructor(userId, recipeId) {
        this.userId = userId;
        this.recipeId = recipeId;
    }
}


function SR(recipess) {
    let grid = document.querySelector(".recipe-grid");
    grid.innerHTML = "";

    recipess.forEach(recipe => {
        let card = document.createElement("div");
        card.className = "recipe-card";

        card.innerHTML = `
            <div class="favorite-heart">♥</div>
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" />
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.name}</h3>
                <div class="recipe-meta">
                    <div class="recipe-rating">${"★".repeat(Math.round(recipe.rate))}</div>
                    <div class="recipe-time">${recipe.duration}</div>
                </div>
                <button class="view-button">View Recipe</button>
            </div>
        `;

        if (favorites.find(fav => fav.recipe === recipe.id)) {
            card.querySelector(".favorite-heart").style.color = "red";
        }

        card.querySelector(".favorite-heart").addEventListener("click", () => {
            if (favorites.find(fav => fav.recipe === recipe.id)) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        card.querySelector(".favorite-heart").style.color = "";
                        favorites = JSON.parse(this.responseText).favorites
                    }
                };
                xhttp.open("POST", '../favourites/api/favorites/remove/', true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.setRequestHeader("X-CSRFToken", getCSRFToken());
                const data = JSON.stringify({
                    recipe_id: recipe.id,
                });
                xhttp.send(data);
            } else {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        card.querySelector(".favorite-heart").style.color = "red";
                        favorites = JSON.parse(this.responseText).favorites
                    }
                };
                xhttp.open("POST", '../favourites/api/favorites/add/', true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.setRequestHeader("X-CSRFToken", getCSRFToken());
                const data = JSON.stringify({
                    recipe_id: recipe.id,
                });
                xhttp.send(data);
            }
        });

        card.querySelector(".view-button").addEventListener("click", () => {
            window.location.href = `view/${recipe.id}`;
        });


        grid.appendChild(card);
    });
}

function filterRecipes(course = "", searchText = "") {
    let filtered = recipes.filter(r => {
        let matchesCourse = course ? r.course.toLowerCase() === course.toLowerCase() : true;
        let matchesSearch = r.name.toLowerCase().includes(searchText.toLowerCase());
        return matchesCourse && matchesSearch;
    });
    SR(filtered);
}

document.querySelector(".search-input").addEventListener("input", e => {
    const searchText = e.target.value;
    const activeCategory = document.querySelector(".category-tab.active");
    const course = activeCategory ? activeCategory.innerText : "";
    filterRecipes(course, searchText);
});

let categories = document.querySelectorAll(".category-tab");
categories.forEach(cat => {
    cat.addEventListener("click", () => {
        categories.forEach(c => c.classList.remove("active"));
        cat.classList.add("active");
        filterRecipes(cat.innerText, document.querySelector(".search-input").value);
    });
});

filterRecipes();

function getCSRFToken() {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}
