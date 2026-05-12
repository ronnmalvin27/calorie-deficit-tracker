let foods = [];
let currentUser = null;

// totals
let totalCalories = 0;
let totalProtein = 0;
let totalCarbs = 0;
let totalFat = 0;

// ==========================
// LOAD CSV FOODS
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

            foods.push({
                food,
                calories,
                protein,
                carbs,
                fat
            });

            const option = document.createElement('option');
            option.value = food;
            option.textContent = food;

            document.getElementById('foodSelect').appendChild(option);
        });
    });

// ==========================
// LOGIN USER
// ==========================
function login() {
    const name = document.getElementById("username").value.trim();

    if (!name) {
        alert("Please enter a username");
        return;
    }

    currentUser = name;

    resetTotals();
    loadMeals();

    alert(`Logged in as ${currentUser}`);
}

// ==========================
// SAVE MEAL TO LOCALSTORAGE
// ==========================
function saveMeal(meal) {

    let userData = JSON.parse(localStorage.getItem(currentUser)) || { meals: [] };

    userData.meals.push(meal);

    localStorage.setItem(currentUser, JSON.stringify(userData));
}

// ==========================
// LOAD MEALS
// ==========================
function loadMeals() {

    document.getElementById("historyBody").innerHTML = "";

    resetTotals();

    if (!currentUser) return;

    let userData = JSON.parse(localStorage.getItem(currentUser)) || { meals: [] };

    userData.meals.forEach(meal => {
        addRow(meal);
        addToTotals(meal);
    });

    updateTotals();
}

// ==========================
// CALCULATE MEAL
// ==========================
function calculateCalories() {

    if (!currentUser) {
        alert("Please login first");
        return;
    }

    const foodName = document.getElementById('foodSelect').value;
    const weight = parseFloat(document.getElementById('weightInput').value);

    if (!foodName || !weight) {
        alert("Select food and enter weight");
        return;
    }

    const foodData = foods.find(f => f.food === foodName);

    if (!foodData) {
        alert("Food not found");
        return;
    }

    const meal = {
        food: foodName,
        weight: weight,
        calories: (foodData.calories / 100) * weight,
        protein: (foodData.protein / 100) * weight,
        carbs: (foodData.carbs / 100) * weight,
        fat: (foodData.fat / 100) * weight
    };

    saveMeal(meal);
    addRow(meal);
    addToTotals(meal);
    updateTotals();
}

// ==========================
// ADD ROW TO TABLE
// ==========================
function addRow(meal) {

    const row = `
        <tr>
            <td>${meal.food}</td>
            <td>${meal.weight}g</td>
            <td>${meal.calories.toFixed(1)}</td>
            <td>${meal.protein.toFixed(1)}g</td>
            <td>${meal.carbs.toFixed(1)}g</td>
            <td>${meal.fat.toFixed(1)}g</td>
        </tr>
    `;

    document.getElementById("historyBody").innerHTML += row;
}

// ==========================
// ADD TO TOTALS
// ==========================
function addToTotals(meal) {
    totalCalories += meal.calories;
    totalProtein += meal.protein;
    totalCarbs += meal.carbs;
    totalFat += meal.fat;
}

// ==========================
// UPDATE TOTAL DISPLAY
// ==========================
function updateTotals() {

    document.getElementById("totalCalories").innerText =
        `Total Calories: ${totalCalories.toFixed(1)}`;

    document.getElementById("macroTotals").innerText =
        `Protein: ${totalProtein.toFixed(1)}g | Carbs: ${totalCarbs.toFixed(1)}g | Fat: ${totalFat.toFixed(1)}g`;
}

// ==========================
// RESET TOTALS
// ==========================
function resetTotals() {
    totalCalories = 0;
    totalProtein = 0;
    totalCarbs = 0;
    totalFat = 0;
}

// ==========================
// CLEAR ALL DATA
// ==========================
function clearAll() {

    if (!currentUser) return;

    localStorage.removeItem(currentUser);

    document.getElementById("historyBody").innerHTML = "";

    resetTotals();
    updateTotals();
}
