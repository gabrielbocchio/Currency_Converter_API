const getCurrencyOptions = async() => {
    const response = await fetch("https://api.exchangerate.host/symbols");

    const json = await response.json();


return json.symbols;

};

const getCurrencyRate = async(fromCurrency, toCurrency) =>{
    const currencyConvertUrl = new URL("https://api.exchangerate.host/convert");

    currencyConvertUrl.searchParams.append("from", fromCurrency);
    currencyConvertUrl.searchParams.append("to", toCurrency);

    const response = await fetch(currencyConvertUrl);
    const json = await response.json();

    return json.result
};

const appendOptionToSelect = (selectElement, optionItem) => {
    const optionElement = document.createElement("option");
    optionElement.value = optionItem.code;
    optionElement.textContent = optionItem.description;

    selectElement.appendChild(optionElement);
}


const populateSelectElement =  (selectElement, optionList) =>{
    optionList.forEach(optionItem =>{
        appendOptionToSelect(selectElement, optionItem)
    })
}

const setupCurrencies = async () => {
    const fromCurrencyElem = document.getElementById("fromCurrency");
    const toCurrencyElem = document.getElementById("toCurrency");

    const currencyOptions = await getCurrencyOptions();
    const currencies = Object.keys(currencyOptions).map(currencyKey => currencyOptions[currencyKey]);

    populateSelectElement(fromCurrencyElem, currencies);
    populateSelectElement(toCurrencyElem, currencies);
};

const setupEventListener = () => {
    const formElement = document.getElementById("convertForm")

    formElement.addEventListener("submit", async event=>{
        event.preventDefault();
      // agarro todos los elementos del formulario
        const fromCurrency = document.getElementById("fromCurrency");
        const toCurrency = document.getElementById("toCurrency");
        const amount = document.getElementById("amount");
        const convertResultElem = document.getElementById("convertResult");

      // calculo el rate haciendo otro request al api pasandole los valores seleccionados
        try {const rate = await getCurrencyRate(fromCurrency.value, toCurrency.value
            );
        const amountValue = Number(amount.value);
        const conversionResult = Number(amountValue * rate).toFixed(2);
        convertResultElem.textContent = `${amountValue} ${fromCurrency.value} = ${conversionResult} ${toCurrency.value}`
        } catch(error) {
            convertResultElem.textContent = `There was an error getting the conversion rate [${error.message}]`
            convertResultElem.classList.add("error");
        }

    });
};


setupCurrencies();
setupEventListener();