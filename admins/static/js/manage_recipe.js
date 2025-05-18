
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

if(document.getElementById('editRecipeForm'))
{
    document.getElementById('editRecipeForm').addEventListener('submit', (event) => {
        event.preventDefault();
    
        const name = document.getElementById('recipe_name').value;
        const course = document.getElementById('course_name').value;
        const description = document.getElementById('description').value;
        const instructions = document.getElementById('instructions').value;
        const duration = document.getElementById('duration').value;
        const rate = document.getElementById('rate').value;
        const recipe_id = document.getElementById('recipe_id').value;

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

        var xttps = new XMLHttpRequest();
        xttps.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert('Recipe Edited Successfully');
                window.location.href = JSON.parse(this.responseText).url;
            }
        }
        xttps.open("PUT", `edit-recipe/${recipe_id}`, true);
        xttps.setRequestHeader("Content-type", "application/json");
        xttps.send(JSON.stringify(recipe));
    });
}else{

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
                    location.reload()
                    document.querySelector('#ingredients_table tbody').innerHTML = '';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during adding recipe. Please try again.');
            });
    
            
    
    });
}



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
