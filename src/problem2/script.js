// Fetch currency and price data from given URL
async function fetchData() {
    try {
        const response = await fetch('https://interview.switcheo.com/prices.json'); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error fetching currency data:', error); 
        return null; 
    }
}


let exchangeRates = {};
let currencyData = null; 
let tokenImages = {}; 


// Add currencies
function populateCurrencyDropdown(data, index) {
    const currencyDropdown = document.getElementById(index); 
    for (const row in data) {
        const option = document.createElement('option');  
        option.value = data[row].currency; 
        option.textContent = data[row].currency; 
        currencyDropdown.appendChild(option); 
    }
}


window.onload = async function() {
    currencyData = await fetchData(); 
    if (currencyData && tokenImages) {
        populateCurrencyDropdown(currencyData, 'fromCurrencyDropdown'); 
        populateCurrencyDropdown(currencyData, 'toCurrencyDropdown'); 
        getExchangeRates(currencyData); 
    } else {
        console.error('Error fetching currency data:', error); 
    }
}


function getExchangeRates(data) {
    data.forEach(item => {
        exchangeRates[item.currency] = item.price; 
    })
}

// Get input elements
let amountInput = document.getElementById('fromAmount'); 
let amountOutput = document.getElementById('toAmount'); 
let fromCurrencyDropdown = document.getElementById('fromCurrencyDropdown');
let toCurrencyDropdown = document.getElementById('toCurrencyDropdown'); 


function convertCurrency(amount, exchangeRates, fromCurrency, toCurrency) {
    const fromCurrencyPrice = exchangeRates[fromCurrency]; 
    const toCurrencyPrice = exchangeRates[toCurrency]; 
    
    // ensure there is valid exchange rates for both currencies, and there's an amount to convert
    if (fromCurrencyPrice && toCurrencyPrice) {
        amountConverted = (amount * fromCurrencyPrice) / toCurrencyPrice; 
        return amountConverted; 
    } else {
        console.error('Sorry! Exchange rate is not available for either one or both of the currencies.')
        return null; 
    }
}


function updateConversionAndExchangeRate() {
    const amountToConvert = amountInput.value; 

    if (!isNaN(amountToConvert)) {
        amountOutput.value = convertCurrency(amountToConvert, exchangeRates, fromCurrencyDropdown.value, toCurrencyDropdown.value); 
        const exchangeRate = exchangeRates[fromCurrencyDropdown.value] / exchangeRates[toCurrencyDropdown.value]; 
        const sentence = `1 ${fromCurrencyDropdown.value} equals ${exchangeRate.toFixed(3)} ${toCurrencyDropdown.value}`; 
        document.getElementById(`exchangeRate`).textContent = sentence;
        document.getElementById(`errorText`).textContent = "";  
    } else {
        document.getElementById(`errorText`).textContent = "Please key in a valid number to convert from."; 
    }
}

function swapCurrencies() {
    let tempCurrencyValue = fromCurrencyDropdown.value; 
    fromCurrencyDropdown.value = toCurrencyDropdown.value; 
    toCurrencyDropdown.value = tempCurrencyValue; 

    updateConversionAndExchangeRate(); 
}

amountInput.addEventListener('input', updateConversionAndExchangeRate); 
fromCurrencyDropdown.addEventListener('change', updateConversionAndExchangeRate); 
toCurrencyDropdown.addEventListener('change', updateConversionAndExchangeRate); 
document.getElementById('swapCurrencies').addEventListener('click', swapCurrencies); 
