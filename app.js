const transactionUl = document.querySelector('#transactions');
const balanceDisplay = document.querySelector('#balance');
const icomeDisplay = document.querySelector('#money-plus');
const expanseDisplay = document.querySelector('#money-minus');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const containerAlert = document.querySelector('#container-alert');
const closeAlert = document.querySelector('#close-alert');
const alertMessage = document.querySelector('#alert-message');

const localStorageTransaction = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransaction : [];

const removeTransaction = ID => {
    transactions = transactions.filter((transaction) => transaction.id !== ID)
    updateLocalStorage();
    init()
}

const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+';
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(transaction.amount);
    const li = document.createElement('li');

    li.classList.add(CSSClass);
    li.innerHTML = `
        ${transaction.name}
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
    `

    transactionUl.append(li)
}

const updateBalanceValues = () => {
    const transactionsAmount = transactions.map(transaction => transaction.amount);
    const total = transactionsAmount.reduce((acc, transaction) => acc + transaction, 0).toFixed(2);
    const income = transactionsAmount.filter(amountValue => amountValue > 0)
        .reduce((acc, amountValue) => acc + amountValue, 0)
            .toFixed(2);
    const expanse = transactionsAmount.filter(amountValue => amountValue < 0)
        .reduce((acc, amountValue) => acc + amountValue, 0)
    const expanseWithoutOperator = Math.abs(expanse).toFixed(2);

    balanceDisplay.textContent = `R$ ${total}`;
    icomeDisplay.textContent = `R$ ${income}`;
    expanseDisplay.textContent = `R$ ${expanseWithoutOperator}`;
}

const init = () => {
    transactionUl.innerHTML = '';
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
}

init()

const handleAlert = (value) => {
    containerAlert.classList.add('ativo');
    alertMessage.textContent = value;

    containerAlert.addEventListener('click', toggleClosed);
    closeAlert.addEventListener('click', toggleClosed)
}

const toggleClosed = (event) => {
    if(event.target === this){
        containerAlert.classList.remove('ativo')
    }
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.floor(Math.random() * 100);

form.addEventListener('submit', event => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim()

    if(transactionName === '' || transactionAmount === ''){
        handleAlert('Por favor, preencha os campos necessarios.');
        return;
    }

    const transaction = {
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    };

    transactions.push(transaction);
    init();
    updateLocalStorage();

    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
})