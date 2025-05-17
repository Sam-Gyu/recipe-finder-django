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

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let userId = localStorage.getItem("userId");

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
                    <div class="recipe-time">${recipe.duration} min</div>
                </div>
                <button class="view-button">View Recipe</button>
            </div>
        `;

        if (favorites.find(fav => fav.recipeId === recipe.id)) {
            card.querySelector(".favorite-heart").style.color = "red";
        }

        card.querySelector(".favorite-heart").addEventListener("click", () => {
            if (favorites.find(fav => fav.recipeId === recipe.id)) {
                favorites = favorites.filter(fav => fav.recipeId !== recipe.id);
                card.querySelector(".favorite-heart").style.color = "";
            } else {
                favorites.push(new Favorite(userId, recipe.id));
                card.querySelector(".favorite-heart").style.color = "red";
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
        });

        card.querySelector(".view-button").addEventListener("click", () => {
            window.location.href = `./view.html?recipeId=${recipe.id}`;
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
