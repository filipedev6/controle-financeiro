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

const addTransactionIntoDOM = ({amount, name, id}) => {
    const operator = amount < 0 ? '-' : '+';
    const CSSClass = amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(amount);
    const li = document.createElement('li');

    li.classList.add(CSSClass);
    li.innerHTML = `
        ${name}
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
    `

    transactionUl.append(li)
}

const getExpanses = (transactionsAmount) => {
    return Math.abs(transactionsAmount
        .filter(amountValue => amountValue < 0)
        .reduce((acc, amountValue) => acc + amountValue, 0))
        .toFixed(2);
}

const getIncome = (transactionsAmount) => {
    return transactionsAmount
        .filter(amountValue => amountValue > 0)
        .reduce((acc, amountValue) => acc + amountValue, 0)
        .toFixed(2)
}

const getTotal = (transactionsAmount) => {
    return transactionsAmount
        .reduce((acc, transaction) => acc + transaction, 0)
        .toFixed(2)
}

const updateBalanceValues = () => {
    const transactionsAmount = transactions.map(({amount}) => amount);
    const total = getTotal(transactionsAmount);
    const income = getIncome(transactionsAmount);
    const expanse = getExpanses(transactionsAmount);

    balanceDisplay.textContent = `R$ ${total}`;
    icomeDisplay.textContent = `R$ ${income}`;
    expanseDisplay.textContent = `R$ ${expanse}`;
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
    if(event.target === event.currentTarget){
        containerAlert.classList.remove('ativo')
    }
}

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.floor(Math.random() * 100);

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
}

const handleFormSubmit = (event) => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if(isSomeInputEmpty){
        handleAlert('Por favor, preencha os campos necessarios.');
        return;
    }

    addToTransactionsArray(transactionName, transactionAmount)
    init();
    updateLocalStorage();
    cleanInputs();
}

form.addEventListener('submit', handleFormSubmit)