document.addEventListener('DOMContentLoaded', function () {
  fetch('./api/favorites/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('favorites-container');
    container.innerHTML = '';

    if (data.favorites.length === 0) {
      container.innerHTML = '<p>You have no favorite recipes yet.</p>';
      return;
    }

    data.favorites.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.classList.add('recipe-card');
      recipeCard.innerHTML = `
        
        <div class="favorite-heart" style="color:red;">♥</div>
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

        recipeCard.querySelector(".view-button").addEventListener("click", () => {
            window.location.href = `../search/view/${recipe.id}`;
        });

        recipeCard.querySelector('.favorite-heart').addEventListener('click', function () {
            fetch('./api/favorites/remove/', {
              method: 'POST', 
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
              },
              body: JSON.stringify({ recipe_id: recipe.id })
            })
            .then(response => response.json())
            .then(data => {
              if (data.status === 'removed') {
                this.parentElement.remove();
              }
            });
        });
        container.appendChild(recipeCard);
    });

    

    

  });
});

// Helper function to get CSRF token from cookie
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
