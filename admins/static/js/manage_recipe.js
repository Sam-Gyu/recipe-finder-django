class Recipe {
    constructor(id, name, course, description, instructions, duration, rate, image){
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
class Ingredient {
    constructor(id, recipeId, name, quantity){
        this.id = id;
        this.recipeId = recipeId;
        this.name = name;
        this.quantity = quantity;
    }
}
let recipes = [];
if(localStorage.getItem('recipes')){
    recipes = JSON.parse(localStorage.getItem('recipes'));
}

let ingredients = [];
if(localStorage.getItem('ingredients')){
    ingredients = JSON.parse(localStorage.getItem('ingredients'));
}

let recipeId = null;

function fetchRecipe(){
    recipes.forEach(recipe => {
        if(recipe.id == recipeId){
            document.getElementById('recipe_name').value = recipe.name;
            document.getElementById('course_name').value = recipe.course;
            document.getElementById('description').value = recipe.description;
            
            document.getElementById('instructions').value = recipe.instructions;
            document.getElementById('duration').value = recipe.duration;
            document.getElementById('rate').value = recipe.rate;
            document.getElementById('recipeImg').src = (recipe.image) ? recipe.image : '../images/placeholder.png';


            ingredients.forEach(ingredient => {
                if(ingredient.recipeId == recipeId){
                    const row = document.createElement('tr');
                    row.className = 'ingredientRow';
                    row.innerHTML = `
                        <td id="ingredientName">${ingredient.name}</td>
                        <td id="ingredientQuantity">${ingredient.quantity}</td>
                        <td><button id="remove_ingredient" type="button">X</button></td>
                    `;

                    row.querySelector('#remove_ingredient').addEventListener('click', () => {
                        row.remove();
                    })
                    document.querySelector('#ingredients_table tbody').append(row);
                }
            });   
        }
    })
}

document.getElementById('add_ingredient').addEventListener('click', () => {
    const ingredientName = document.getElementById('ingredients').value;
    const ingredientQuantity = document.getElementById('quantity').value;
    const row = document.createElement('tr');
    row.className = 'ingredientRow';
    row.innerHTML = `
        <td id="ingredientName">${ingredientName}</td>
        <td id="ingredientQuantity">${ingredientQuantity}</td>
        <td><button id="remove_ingredient" type="button">X</button></td>
                
    `;

    row.querySelector('#remove_ingredient ').addEventListener('click', () => {
        row.remove();
    })
    document.querySelector('#ingredients_table tbody').append(row);
    document.getElementById('ingredients').value = '';
    document.getElementById('quantity').value = '';
})

document.getElementById('recipeForm').addEventListener('submit', (event) => {
    event.preventDefault();
 
    const name = document.getElementById('recipe_name').value;
    const course = document.getElementById('course_name').value;
    const description = document.getElementById('description').value;
    const instructions = document.getElementById('instructions').value;
    const duration = document.getElementById('duration').value;
    const rate = document.getElementById('rate').value;
    const image = document.getElementById('recipeImg');
    const rows = document.getElementsByClassName('ingredientRow');
    const newIngredients = [];
    const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;

    for (let i = 0; i < rows.length; i++) {
        newIngredients.push(
            {
                name: rows[i].querySelector('#ingredientName').textContent,
                quantity: rows[i].querySelector('#ingredientQuantity').textContent
            }
        );
    }
    const recipe = {
        name: name,
        course: course,
        description:  description,
        instructions: instructions,
        duration: duration,
        rate: rate,
        image: image.src,
        ingredients: newIngredients
    }

    fetch('add-recipe/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify(recipe)
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert(data.message || 'Add recipe failed. Please try again.');
                return;
            }else{
                alert('Recipe Added Successfully');
                document.getElementById('recipeForm').reset();
                document.querySelector('#ingredients_table tbody').innerHTML = '';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during adding recipe. Please try again.');
        });

        

});

document.getElementById('editRecipe').addEventListener('click', (event) => {
    event.preventDefault();

    const name = document.getElementById('recipe_name').value;
    const course = document.getElementById('course_name').value;
    const description = document.getElementById('description').value;
    const instructions = document.getElementById('instructions').value;
    const duration = document.getElementById('duration').value;
    const rate = document.getElementById('rate').value;
    const image = document.getElementById('recipeImg');

    const rows = document.getElementsByClassName('ingredientRow');
    const newIngredients = [];
    const newRecipes = [];

    ingredients.forEach(ingredient => {
        if(ingredient.recipeId != recipeId){
            newIngredients.push(ingredient);
        }
    })

    for (let i = 0; i < rows.length; i++) {
        const ingredient = new Ingredient (i+1 , recipeId ,rows[i].querySelector('#ingredientName').textContent, rows[i].querySelector('#ingredientQuantity').textContent);
        newIngredients.push(ingredient);
    }

    recipes.forEach(recipe => {
        if(recipe.id == recipeId){
            const newRecipe = new Recipe(recipeId, name, course, description, instructions, duration, rate, image.src);
            newRecipes.push(newRecipe);
            console.log(newRecipe)
        }else{
            newRecipes.push(recipe);
        }
    })

    localStorage.setItem('recipes', JSON.stringify(newRecipes));
    localStorage.setItem('ingredients', JSON.stringify(newIngredients));

    alert('Recipe Edited Successfully');
    document.getElementById('recipeForm').reset();
    document.querySelector('#ingredients_table tbody').innerHTML = '';

    image.src = '../images/placeholder.png';
});


document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    if(id){
        recipeId = id;
        document.querySelector('#h2').textContent = 'Edit Recipe';
        fetchRecipe();
        document.getElementById('addRecipe').style.display = 'none';
        document.getElementById('editRecipe').style.display = 'inline';
    }
    
})

document.querySelector('#recipeImg').addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if(!file.type.match('image')){
        alert('Select valid image')
        return;
    }
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        image.dataset.url = reader.result;
        image.src = reader.result;
    }, false);

    reader.readAsDataURL(file);

})

document.getElementById('uploadImg').addEventListener('change', () =>{
    const file = document.getElementById('uploadImg').files[0];
    const image = document.getElementById('recipeImg');
    if(!file.type.match('image')){
        alert('Select valid image')
        return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
        image.dataset.url = reader.result;
        image.src = reader.result;
    }, false);

    reader.readAsDataURL(file);
    
})

document.getElementById('removeImg').addEventListener('click', (e) => {
    e.preventDefault();
    var image = document.getElementById('recipeImg');
    image.src = '../images/placeholder.png';
})
