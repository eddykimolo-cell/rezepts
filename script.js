// Load recipes from your JSON data
let recipes = [
  // Your entire recipes.json content goes here
  {
    "id": "1",
    "title": "Schnelles Kokos-Curry",
    "description": "Aromatisches Curry in 20 Minuten",
    "ingredients": [
      "1 Dose Kokosmilch",
      "2 EL Currypaste",
      "1 Zwiebel",
      "200g Gemüse nach Wahl",
      "1 TL Kurkuma",
      "Salz und Pfeffer"
    ],
    "steps": [
      "Zwiebel anbraten",
      "Currypaste mitrösten",
      "Gemüse hinzufügen und mit Kokosmilch ablöschen",
      "10 Minuten köcheln lassen",
      "Mit Gewürzen abschmecken"
    ],
    "time": "20 min",
    "category": "vegan",
    "calories": "320",
    "favorite": "False",
    "image": "🍛"
  },
  // ... include all your other recipes here
];

// DOM Elements
const recipesGrid = document.getElementById('recipesGrid');
const recipeModal = document.getElementById('recipeModal');
const recipeDetail = document.getElementById('recipeDetail');
const recipeFormModal = document.getElementById('recipeFormModal');
const addRecipeForm = document.getElementById('addRecipeForm');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');

// Initialize the app
function init() {
    displayRecipes(recipes);
    setupEventListeners();
    loadFromLocalStorage();
}

// Display recipes in grid
function displayRecipes(recipesToShow) {
    recipesGrid.innerHTML = '';
    
    recipesToShow.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <div class="recipe-emoji">${recipe.image}</div>
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time}</span>
                <span>🔥 ${recipe.calories} kcal</span>
                <span class="category-tag ${recipe.category.replace(' ', '-')}">${recipe.category}</span>
            </div>
        `;
        
        recipeCard.addEventListener('click', () => showRecipeDetail(recipe));
        recipesGrid.appendChild(recipeCard);
    });
}

// Show recipe details in modal
function showRecipeDetail(recipe) {
    recipeDetail.innerHTML = `
        <h2>${recipe.image} ${recipe.title}</h2>
        <p><strong>${recipe.description}</strong></p>
        
        <div class="recipe-meta">
            <span>⏱️ Zeit: ${recipe.time}</span>
            <span>🔥 Kalorien: ${recipe.calories}</span>
            <span class="category-tag ${recipe.category.replace(' ', '-')}">${recipe.category}</span>
        </div>
        
        <div class="ingredients-list">
            <h3>Zutaten:</h3>
            <ul>
                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
        
        <div class="steps-list">
            <h3>Zubereitung:</h3>
            <ol>
                ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
    `;
    
    recipeModal.style.display = 'block';
}

// Add new recipe
function addNewRecipe(recipeData) {
    const newRecipe = {
        id: Date.now().toString(),
        ...recipeData,
        ingredients: recipeData.ingredients.split('\n').filter(line => line.trim()),
        steps: recipeData.steps.split('\n').filter(line => line.trim()),
        favorite: "False"
    };
    
    recipes.push(newRecipe);
    saveToLocalStorage();
    displayRecipes(recipes);
    recipeFormModal.style.display = 'none';
    addRecipeForm.reset();
}

// Filter recipes
function filterRecipes() {
    const category = categoryFilter.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    let filteredRecipes = recipes;
    
    if (category !== 'all') {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.category === category);
    }
    
    if (searchTerm) {
        filteredRecipes = filteredRecipes.filter(recipe => 
            recipe.title.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm) ||
            recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
        );
    }
    
    displayRecipes(filteredRecipes);
}

// Local Storage functions
function saveToLocalStorage() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

function loadFromLocalStorage() {
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) {
        recipes = JSON.parse(savedRecipes);
        displayRecipes(recipes);
    }
}

// Event Listeners
function setupEventListeners() {
    // Modal close buttons
    document.querySelector('.close').addEventListener('click', () => {
        recipeModal.style.display = 'none';
    });
    
    document.querySelector('.close-form').addEventListener('click', () => {
        recipeFormModal.style.display = 'none';
    });
    
    // Show form button
    document.getElementById('showFormBtn').addEventListener('click', () => {
        recipeFormModal.style.display = 'block';
    });
    
    // Add recipe form
    addRecipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            ingredients: document.getElementById('ingredients').value,
            steps: document.getElementById('steps').value,
            time: document.getElementById('time').value,
            category: document.getElementById('category').value,
            calories: document.getElementById('calories').value,
            image: document.getElementById('image').value
        };
        
        addNewRecipe(formData);
    });
    
    // Filter events
    categoryFilter.addEventListener('change', filterRecipes);
    searchInput.addEventListener('input', filterRecipes);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === recipeModal) {
            recipeModal.style.display = 'none';
        }
        if (e.target === recipeFormModal) {
            recipeFormModal.style.display = 'none';
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
