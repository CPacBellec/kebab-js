function startTimer() {
    fetch('https://worldtimeapi.org/api/timezone/Europe/Paris')
        .then(response => response.json())
        .then(data => {
            const date = new Date(data.datetime);
            const dateString = date.toLocaleDateString();
            const timeString = date.toLocaleTimeString();

            document.getElementById('clock').innerHTML = `Date : ${dateString}, Heure : ${timeString}`;

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
    clearInterval(timer);

    document.getElementById('message').innerHTML = 'Timer arrêté.';

    setTimeout(function () {
        document.getElementById('clock').innerHTML = '';
        document.getElementById('timer').innerHTML = '';
        document.getElementById('message').innerHTML = '';
    }, 3000); // 3000 millisecondes (3 secondes)
}

document.addEventListener('DOMContentLoaded', function () {
    const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    renderRecipes(savedRecipes);
    populateRecipeSelect(savedRecipes);
});

function addRecipe() {
    const recipeName = document.getElementById('recipeName').value;
    const ingredients = document.getElementById('ingredients').value;
    const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    savedRecipes.push({ name: recipeName, ingredients: ingredients });
    localStorage.setItem('recipes', JSON.stringify(savedRecipes));

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
function sendToKitchen() {
    const recipeSelect = document.getElementById('recipeSelect');
    const selectedRecipe = recipeSelect.options[recipeSelect.selectedIndex].text;
    const sauce = document.getElementById('sauce').value;
    fetch('https://worldtimeapi.org/api/timezone/Europe/Paris')
        .then(response => response.json())
        .then(data => {
            const date = new Date(data.datetime);

            const listItem = document.createElement('li');
            listItem.innerHTML = `${selectedRecipe} - Sauce : ${sauce} - Commande lancée à ${date.toLocaleTimeString()} <span id="timer_${Date.now()}"></span> <button class="bg-green-500 text-white px-4 py-2 rounded" onclick="validateOrder(this)">Valider</button>`;

            document.getElementById('orderList').appendChild(listItem);

            startTimerForOrder(date, listItem);
        })
        .catch(error => console.error('Erreur lors de la récupération de l\'heure:', error));
}
function startTimerForOrder(startDate, listItem) {
    let timer;
    timer = setInterval(function () {
        const now = new Date();
        const elapsedSeconds = Math.floor((now - startDate) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;

        const timerElement = listItem.querySelector('span');
        timerElement.innerHTML = ` - Temps écoulé : ${minutes} minutes et ${seconds} secondes`;

    }, 1000);
    listItem.dataset.timerId = timer;
}
function validateOrder(button) {
    const listItem = button.parentNode;
    clearInterval(listItem.dataset.timerId); 

    const savedOrders = JSON.parse(localStorage.getItem('orders')) || { inProgress: [], validated: [] };

    savedOrders.validated.push({ name: listItem.textContent, time: new Date() });

    localStorage.setItem('orders', JSON.stringify(savedOrders));

    loadOrders();

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Supprimer';
    deleteButton.onclick = function () {
        deleteValidatedOrder(this);
    };
    listItem.appendChild(deleteButton);
}

function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

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

function createOrderListItem(order) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${order.name} - ${order.sauce} - Commande lancée à ${order.time.toLocaleTimeString()} <span id="timer_${order.time.getTime()}"></span>`;
    return listItem;
}
function createDeleteButton(callback) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Supprimer';
    deleteButton.onclick = callback;
    return deleteButton;
}

function deleteValidatedOrder(listItem) {
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || { inProgress: [], validated: [] };

    const orderIndex = savedOrders.validated.findIndex((order) => order.time.getTime() === listItem.time.getTime());
    savedOrders.validated.splice(orderIndex, 1);

    saveOrders(savedOrders);

    loadOrders();
}

