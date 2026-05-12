let foods = [];
let currentUser = null;

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

            const food = cols[0];
            const calories = parseFloat(cols[1]) || 0;
            const protein = parseFloat(cols[2]) || 0;
            const carbs = parseFloat(cols[3]) || 0;
            const fat = parseFloat(cols[4]) || 0;

            foods.push({ food, calories, protein, carbs, fat });

            const option = document.createElement('option');
            option.value = food;
            option.textContent = food;

            document.getElementById('foodSelect').appendChild(option);
        });
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

    const foodName = document.getElementById("foodSelect").value;
    const weight = parseFloat(document.getElementById("weightInput").value);

    if (!foodName || !weight) {
        alert("Select food + weight");
        return;
    }

    const food = foods.find(f => f.food === foodName);

    if (!food) return;

    const meal = {
        food: foodName,
        weight: weight,
        calories: (food.calories / 100) * weight,
        protein: (food.protein / 100) * weight,
        carbs: (food.carbs / 100) * weight,
        fat: (food.fat / 100) * weight
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
            <td>${meal.protein.toFixed(1)}g</td>
            <td>${meal.carbs.toFixed(1)}g</td>
            <td>${meal.fat.toFixed(1)}g</td>
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

function updateUI() {

    document.getElementById("totalCalories").innerText =
        `Total Calories: ${totalCalories.toFixed(1)}`;

    document.getElementById("macroTotals").innerText =
        `Protein: ${totalProtein.toFixed(1)}g | Carbs: ${totalCarbs.toFixed(1)}g | Fat: ${totalFat.toFixed(1)}g`;
}

function resetTotals() {
    totalCalories = 0;
    totalProtein = 0;
    totalCarbs = 0;
    totalFat = 0;
}

// ==========================
// CLEAR ALL
// ==========================
function clearAll() {

    if (!currentUser) return;

    localStorage.removeItem(currentUser);

    document.getElementById("historyBody").innerHTML = "";

    resetTotals();
    updateUI();
}

// ==========================
// CONNECT BUTTONS (IMPORTANT FIX)
// ==========================
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("calcBtn").addEventListener("click", calculateCalories);
document.getElementById("clearBtn").addEventListener("click", clearAll);
