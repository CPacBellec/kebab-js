function startTimer() {
    // Récupérer la date et l'heure actuelle
    fetch('https://worldtimeapi.org/api/timezone/Europe/Paris')
        .then(response => response.json())
        .then(data => {
            const date = new Date(data.datetime);
            const dateString = date.toLocaleDateString();
            const timeString = date.toLocaleTimeString();

            // Afficher la date et l'heure
            document.getElementById('clock').innerHTML = `Date : ${dateString}, Heure : ${timeString}`;

            // Lancer le timer
            let minutes = 0;
            let seconds = 0;
            timer = setInterval(function () {
                seconds++;
                if (seconds === 60) {
                    minutes++;
                    seconds = 0;
                }
                document.getElementById('timer').innerHTML = `Temps écoulé : ${minutes} minutes et ${seconds} secondes`;
            }, 1000);
        })
        .catch(error => console.error('Erreur lors de la récupération de l\'heure:', error));
}

function stopTimer() {
    // Arrêter le timer
    clearInterval(timer);

    // Afficher un message
    document.getElementById('message').innerHTML = 'Timer arrêté.';

    // Supprimer la date, l'heure et le message après quelques secondes
    setTimeout(function () {
        document.getElementById('clock').innerHTML = '';
        document.getElementById('timer').innerHTML = '';
        document.getElementById('message').innerHTML = '';
    }, 3000); // 3000 millisecondes (3 secondes)
}

// Charge les recettes depuis le stockage local lors du chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    renderRecipes(savedRecipes);

    // Peuple la liste des recettes
    populateRecipeSelect(savedRecipes);
});

// Fonctions pour ajouter, visualiser et supprimer une recette
function addRecipe() {
    const recipeName = document.getElementById('recipeName').value;
    const ingredients = document.getElementById('ingredients').value;

    // Récupère les recettes existantes du stockage local
    const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // Ajoute la nouvelle recette à la liste
    savedRecipes.push({ name: recipeName, ingredients: ingredients });

    // Sauvegarde les recettes mises à jour dans le stockage local
    localStorage.setItem('recipes', JSON.stringify(savedRecipes));

    // Affiche les recettes à l'écran
    renderRecipes(savedRecipes);
}

function removeRecipe(button) {
    const listItem = button.parentNode;
    const recipeIndex = Array.from(listItem.parentNode.children).indexOf(listItem);

    const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    savedRecipes.splice(recipeIndex, 1);

    localStorage.setItem('recipes', JSON.stringify(savedRecipes));

    listItem.parentNode.removeChild(listItem);
}

