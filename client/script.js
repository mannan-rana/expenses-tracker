document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const expenseList = document.getElementById('expense-list');

    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const description = descriptionInput.value;
        const amount = amountInput.value;

        if (description && amount) {
            addExpenseToList(description, amount);
            descriptionInput.value = '';
            amountInput.value = '';
        } else {
            alert('Please fill in all fields');
        }
    });

    function addExpenseToList(description, amount) {
        const listItem = document.createElement('li');
        listItem.textContent = `${description}: $${amount}`;
        expenseList.appendChild(listItem);
    }
});
