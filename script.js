const display = document.getElementById("display");
let currentInput = '';
let resetNext = false;

function updateDisplay() {
  display.value = currentInput || '0';
}

function appendNumber(num) {
  if (resetNext) {
    currentInput = '';
    resetNext = false;
  }
  currentInput += num;
  updateDisplay();
}

function appendOperator(op) {
  if (resetNext) resetNext = false;
  if (/[+\-*/]$/.test(currentInput)) {
    currentInput = currentInput.slice(0, -1);
  }
  currentInput += op;
  updateDisplay();
}

function appendDecimal() {
  const parts = currentInput.split(/[\+\-\*\/]/);
  const lastPart = parts[parts.length - 1];
  if (!lastPart.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
}

function clearAll() {
  currentInput = '';
  updateDisplay();
}

function clearEntry() {
  const parts = currentInput.split(/([\+\-\*\/])/);
  if (parts.length > 1) {
    parts.pop();
    parts.pop();
    currentInput = parts.join('');
  } else {
    currentInput = '';
  }
  updateDisplay();
}

function backspace() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    currentInput = eval(currentInput).toString();
    updateDisplay();
    resetNext = true;
  } catch (e) {
    currentInput = 'Fehler';
    updateDisplay();
    resetNext = true;
  }
}

function calculatePercent() {
  try {
    const match = currentInput.match(/(.*?)([+\-*/])(\d+\.?\d*)$/);
    if (match) {
      let base = eval(match[1]);
      let operator = match[2];
      let percent = parseFloat(match[3]);
      let percentValue;

      if (operator === "+" || operator === "-") {
        percentValue = base * (percent / 100);
      } else if (operator === "*" || operator === "/") {
        percentValue = percent / 100;
      }

      currentInput = match[1] + operator + percentValue;
      updateDisplay();
    } else {
      currentInput = (eval(currentInput) / 100).toString();
      updateDisplay();
    }
  } catch (e) {
    currentInput = 'Fehler';
    updateDisplay();
    resetNext = true;
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

// Tastatursteuerung
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (!isNaN(key)) appendNumber(key);
  else if (key === ".") appendDecimal();
  else if ("+-*/".includes(key)) appendOperator(key);
  else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") backspace();
  else if (key.toLowerCase() === "c") clearAll();
  else if (key === "%") calculatePercent();
});