// Fonction pour afficher les recettes à l'écran
function renderRecipes(recipes) {
    const recipeList = document.getElementById('recipeList');
    recipeList.innerHTML = '';

    recipes.forEach((recipe) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${recipe.name} - ${recipe.ingredients} <button class="bg-red-500 text-white px-4 py-2 rounded" onclick="removeRecipe(this)">Supprimer</button>`;
        recipeList.appendChild(listItem);
    });
}

function populateRecipeSelect(recipes) {
    const recipeSelect = document.getElementById('recipeSelect');

    recipes.forEach((recipe) => {
        const option = document.createElement('option');
        option.value = recipe.name;
        option.text = recipe.name;
        recipeSelect.add(option);
    });
}
// Fonctions pour lancer une commande en cuisine
function sendToKitchen() {
    // Récupérer les valeurs des champs
    const recipeSelect = document.getElementById('recipeSelect');
    const selectedRecipe = recipeSelect.options[recipeSelect.selectedIndex].text;
    const sauce = document.getElementById('sauce').value;

    // Récupérer la date et l'heure actuelle
    fetch('https://worldtimeapi.org/api/timezone/Europe/Paris')
        .then(response => response.json())
        .then(data => {
            const date = new Date(data.datetime);

            // Créer un élément de liste pour afficher la commande en cuisine
            const listItem = document.createElement('li');
            listItem.innerHTML = `${selectedRecipe} - Sauce : ${sauce} - Commande lancée à ${date.toLocaleTimeString()} <span id="timer_${Date.now()}"></span> <button class="bg-green-500 text-white px-4 py-2 rounded" onclick="validateOrder(this)">Valider</button>`;

            // Ajouter la commande à la liste des commandes en cuisine
            document.getElementById('orderList').appendChild(listItem);

            // Lancer le timer pour cette commande spécifique
            startTimerForOrder(date, listItem);
        })
        .catch(error => console.error('Erreur lors de la récupération de l\'heure:', error));
}

// Fonction pour démarrer le timer pour une commande spécifique
function startTimerForOrder(startDate, listItem) {
    let timer;
    // Met à jour le timer toutes les secondes
    timer = setInterval(function () {
        const now = new Date();
        const elapsedSeconds = Math.floor((now - startDate) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;

        // Met à jour l'affichage du timer
        const timerElement = listItem.querySelector('span');
        timerElement.innerHTML = ` - Temps écoulé : ${minutes} minutes et ${seconds} secondes`;

    }, 1000);

    // Ajoute l'identifiant du timer à l'élément de la liste pour pouvoir l'arrêter plus tard
    listItem.dataset.timerId = timer;
}

// Fonction pour valider une commande
// Fonction pour valider une commande
function validateOrder(button) {
    // Supprimer la commande de la liste des commandes en cuisine
    const listItem = button.parentNode;
    clearInterval(listItem.dataset.timerId); // Arrêter le timer associé à cette commande

    // Récupérer les commandes en cours depuis le stockage local
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || { inProgress: [], validated: [] };

    // Déplacer la commande vers la liste des commandes validées
    savedOrders.validated.push({ name: listItem.textContent, time: new Date() });

    // Sauvegarder les commandes mises à jour dans le stockage local
    localStorage.setItem('orders', JSON.stringify(savedOrders));

    // Charger les commandes depuis le stockage local
    loadOrders();

    // Ajouter un bouton pour supprimer la commande validée
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Supprimer';
    deleteButton.onclick = function () {
        deleteValidatedOrder(this);
    };
    listItem.appendChild(deleteButton);
}

// Fonction pour sauvegarder les commandes
function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Fonction pour charger les commandes
function loadOrders() {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || { inProgress: [], validated: [] };
    
    const orderList = document.getElementById('orderList');
    const validatedOrdersList = document.getElementById('validatedOrders');

    orderList.innerHTML = '';
    validatedOrdersList.innerHTML = '';

    savedOrders.inProgress.forEach((order) => {
        const listItem = createOrderListItem(order);
        orderList.appendChild(listItem);
        startTimerForOrder(order.time, listItem);
    });

    savedOrders.validated.forEach((order) => {
        const listItem = createOrderListItem(order);
        const deleteButton = createDeleteButton(() => deleteValidatedOrder(listItem));
        listItem.appendChild(deleteButton);
        validatedOrdersList.appendChild(listItem);
    });
}

// Fonction pour créer un élément de liste pour une commande
function createOrderListItem(order) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${order.name} - ${order.sauce} - Commande lancée à ${order.time.toLocaleTimeString()} <span id="timer_${order.time.getTime()}"></span>`;
    return listItem;
}

// Fonction pour créer un bouton de suppression
function createDeleteButton(callback) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Supprimer';
    deleteButton.onclick = callback;
    return deleteButton;
}

// Fonction pour supprimer une commande validée
function deleteValidatedOrder(listItem) {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || { inProgress: [], validated: [] };

    // Retirer la commande de la liste des commandes validées
    const orderIndex = savedOrders.validated.findIndex((order) => order.time.getTime() === listItem.time.getTime());
    savedOrders.validated.splice(orderIndex, 1);

    saveOrders(savedOrders);

    // Charger les commandes depuis le stockage local
    loadOrders();
}

