let users = {};
let currentUser = '';

function showMessage(message) {
    const messageArea = document.createElement('div');
    messageArea.textContent = message;
    messageArea.style.color = 'red'; // Style for visibility
    document.body.appendChild(messageArea);
    setTimeout(() => messageArea.remove(), 3000); // Remove after 3 seconds
}

function addUser() {
    const userName = document.getElementById('user-name').value.trim();
    if (userName && !users[userName]) {
        users[userName] = { expenses: [], total: 0 };
        const userSelect = document.getElementById('user-select');
        const option = document.createElement('option');
        option.value = userName;
        option.textContent = userName;
        userSelect.appendChild(option);
        document.getElementById('user-name').value = '';
    } else {
        showMessage('User already exists or name is invalid.');
    }
}

function loadUserExpenses() {
    const userSelect = document.getElementById('user-select');
    currentUser = userSelect.value;
    const currentUserDisplay = document.getElementById('current-user');
    currentUserDisplay.textContent = currentUser || '';

    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    const totalExpensesDisplay = document.getElementById('total-expenses');
    totalExpensesDisplay.textContent = '0.00';

    if (currentUser && users[currentUser]) {
        users[currentUser].expenses.forEach(expense => {
            const li = document.createElement('li');
            li.textContent = `${expense.name}: ₹${expense.amount.toFixed(2)}`;
            expenseList.appendChild(li);

            // Trigger the animation by using a timeout
            setTimeout(() => {
                li.style.opacity = 1; // Ensure the item fades in
            }, 50); // Slight delay to trigger CSS transition
        });
        totalExpensesDisplay.textContent = users[currentUser].total.toFixed(2);
    }
    updateGrandTotal();
}

function addExpense() {
    if (!currentUser) {
        showMessage('Please select a user first.');
        return;
    }

    const expenseName = document.getElementById('expense-name').value.trim();
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);

    if (expenseName && !isNaN(expenseAmount) && expenseAmount > 0) {
        users[currentUser].expenses.push({ name: expenseName, amount: expenseAmount });
        users[currentUser].total += expenseAmount;
        document.getElementById('expense-name').value = '';
        document.getElementById('expense-amount').value = '';

        loadUserExpenses();
    } else {
        showMessage('Please enter valid expense details.');
    }
}

function updateGrandTotal() {
    const grandTotalDisplay = document.getElementById('grand-total');
    let grandTotal = 0;
    for (let user in users) {
        grandTotal += users[user].total;
    }
    grandTotalDisplay.textContent = grandTotal.toFixed(2);
}

function clearData() {
    users = {};
    currentUser = '';
    document.getElementById('user-select').innerHTML = '<option value="">Select User</option>';
    document.getElementById('current-user').textContent = '';
    document.getElementById('expense-list').innerHTML = '';
    document.getElementById('total-expenses').textContent = '0.00';
    document.getElementById('grand-total').textContent = '0.00';

    // Clear the local storage
    localStorage.removeItem('users');
}

function saveData() {
    const userData = JSON.stringify(users);
    localStorage.setItem('users', userData);
    alert('Data saved successfully!');
}

// Load data on page load
window.onload = function() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
        for (const user in users) {
            const userSelect = document.getElementById('user-select');
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            userSelect.appendChild(option);
        }
        updateGrandTotal();
    }
};
