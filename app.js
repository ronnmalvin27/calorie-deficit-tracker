let foods = [];
let totalCalories = 0;

// Load CSV File
fetch('foods.csv')
    .then(response => response.text())
    .then(data => {

        const rows = data.split('\n').slice(1);

        rows.forEach(row => {

            const cols = row.split(',');

            const food = cols[0];
            const calories = cols[1];

            foods.push({
                food,
                calories
            });

            const option = document.createElement('option');

            option.value = food;
            option.textContent = food;

            document
                .getElementById('foodSelect')
                .appendChild(option);
        });
    });

function calculateCalories() {

    const selectedFood =
        document.getElementById('foodSelect').value;

    const weight =
        parseFloat(document.getElementById('weightInput').value);

    const foodData =
        foods.find(f => f.food === selectedFood);

    if (!foodData || !weight) {
        alert("Please select food and enter weight.");
        return;
    }

    const calories =
        (foodData.calories / 100) * weight;

    document.getElementById('result').innerHTML =
        `${selectedFood} (${weight}g) = ${calories.toFixed(2)} calories`;

    const row = `
        <tr>
            <td>${selectedFood}</td>
            <td>${weight}g</td>
            <td>${calories.toFixed(2)}</td>
        </tr>
    `;

    document
        .getElementById('historyBody')
        .innerHTML += row;

    totalCalories += calories;

    document.getElementById('totalCalories').innerHTML =
        `Total Calories: ${totalCalories.toFixed(2)}`;
}

function clearAll() {

    document.getElementById('historyBody').innerHTML = '';

    document.getElementById('result').innerHTML = '';

    document.getElementById('weightInput').value = '';

    totalCalories = 0;

    document.getElementById('totalCalories').innerHTML =
        'Total Calories: 0';
}