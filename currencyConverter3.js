const BASE_URL ="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const amountInput = document.querySelector(".amount input");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate currency dropdowns
for (const select of dropdowns) {
  for (const currCode in countryList) {
    const option = document.createElement("option");
    option.value = currCode;
    option.textContent = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    }

    if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update country flag
const updateFlag = (element) => {
  const countryCode = countryList[element.value];
  const img = element.parentElement.querySelector("img");

  if (countryCode) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
};

// Button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Convert currency
const updateExchangeRate = async () => {
  const amtVal = Number(amountInput.value);
  if (amountInput.value.trim() === "" || !Number.isFinite(amtVal) || amtVal < 0) {
    msg.innerText = "Please enter a valid amount.";
    return;
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();
  if (from === to) {
    msg.innerText =`${amtVal} ${fromCurr.value} = ${amtVal.toFixed(2)} ${toCurr.value}`;
    return;
  }

  const URL = `${BASE_URL}/${from}.json`;
  try {
    msg.innerText = "Fetching exchange rate...";
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const rate = data[from][to];
    if (typeof rate !== "number") {
      throw new Error("Exchange rate not found.");
    }

    const finalAmount = amtVal * rate;
    msg.innerText =`${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } 
  catch (error) {
    console.error("Currency conversion failed:", error);
    msg.innerText = "Unable to fetch rate. Check your internet connection.";
  }
};

// Update when currencies change
fromCurr.addEventListener("change", updateExchangeRate);
toCurr.addEventListener("change", updateExchangeRate);

// Initial conversion
updateExchangeRate();