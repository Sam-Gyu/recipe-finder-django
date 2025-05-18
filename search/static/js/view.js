
function fetchRecipe(){
        if(favorite[0].status){
            document.querySelector('.favorite-heart').style.color = 'red';
        }
    
        document.querySelector('.favorite-heart').addEventListener('click', () => {
            if(favorite[0].status){
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        document.querySelector(".favorite-heart").style.color = "";
                        location.reload();
                    }
                };
                xhttp.open("POST", '../../favourites/api/favorites/remove/', true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.setRequestHeader("X-CSRFToken", getCSRFToken());
                const data = JSON.stringify({
                    recipe_id: recipe,
                });
                xhttp.send(data);
            }else{
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        document.querySelector(".favorite-heart").style.color = "red";
                        location.reload();
                    }
                };
                xhttp.open("POST", '../../favourites/api/favorites/add/', true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.setRequestHeader("X-CSRFToken", getCSRFToken());
                const data = JSON.stringify({
                    recipe_id: recipe,
                });
                xhttp.send(data);
            }

    
        })
        

}

fetchRecipe();

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
