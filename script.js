const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");

const modeBtn = document.getElementById("modeBtn");
const modeText = document.getElementById("modeText");

const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let expression = "";
let degreeMode = true;

function updateDisplay() {
  resultDisplay.textContent = expression || "0";
}

function formatResult(value) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  if (Math.abs(value) < 1e-12) {
    value = 0;
  }

  return String(Math.round((value + Number.EPSILON) * 1e12) / 1e12);
}

function toRadians(value) {
  return degreeMode ? (value * Math.PI) / 180 : value;
}

function fromRadians(value) {
  return degreeMode ? (value * 180) / Math.PI : value;
}

function sin(value) {
  return Math.sin(toRadians(value));
}

function cos(value) {
  return Math.cos(toRadians(value));
}

function tan(value) {
  return Math.tan(toRadians(value));
}

function asin(value) {
  return fromRadians(Math.asin(value));
}

function acos(value) {
  return fromRadians(Math.acos(value));
}

function atan(value) {
  return fromRadians(Math.atan(value));
}

function sqrt(value) {
  return Math.sqrt(value);
}

function log(value) {
  return Math.log10(value);
}

function ln(value) {
  return Math.log(value);
}

function calculateExpression(input) {
  let exp = input;

  exp = exp.replace(/π/g, "PI");
  exp = exp.replace(/\be\b/g, "E");

  exp = exp.replace(/×/g, "*");
  exp = exp.replace(/÷/g, "/");
  exp = exp.replace(/−/g, "-");

  exp = exp.replace(/√/g, "sqrt");

  exp = exp.replace(/\^/g, "**");

  if (/[;{}[\]'"`\\<>?&|:@#$%=]/.test(exp)) {
    throw new Error("Invalid expression");
  }

  return Function(
    "sin",
    "cos",
    "tan",
    "asin",
    "acos",
    "atan",
    "sqrt",
    "log",
    "ln",
    "PI",
    "E",
    `"use strict"; return (${exp})`,
  )(sin, cos, tan, asin, acos, atan, sqrt, log, ln, Math.PI, Math.E);
}

document.querySelectorAll(".number").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    expression += value;

    updateDisplay();
  });
});

document.querySelectorAll(".operator").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    if (!expression) {
      if (value === "-") {
        expression = "-";
      }
    } else {
      const last = expression[expression.length - 1];

      if (["+", "-", "*", "/"].includes(last)) {
        expression = expression.slice(0, -1) + value;
      } else {
        expression += value;
      }
    }

    updateDisplay();
  });
});

function addBracket() {
  if (!expression) {
    expression = "(";

    updateDisplay();

    return;
  }

  const open = (expression.match(/\(/g) || []).length;

  const close = (expression.match(/\)/g) || []).length;

  const last = expression[expression.length - 1];

  if (open > close && /[0-9)]/.test(last)) {
    expression += ")";
  } else {
    expression += "(";
  }

  updateDisplay();
}

document.querySelectorAll(".scientific").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.function;

    switch (action) {
      case "sin":
        expression += "sin(";
        break;

      case "cos":
        expression += "cos(";
        break;

      case "tan":
        expression += "tan(";
        break;

      case "asin":
        expression += "asin(";
        break;

      case "acos":
        expression += "acos(";
        break;

      case "atan":
        expression += "atan(";
        break;

      case "sqrt":
        expression += "sqrt(";
        break;

      case "log":
        expression += "log(";
        break;

      case "ln":
        expression += "ln(";
        break;

      case "pi":
        expression += "π";
        break;

      case "e":
        expression += "e";
        break;

      case "square":
        if (expression) {
          expression += "^2";
        }

        break;

      case "power":
        if (expression) {
          expression += "^";
        }

        break;

      case "percent":
        if (expression) {
          try {
            const value = calculateExpression(expression);

            expression = formatResult(value / 100);
          } catch {
            expression = "Error";
          }
        }

        break;
    }

    updateDisplay();
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;

    if (action === "clear") {
      expression = "";

      expressionDisplay.textContent = "";

      updateDisplay();

      return;
    }

    if (action === "delete") {
      expression = expression.slice(0, -1);

      updateDisplay();

      return;
    }

    if (action === "bracket") {
      addBracket();

      return;
    }

    if (action === "calculate") {
      calculate();
    }
  });
});

function calculate() {
  if (!expression || expression === "Error") {
    return;
  }

  try {
    let exp = expression;

    const open = (exp.match(/\(/g) || []).length;

    const close = (exp.match(/\)/g) || []).length;

    if (open > close) {
      exp += ")".repeat(open - close);
    }

    const value = calculateExpression(exp);

    const finalResult = formatResult(value);

    if (finalResult === "Error") {
      throw new Error("Calculation Error");
    }

    addHistory(`${expression} = ${finalResult}`);

    expressionDisplay.textContent = `${expression} =`;

    expression = finalResult;

    updateDisplay();
  } catch {
    expression = "Error";

    expressionDisplay.textContent = "";

    updateDisplay();
  }
}

modeBtn.addEventListener("click", () => {
  degreeMode = !degreeMode;

  if (degreeMode) {
    modeBtn.textContent = "DEG";
    modeText.textContent = "Degree Mode";
  } else {
    modeBtn.textContent = "RAD";
    modeText.textContent = "Radian Mode";
  }
});

function addHistory(text) {
  const item = document.createElement("div");

  item.className = "history-item";

  item.textContent = text;

  historyList.prepend(item);

  const empty = historyList.querySelector(".empty");

  if (empty) {
    empty.remove();
  }
}

historyBtn.addEventListener("click", () => {
  historyPanel.classList.toggle("active");
});

clearHistoryBtn.addEventListener("click", () => {
  historyList.innerHTML = `<p class="empty">No calculations yet</p>`;
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if ((key >= "0" && key <= "9") || key === ".") {
    expression += key;

    updateDisplay();

    return;
  }

  if (key === "+" || key === "-" || key === "*" || key === "/") {
    expression += key;

    updateDisplay();

    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();

    calculate();

    return;
  }

  if (key === "Backspace") {
    expression = expression.slice(0, -1);

    updateDisplay();

    return;
  }

  if (key === "Escape") {
    expression = "";

    expressionDisplay.textContent = "";

    updateDisplay();

    return;
  }

  if (key === "(" || key === ")") {
    expression += key;

    updateDisplay();
  }
});

updateDisplay();
