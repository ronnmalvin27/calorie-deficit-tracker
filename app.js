let foods = [];
let currentUser = null;
let totalCalories = 0;

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
            const calories = parseFloat(cols[1]);

            foods.push({ food, calories });

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

    totalCalories = 0;

    loadMeals();

    alert(`Logged in as ${currentUser}`);
}

// ==========================
// SAVE MEAL
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

    totalCalories = 0;

    let userData = JSON.parse(localStorage.getItem(currentUser)) || { meals: [] };

    userData.meals.forEach(meal => {
        addRow(meal);
        totalCalories += meal.calories;
    });

    updateTotal();
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

    const calories = (foodData.calories / 100) * weight;

    const meal = {
        food: foodName,
        weight: weight,
        calories: calories
    };

    saveMeal(meal);
    addRow(meal);

    totalCalories += calories;

    updateTotal();
}

// ==========================
// ADD ROW TO TABLE
// ==========================
function addRow(meal) {

    const row = `
        <tr>
            <td>${meal.food}</td>
            <td>${meal.weight}g</td>
            <td>${meal.calories.toFixed(2)}</td>
        </tr>
    `;

    document.getElementById("historyBody").innerHTML += row;
}

// ==========================
// UPDATE TOTAL
// ==========================
function updateTotal() {
    document.getElementById("totalCalories").innerText =
        `Total Calories: ${totalCalories.toFixed(2)}`;
}

// ==========================
// CLEAR USER DATA
// ==========================
function clearAll() {

    if (!currentUser) return;

    localStorage.removeItem(currentUser);

    document.getElementById("historyBody").innerHTML = "";

    totalCalories = 0;

    updateTotal();
}
