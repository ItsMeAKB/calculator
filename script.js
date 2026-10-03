const display = document.getElementById('display');
const history = document.getElementById('history');
const keys = document.getElementById('keys');

let current = '0';      // the number being typed
let previous = null;    // the number before the operator
let operator = null;    // + − × ÷
let overwrite = false;  // true = next digit starts a new number

function update() {
  display.textContent = current;
  history.textContent = operator ? `${previous} ${operator}` : '';
}

function isError() {
  return isNaN(parseFloat(current));
}

function inputDigit(digit) {
  if (overwrite) {
    current = digit;
    overwrite = false;
  } else {
    current = current === '0' ? digit : current + digit;
  }
}

function inputDecimal() {
  if (overwrite) {
    current = '0.';
    overwrite = false;
  } else if (!current.includes('.')) {
    current += '.';
  }
}

function chooseOperator(op) {
  if (isError()) return;
  if (operator && !overwrite) calculate(); // chain: 2 + 3 + 4
  previous = current;
  operator = op;
  overwrite = true;
}

function calculate() {
  if (operator === null || isError()) return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  if (operator === '+') result = a + b;
  if (operator === '−') result = a - b;
  if (operator === '×') result = a * b;
  if (operator === '÷') {
    if (b === 0) {
      current = 'Cannot divide by 0';
      previous = null;
      operator = null;
      overwrite = true;
      return;
    }
    result = a / b;
  }

  current = String(parseFloat(result.toFixed(10))); // avoids 0.1 + 0.2 issues
  previous = null;
  operator = null;
  overwrite = true;
}

function percent() {
  if (isError()) return;
  current = String(parseFloat(current) / 100);
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  overwrite = false;
}

function deleteLast() {
  if (overwrite || isError()) return;
  const tooShort = current.length === 1 || (current.length === 2 && current[0] === '-');
  current = tooShort ? '0' : current.slice(0, -1);
}

keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.dataset.digit) inputDigit(btn.dataset.digit);
  else if (btn.dataset.op) chooseOperator(btn.dataset.op);
  else if (btn.dataset.action === 'decimal') inputDecimal();
  else if (btn.dataset.action === 'equals') calculate();
  else if (btn.dataset.action === 'percent') percent();
  else if (btn.dataset.action === 'delete') deleteLast();
  else if (btn.dataset.action === 'clear') clearAll();

  update();
});

document.addEventListener('keydown', (e) => {
  const opMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDecimal();
  else if (opMap[e.key]) chooseOperator(opMap[e.key]);
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate(); }
  else if (e.key === '%') percent();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
  else return;

  update();
});

update();