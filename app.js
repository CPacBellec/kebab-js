// Tableau pour stocker les recettes
let recipes = [];

// Tableau pour stocker les commandes en cuisine
let orders = [];

// Fonction pour ajouter une recette
function addRecipe() {
  const recipeName = document.getElementById('recipeName').value;
  const ingredients = document.getElementById('ingredients').value;

  if (recipeName && ingredients) {
    const recipe = { name: recipeName, ingredients: ingredients };
    recipes.push(recipe);

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
function updateRecipeList() {
  const recipeList = document.getElementById('recipeList');
  recipeList.innerHTML = '';

  recipes.forEach(recipe => {
    const li = document.createElement('li');
    li.textContent = `${recipe.name} - ${recipe.ingredients}`;
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
function updateOrderList() {
  const orderList = document.getElementById('orderList');
  orderList.innerHTML = '';

  orders.forEach(order => {
    const li = document.createElement('li');
    const elapsedTime = getElapsedTime(order.timestamp);
    li.textContent = `${order.recipe.name} - Sauce: ${order.sauce} - Temps écoulé: ${elapsedTime}`;
    orderList.appendChild(li);
  });
}

// Fonction pour obtenir le temps écoulé depuis la prise de commande
function getElapsedTime(timestamp) {
  const now = new Date();
  const elapsedMilliseconds = now - timestamp;
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}s`;
}

// Met à jour la liste des recettes lors du chargement initial
updateRecipeList();
