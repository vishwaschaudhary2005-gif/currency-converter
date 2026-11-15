
const result = document.getElementById("result");
const previous = document.getElementById("previous");
const buttons = document.querySelector(".buttons");

let currentInput = "0";
let storedValue = null;
let operator = null;
let waitingForOperand = false;

function updateDisplay() {
    result.value = currentInput;
}

function inputNumber(number) {
    if (currentInput === "Error" || waitingForOperand) {
        currentInput = number;
        waitingForOperand = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (currentInput === "Error" || waitingForOperand) {
        currentInput = "0.";
        waitingForOperand = false;
    } 
    else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    if (currentInput === "Error") return;

    const inputValue = Number(currentInput);

    if (operator && !waitingForOperand) {
        const calculation = calculate(
            storedValue,
            inputValue,
            operator
        );

        if (calculation === null) {
            showError();
            return;
        }

        currentInput = String(calculation);
        storedValue = calculation;
        updateDisplay();
    } else {
        storedValue = inputValue;
    }

    operator = nextOperator;
    waitingForOperand = true;

    previous.textContent =
        `${storedValue} ${getSymbol(operator)}`;
}

function calculate(a, b, op) {
    let answer;

    switch (op) {
        case "+":
            answer = a + b;
            break;

        case "-":
            answer = a - b;
            break;

        case "*":
            answer = a * b;
            break;

        case "/":
            if (b === 0) return null;
            answer = a / b;
            break;

        default:
            return b;
    }

    if (!Number.isFinite(answer)) return null;

    // Avoid displaying floating-point precision errors.
    return Number(answer.toPrecision(12));
}

function getSymbol(op) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[op];
}

function showError() {
    currentInput = "Error";
    storedValue = null;
    operator = null;
    waitingForOperand = true;
    previous.textContent = "Invalid calculation";
    updateDisplay();
}

function performCalculation() {
    if (
        operator === null ||
        storedValue === null ||
        currentInput === "Error" ||
        waitingForOperand
    ) {
        return;
    }

    const firstValue = storedValue;
    const secondValue = Number(currentInput);
    const selectedOperator = operator;

    const answer = calculate(
        firstValue,
        secondValue,
        selectedOperator
    );

    if (answer === null) {
        showError();
        return;
    }

    previous.textContent =
        `${firstValue} ${getSymbol(selectedOperator)} ${secondValue} =`;

    currentInput = String(answer);
    storedValue = null;
    operator = null;
    waitingForOperand = true;

    updateDisplay();
}

function clearCalculator() {
    currentInput = "0";
    storedValue = null;
    operator = null;
    waitingForOperand = false;
    previous.textContent = "";
    updateDisplay();
}

function deleteDigit() {
    if (currentInput === "Error" || waitingForOperand) {
        currentInput = "0";
        waitingForOperand = false;
    } else if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);

        if (currentInput === "-") {
            currentInput = "0";
        }
    } else {
        currentInput = "0";
    }

    updateDisplay();
}

function toggleSign() {
    if (currentInput === "Error") return;

    if (Number(currentInput) !== 0) {
        currentInput = currentInput.startsWith("-")
            ? currentInput.slice(1)
            : "-" + currentInput;
    }

    updateDisplay();
}

// Event delegation: handle clicks on all calculator buttons.
buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteDigit();
            break;

        case "decimal":
            inputDecimal();
            break;

        case "sign":
            toggleSign();
            break;

        case "calculate":
            performCalculation();
            break;
    }
});

// Optional keyboard support.
document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
    } else if (key === ".") {
        inputDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        performCalculation();
    } else if (key === "Backspace") {
        deleteDigit();
    } else if (key === "Escape") {
        clearCalculator();
    }
});

