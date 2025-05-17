document.addEventListener('DOMContentLoaded', function () {
  fetch('/api/favorites/', {
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
        <img src="${recipe.image}" alt="${recipe.name}">
        <h3>${recipe.name}</h3>
        <p><strong>Course:</strong> ${recipe.course}</p>
        <p><strong>Description:</strong> ${recipe.description}</p>
        <p><strong>Duration:</strong> ${recipe.duration}</p>
        <p><strong>Rate:</strong> ${recipe.rate}</p>
        <button class="remove-fav" data-id="${recipe.id}">Remove from Favorites</button>
      `;
      container.appendChild(recipeCard);
    });

    document.querySelectorAll('.remove-fav').forEach(btn => {
      btn.addEventListener('click', function () {
        const recipeId = this.getAttribute('data-id');
        fetch('/api/favorites/remove/', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
          },
          body: JSON.stringify({ recipe_id: recipeId })
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'removed') {
            this.parentElement.remove();
          }
        });
      });
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
