// Tableau pour stocker les recettes
let recipes = [];

// Tableau pour stocker les commandes en cuisine
let orders = [];

// Fonction pour sauvegarder les recettes dans le stockage local
function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }

// Fonction pour ajouter une recette
function addRecipe() {
  const recipeName = document.getElementById('recipeName').value;
  const ingredients = document.getElementById('ingredients').value;

  if (recipeName && ingredients) {
    const recipe = { name: recipeName, ingredients: ingredients };
    recipes.push(recipe);

    saveRecipes();

    // Met à jour la liste des recettes
    updateRecipeList();

    // Efface les champs de saisie
    document.getElementById('recipeName').value = '';
    document.getElementById('ingredients').value = '';
  } else {
    alert('Veuillez saisir le nom de la recette et les ingrédients.');
  }
}

// Fonction pour mettre à jour la liste des recettes
// Fonction pour mettre à jour la liste des recettes
function updateRecipeList() {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';
  
    recipes.forEach(recipe => {
      const li = document.createElement('li');
      li.innerHTML = `${recipe.name} - ${recipe.ingredients}
        <button onclick="deleteRecipe('${recipe.name}')">Supprimer</button>`;
      recipeList.appendChild(li);
    });
  
    // Met à jour la liste des recettes dans le formulaire de commande
    updateRecipeDropdown();
  }
  

// Fonction pour mettre à jour la liste des recettes dans le formulaire de commande
function updateRecipeDropdown() {
  const selectRecipe = document.getElementById('selectRecipe');
  selectRecipe.innerHTML = '';

  recipes.forEach(recipe => {
    const option = document.createElement('option');
    option.value = recipe.name;
    option.textContent = recipe.name;
    selectRecipe.appendChild(option);
  });
}

function deleteRecipe(recipeName) {
    recipes = recipes.filter(recipe => recipe.name !== recipeName);

    saveRecipes();
  
    // Met à jour la liste des recettes
    updateRecipeList();
  
    // Met à jour la liste des commandes en cuisine pour retirer la recette supprimée
    updateOrderList();
  }

// Fonction pour envoyer une commande en cuisine
function sendToKitchen() {
    const selectedRecipeName = document.getElementById('selectRecipe').value;
    const sauce = document.getElementById('sauce').value;
  
    if (selectedRecipeName && sauce) {
      const selectedRecipe = recipes.find(recipe => recipe.name === selectedRecipeName);
  
      if (selectedRecipe) {
        const order = {
          recipe: selectedRecipe,
          sauce: sauce,
          timestamp: new Date()
        };
  
        orders.push(order);
  
        // Met à jour la liste des commandes en cuisine
        updateOrderList();
  
        // Efface les champs de saisie
        document.getElementById('selectRecipe').value = '';
        document.getElementById('sauce').value = '';
      }
    } else {
      alert('Veuillez choisir une recette et indiquer la sauce.');
    }
  }
  
  // Fonction pour mettre à jour la liste des commandes en cuisine
  async function updateOrderList() {
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '';
  
    for (const order of orders) {
      const li = document.createElement('li');
      const elapsedTime = await getElapsedTime(order.timestamp);
      li.textContent = `${order.recipe.name} - Sauce: ${order.sauce} - Temps écoulé: ${elapsedTime}`;
      orderList.appendChild(li);
    }
  }
  
  // Appel initial de la fonction pour mettre à jour la liste des recettes
  updateRecipeList();

// Fonction pour obtenir le temps écoulé depuis la prise de commande
async function getElapsedTime(timestamp) {
    try {
      // Récupère l'heure actuelle à Paris depuis l'API WorldTime
      const response = await fetch('https://worldtimeapi.org/api/timezone/Europe/Paris');
      const data = await response.json();
      
      // Utilise le timestamp de l'API WorldTime pour calculer le temps écoulé
      const apiTimestamp = new Date(data.utc_datetime);
      const elapsedMilliseconds = apiTimestamp - timestamp;
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
      const minutes = Math.floor(elapsedSeconds / 60);
      const seconds = elapsedSeconds % 60;
  
      return `${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}s`;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'heure depuis l\'API:', error);
      return 'Erreur';
    }
  }

// Met à jour la liste des recettes lors du chargement initial
updateRecipeList();

function loadRecipes() {
    const savedRecipes = localStorage.getItem('recipes');
  
    if (savedRecipes) {
      recipes = JSON.parse(savedRecipes);
      // Met à jour la liste des recettes
      updateRecipeList();
    }
  }
  
  // Appel initial de la fonction pour charger les recettes
  loadRecipes();
