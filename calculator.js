// Global Declarations
let display = document.getElementById("disp_out");
let history = document.getElementById("history_out");
let cycleComplete = "false";
let rootLength;
let SquareValue = 0;
let operators = ["+", "-", "*", "/", "%"];
// SEND FUNCTION WHICH GETS VALUES FROM THE USER
function send(i) {
  let display = document.getElementById("disp_out");
  let expression = display.value;
  let cursorPos = display.selectionStart;
  const lastChar = expression.charAt(expression.length - 1);
  const isFirstChar = expression.length === 0;
  if (isOperator(i) && isFirstChar && !isAllowedAsFirstChar(i)) {
    return;
  }
  if (i === ")" && isFirstChar) {
    return;
  }
  // BACKSPACE
  if (i === "delete") {
    if (cursorPos > 0) {
      expression =
        expression.slice(0, cursorPos - 1) + expression.slice(cursorPos);
      cursorPos--;
    }
    display.value = expression;
    display.selectionStart = cursorPos;
    display.selectionEnd = cursorPos;
    return;
  }
  // ERRORS that needs to replaced
  if (
    expression.includes("ERROR") ||
    expression.includes("NaN") ||
    expression.includes("Infinity") ||
    expression.includes("Invalid operator") ||
    expression.includes("Unexpected end of input") ||
    expression.includes("undefined") ||
    expression.includes("Unexpected number") ||
    expression.includes("undefined")
  ) {
    expression = expression
      .replace("ERROR", "")
      .replace("NaN", "")
      .replace("Infinity", "")
      .replace("Invalid operator", "")
      .replace("Unexpected end of input", "")
      .replace("undefined", "")
      .replace("Unexpected number", "")
      .replace("undefined", "")
      .replace(" ", "");
  }

  // PREVENT CONSEQUTIVE OPERATORS
  if (isOperator(lastChar) && isOperator(i)) {
    return;
  }

  // Prevent multiple decimal points or invalid decimal number
  if (i === ".") {
    if (expression.includes(".") || !isDecimalAllowed(i, expression)) {
      return;
    }
  }
  if (cycleComplete === "true") {
    if (
      i === "+" ||
      i === "-" ||
      i === "*" ||
      i === "/" ||
      i === "%" ||
      i === "^" ||
      i === "." ||
      i === "√" ||
      i === "("
    ) {
      expression =
        expression.slice(0, cursorPos) + i + expression.slice(cursorPos);
      display.value = expression;
      cycleComplete = "false";
    } else {
      display.value = i;
      cycleComplete = "false";
    }
  } else {
    expression =
      expression.slice(0, cursorPos) + i + expression.slice(cursorPos);
    display.value = expression;
  }
  cursorPos++;
  display.selectionStart = cursorPos;
  display.selectionEnd = cursorPos;
  display.focus();
  display.scrollLeft = display.scrollWidth;
}

// VALIDATION OF INPUTS
function isDecimalAllowed(keyPressed, currentValue) {
  const currentOperand = getCurrentOperand(currentValue);
  if (keyPressed === ".") {
    if (currentOperand === "" || currentOperand.includes(".")) {
      return false;
    }
  }
  return true;
}
// Current operand values
function getCurrentOperand(expression) {
  const operators = ["+", "-", "*", "/", "%", "(", ")", ".", "^", "√"];
  let operand = "";

  for (let i = expression.length - 1; i >= 0; i--) {
    const char = expression[i];
    if (!operators.includes(char)) {
      operand = char + operand;
    } else {
      break;
    }
  }
  return operand;
}

function isAllowedAsFirstChar(char) {
  const allowedFirstChars = ["-", "(", ".", "√"];
  return allowedFirstChars.includes(char);
}

function isOperator(char) {
  const operators = ["+", "-", "*", "/", "%", ".", "^"];
  return operators.includes(char);
}

//CALCULATOR LOGIC

function Calci() {
  let display = document.getElementById("disp_out");
  let expression = display.value;
  let result;
  if (expression === "ERROR") {
    return;
  }
  // Checking count of  Parantheses
  const { opening, closing } = countParentheses(expression);
  if (opening !== closing) {
    displayError("ERROR");
    return;
  }
  // null values
  if (display.value === "") {
    return "";
  }
  try {
    checkInvalidCombinations(expression);
    result = calculate();
    display.value = result;
    cycleComplete = "true";
    DisplayHistory(expression, result);
  } catch (error) {
    display.value = "ERROR";
  }
}

