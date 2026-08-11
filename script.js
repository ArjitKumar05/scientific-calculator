const display = document.getElementById("display");

// Add value to display
function appendValue(value) {
  display.value += value;
}

// Clear calculator
function clearDisplay() {
  display.value = "";
}

// Delete last character
function deleteLast() {
  display.value = display.value.slice(0, -1);
}

// Add scientific function
function appendFunction(func) {
  display.value += func + "(";
}

// Square root
function squareRoot() {
  display.value += "sqrt(";
}

// Square
function square() {
  if (display.value !== "") {
    display.value = "(" + display.value + ")^2";
  }
}

// Calculate result
function calculate() {
  try {
    let expression = display.value;

    // Percentage
    expression = expression.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

    // Square root
    expression = expression.replace(/sqrt\(/g, "Math.sqrt(");

    // Square
    expression = expression.replace(/\^2/g, "**2");

    // SIN - Degree
    expression = expression.replace(
      /sin\(([^()]*)\)/g,
      "Math.sin(Math.PI/180*($1))",
    );

    // COS - Degree
    expression = expression.replace(
      /cos\(([^()]*)\)/g,
      "Math.cos(Math.PI/180*($1))",
    );

    // TAN - Degree
    expression = expression.replace(
      /tan\(([^()]*)\)/g,
      "Math.tan(Math.PI/180*($1))",
    );

    // LOG base 10
    expression = expression.replace(/log\(([^()]*)\)/g, "Math.log10($1)");

    // Calculate
    let result = eval(expression);

    // Check result
    if (!Number.isFinite(result)) {
      throw new Error("Invalid calculation");
    }

    // Remove unnecessary decimal digits
    result = Number(result.toFixed(10));

    // Show result
    display.value = result;
  } catch (error) {
    display.value = "Error";

    setTimeout(() => {
      display.value = "";
    }, 1500);
  }
}

// Keyboard support
document.addEventListener("keydown", function (event) {
  const key = event.key;

  // Numbers and operators
  if (
    (key >= "0" && key <= "9") ||
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/" ||
    key === "." ||
    key === "%"
  ) {
    appendValue(key);
  }

  // Enter
  else if (key === "Enter") {
    calculate();
  }

  // Backspace
  else if (key === "Backspace") {
    deleteLast();
  }

  // Escape
  else if (key === "Escape") {
    clearDisplay();
  }
});
