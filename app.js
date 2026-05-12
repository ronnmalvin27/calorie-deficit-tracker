let foods = [];
let currentUser = null;
let selectedFood = null;

// totals
let totalCalories = 0;
let totalProtein = 0;
let totalCarbs = 0;
let totalFat = 0;

// ==========================
// LOAD CSV
// ==========================
fetch('./foods.csv')
    .then(res => res.text())
    .then(data => {

        const rows = data.split('\n').slice(1);

        rows.forEach(row => {
            if (!row.trim()) return;

            const cols = row.split(',');

            foods.push({
                food: cols[0],
                calories: parseFloat(cols[1]) || 0,
                protein: parseFloat(cols[2]) || 0,
                carbs: parseFloat(cols[3]) || 0,
                fat: parseFloat(cols[4]) || 0
            });
        });
    });

// ==========================
// SEARCH DROPDOWN
// ==========================
const searchInput = document.getElementById("foodSearch");
const suggestionsBox = document.getElementById("suggestions");

searchInput.addEventListener("input", function () {

    const query = this.value.toLowerCase();
    suggestionsBox.innerHTML = "";

    if (!query) return;

    const results = foods.filter(f =>
        f.food.toLowerCase().includes(query)
    );

    results.forEach(item => {

        const div = document.createElement("div");
        div.textContent = item.food;

        div.onclick = () => {
            searchInput.value = item.food;
            selectedFood = item;
            suggestionsBox.innerHTML = "";
        };

        suggestionsBox.appendChild(div);
    });
});

// close dropdown
document.addEventListener("click", function (e) {
    if (e.target.id !== "foodSearch") {
        suggestionsBox.innerHTML = "";
    }
});

// ==========================
// LOGIN
// ==========================
function login() {

    const name = document.getElementById("username").value.trim();

    if (!name) {
        alert("Enter username");
        return;
    }

    currentUser = name;

    resetTotals();
    loadMeals();

    alert("Logged in as " + currentUser);
}

// ==========================
// SAVE
// ==========================
function saveMeal(meal) {

    let data = JSON.parse(localStorage.getItem(currentUser)) || { meals: [] };

    data.meals.push(meal);

    localStorage.setItem(currentUser, JSON.stringify(data));
}

// ==========================
// LOAD
// ==========================
function loadMeals() {

    document.getElementById("historyBody").innerHTML = "";

    resetTotals();

    if (!currentUser) return;

    let data = JSON.parse(localStorage.getItem(currentUser)) || { meals: [] };

    data.meals.forEach(meal => {
        addRow(meal);
        addTotals(meal);
    });

    updateUI();
}

// ==========================
// ADD MEAL
// ==========================
function calculateCalories() {

    if (!currentUser) {
        alert("Login first");
        return;
    }

    const weight = parseFloat(document.getElementById("weightInput").value);

    if (!selectedFood || !weight) {
        alert("Search and select food + enter weight");
        return;
    }

    const meal = {
        food: selectedFood.food,
        weight: weight,
        calories: (selectedFood.calories / 100) * weight,
        protein: (selectedFood.protein / 100) * weight,
        carbs: (selectedFood.carbs / 100) * weight,
        fat: (selectedFood.fat / 100) * weight
    };

    saveMeal(meal);
    addRow(meal);
    addTotals(meal);
    updateUI();
}

// ==========================
// TABLE ROW
// ==========================
function addRow(meal) {

    document.getElementById("historyBody").innerHTML += `
        <tr>
            <td>${meal.food}</td>
            <td>${meal.weight}g</td>
            <td>${meal.calories.toFixed(1)}</td>
            <td>${meal.protein.toFixed(1)}</td>
            <td>${meal.carbs.toFixed(1)}</td>
            <td>${meal.fat.toFixed(1)}</td>
        </tr>
    `;
}

// ==========================
// TOTALS
// ==========================
function addTotals(meal) {
    totalCalories += meal.calories;
    totalProtein += meal.protein;
    totalCarbs += meal.carbs;
    totalFat += meal.fat;
}

// ==========================
// UI UPDATE
// ==========================
function updateUI() {

    document.getElementById("totalCalories").innerText =
        `Total Calories: ${totalCalories.toFixed(1)}`;

    document.getElementById("totalProtein").innerText =
        `Total Protein: ${totalProtein.toFixed(1)}g`;

    document.getElementById("totalCarbs").innerText =
        `Total Carbs: ${totalCarbs.toFixed(1)}g`;

    document.getElementById("totalFat").innerText =
        `Total Fat: ${totalFat.toFixed(1)}g`;
}

// ==========================
// RESET
// ==========================
function resetTotals() {
    totalCalories = 0;
    totalProtein = 0;
    totalCarbs = 0;
    totalFat = 0;
}

// ==========================
// CLEAR
// ==========================
function clearAll() {

    if (!currentUser) return;

    localStorage.removeItem(currentUser);

    document.getElementById("historyBody").innerHTML = "";

    resetTotals();
    updateUI();
}

// ==========================
// BUTTONS
// ==========================
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("calcBtn").addEventListener("click", calculateCalories);
document.getElementById("clearBtn").addEventListener("click", clearAll);