function calculate() {
  let a;
  let expression = display.value;
  expression = ImplicitMultiply(expression);
  console.log("expression.......", expression);
  a = expression;

  // when = is pressed without any operand
  if (expression === "" || expression.trim() === "=") {
    display.value = "";
    history.value = "";
    return;
  }
  expression = display.value.split(" ").join("");
  if (expressionHasEndingOperator(expression)) {
    throw new Error("Invalid expression");
  }
  return BodmasCalculation(a);
}

// Checking for Ending Operators
function expressionHasEndingOperator(expression) {
  const operators = ["*", "/", "+", "-", "%", ".", "√", "^"];
  return operators.includes(expression[expression.length - 1]);
}
// Parantheses Count
function countParentheses(expression) {
  let openingParenthesesCount = 0;
  let closingParenthesesCount = 0;

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    if (char === "(") {
      openingParenthesesCount++;
    } else if (char === ")") {
      closingParenthesesCount++;
    }
  }
  return { opening: openingParenthesesCount, closing: closingParenthesesCount };
}
//Bodmas Calculation Logic

function CheckParanthesis(token) {
  return token === "(" || token === ")";
}
function ValidOperator(token) {
  return (
    token === "+" ||
    token === "-" ||
    token === "*" ||
    token === "/" ||
    token === "%" ||
    token === "^" ||
    token === "√"
  );
}
function Precedence(operator) {
  switch (operator) {
    case "+":
    case "-":
      return 1;
    case "*":
    case "/":
    case "%":
    case "^":
    case "√":
      return 2;
    default:
      return 0;
  }
}
function DoCalculate(operator, operand1, operand2) {
  let result = 0;

  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      return operand1 * operand2;
    case "/":
      if (operand2 == 0) {
        throw new Error("ERROR");
      } else {
        return operand1 / operand2;
      }
    case "%":
      if (operand2 == 0) {
        throw new Error("ERROR");
      } else {
        return operand1 % operand2;
      }
    case "^":
      result = power(operand1, operand2);

      return result;
    case "√":
      for (let i = 0; i < rootLength; ++i) {
        if (i === rootLength) {
          rootLength = 0;
        } else {
          operand2 = calculateSquareRoot(operand2);
          SquareValue = operand2;
        }
      }

      result = SquareValue;
      return result;
    default:
      return 0;
  }
}
function isDigit(char) {
  return char >= "0" && char <= "9";
}
function BodmasCalculation(expression) {
  console.log("evaluate ex", expression);
  let rootStartPosition = expression.indexOf("√");
  let rootEndPosition = expression.lastIndexOf("√");
  let totalRootValue = expression.substring(
    rootStartPosition,
    rootEndPosition + 1
  );
  rootLength = totalRootValue.length;
  const ChangeExpression = ChangedExpression(expression);
  const tokens = tokenizeExpression(ChangeExpression);
  const PostTokens = infixToPostfix(tokens);
  const result = evaluatePostfix(PostTokens);
  return result;
}
function isNumber(token) {
  return !isNaN(parseFloat(token));
}
function ChangedExpression(expression) {
  let ChangeExpression = "";
  let currentToken = "";
  let previousToken = "";
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    if (ValidOperator(char) || CheckParanthesis(char)) {
      if (currentToken !== "") {
        ChangeExpression += currentToken + " ";
        currentToken = "";
      }

      if (
        char === "-" &&
        (i === 0 ||
          ValidOperator(previousToken) ||
          CheckParanthesis(previousToken))
      ) {
        currentToken += char;
      } else {
        ChangeExpression += char + " ";
      }
    } else {
      currentToken += char;
    }
    previousToken = char;
  }

  if (currentToken !== "") {
    ChangeExpression += currentToken + " ";
  }
  return ChangeExpression.trim();
}
function calculateSquareRoot(number) {
  if (number < 0) {
    throw new Error("ERROR");
  }
  if (number === 0) {
    return 0;
  }
  let guess = number / 2;
  const precision = 0.000001;
  let previousGuess;
  let diff;
  do {
    previousGuess = guess;
    guess = (guess + number / guess) / 2;
    diff = previousGuess - guess;
  } while (previousGuess !== guess && (diff < -precision || diff > precision));
  return guess;
}
function tokenizeExpression(expression) {
  let tokens = expression.split(" ");
  tokens = tokens.filter((token) => token !== "");
  return tokens;
}
function power(base, exponent) {
  if (exponent === 0) {
    return 1;
  } else {
    return base * power(base, exponent - 1);
  }
}
function infixToPostfix(infixTokens) {
  let PostTokens = [];
  let operatorStack = [];

  for (let i = 0; i < infixTokens.length; i++) {
    const token = infixTokens[i];

    if (isNumber(token)) {
      PostTokens.push(token);
    } else if (ValidOperator(token)) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "(" &&
        Precedence(operatorStack[operatorStack.length - 1]) >= Precedence(token)
      ) {
        PostTokens.push(operatorStack.pop());
      }
      operatorStack.push(token);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        PostTokens.push(operatorStack.pop());
      }
      operatorStack.pop();
    }
  }
  while (operatorStack.length > 0) {
    PostTokens.push(operatorStack.pop());
  }
  return PostTokens;
}
function evaluatePostfix(PostTokens) {
  let operandStack = [];

  for (let i = 0; i < PostTokens.length; i++) {
    const token = PostTokens[i];

    if (isNumber(token)) {
      operandStack.push(parseFloat(token));
    } else if (ValidOperator(token)) {
      const operand2 = operandStack.pop();
      const operand1 = operandStack.pop();
      const result = DoCalculate(token, operand1, operand2);
      operandStack.push(result);
    }
  }

  return operandStack[0];
}

