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

function clearEntry() {
  const parts = currentInput.split(/([\+\-\*\/])/);
  if (parts.length > 1) {
    parts.pop(); // aktueller Wert
    currentInput = parts.join('');
  } else {
    currentInput = '';
  }
  updateDisplay();
}

function clearAll() {
  currentInput = '';
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

function toggleSign() {
  try {
    const parts = currentInput.split(/([\+\-\*\/])/);
    let last = parts.pop();
    
    if (!isNaN(last) && last !== '') {
      if (last.startsWith('-')) {
        last = last.slice(1);
      } else {
        last = '-' + last;
      }
      parts.push(last);
      currentInput = parts.join('');
      updateDisplay();
    }
  } catch {
    currentInput = 'Fehler';
    updateDisplay();
    resetNext = true;
  }
}

// Darkmode
function toggleDisplayDarkMode() {
  document.getElementById('display').classList.toggle('dark');
}

function squareRoot() {
  try {
    let value = eval(currentInput);
    currentInput = Math.sqrt(value).toString();
    updateDisplay();
    resetNext = true;
  } catch {
    currentInput = 'Fehler';
    updateDisplay();
    resetNext = true;
  }
}

function inverse() {
  try {
    let value = eval(currentInput);
    currentInput = (1 / value).toString();
    updateDisplay();
    resetNext = true;
  } catch {
    currentInput = 'Fehler';
    updateDisplay();
    resetNext = true;
  }
}

function square() {
  try {
    let value = eval(currentInput);
    currentInput = Math.pow(value, 2).toString();
    updateDisplay();
    resetNext = true;
  } catch {
    currentInput = 'Fehler';
    updateDisplay();
    resetNext = true;
  }
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