// CLEAR BUTTON
function ClearAll() {
  currentExpression = "";
  disp_out.value = "";
}
function displayError(message) {
  document.getElementById("disp_out").value = message;
}
// ENTER KEY
const EnterdispOut = document.getElementById("disp_out");
EnterdispOut.addEventListener("keydown", function (event) {
  if (EnterdispOut.value === "ERROR" && event.key === "Enter") {
    return "";
  }
  if (event.key === "Enter") {
    event.preventDefault();
    Calci();
  }
});
// CURSOR FOCUS
var dispOutField1 = document.getElementById("disp_out");
dispOutField1.focus();
dispOutField1.addEventListener("blur", function () {
  dispOutField1.focus();
});
// HISTORY BAR
function DisplayHistory(expression, result) {
  let ul = document.getElementById("ul");
  let li = document.createElement("li");
  li.innerHTML = `${expression}   =   ${result}`;
  if (expression === "ERROR" || expression == result) {
    return "";
  } else {
    ul.prepend(li);
  }
  scrollToBottom();
}
function scrollToBottom() {
  const container = document.getElementById("history_out");
  container.scrollToBottom = container.scrollHeight;
}
//DISPLAY LI ELEMENT
var listItems = document.getElementById("ul");
listItems.addEventListener("click", (event) => {
  let text = event.target.innerText;
  showSelectedElement(text);
});
function showSelectedElement(content) {
  const output = document.getElementById("disp_out");
  const equation = content.split("=");
  const value = equation[0];
  output.value = value;
}

// Keyboard Events
const aEnterdispOut = document.getElementById("disp_out");
aEnterdispOut.addEventListener("keypress", function (event) {
  const allowedCharacters = "1234567890()/*-+^%.";
  if (!allowedCharacters.includes(event.key)) {
    event.preventDefault();
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    Calci();
  } else if (event.key === "Backspace") {
    send("delete");
  } else {
    event.preventDefault();
    send(event.key);
  }
});

// CHECK VALID COMBINATIONS
function checkInvalidCombinations(expression) {
  const invalidCombinations = ["()", "(*)", "(/)", "(-)", "(+)", "(%)"];

  for (const combination of invalidCombinations) {
    if (expression.includes(combination)) {
      throw new Error("ERROR");
    }
  }
}
// Handle the paste event (ALLOWS ONLY NUMBERS & OPERATORS TO BE PASTED)
const inputField = document.getElementById("disp_out");
inputField.addEventListener("paste", (event) => {
  event.preventDefault();

  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData("text");
  let filteredText = "";
  for (let i = 0; i < pastedText.length; i++) {
    const char = pastedText[i];
    if (!isNaN(char) || "+-*/.()%^".includes(char)) {
      filteredText += char;
    }
  }
  filteredText = filteredText.split(" ").join("");
  document.execCommand("insertText", false, filteredText);
});

// TO ADD IMPLICIT MULTIPLY NEAR BRACKETS
function checkOperator(char) {
  return ["*", "/", "-", "+", "%"].includes(char);
}
function ImplicitMultiply(expression) {
  let a = expression.split("");
  // Logic to add * before  (  and after )
  for (let i = 0; i < expression.length; i++) {
    if (a[i] === ")" && a[i + 1] === "(") {
      a[i + 1] = "*(";
    } else if (
      a[i] === ")" &&
      !checkOperator(a[i + 1]) &&
      a[i + 1] !== ")" &&
      i !== expression.length - 1
    ) {
      a[i] = ")*";
    } else if (a[i] === "(" && a[i + 1] === "(") {
      a[i] = "(";
    } else if (isDigit(a[i]) && a[i + 1] === "(") {
      a[i] = a[i] + "*";
    } else {
    }
  }
  let add = a.join("");
  // console.log(add);
  return add;
}
