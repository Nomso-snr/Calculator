let display = document.getElementById('display');

function appendToDisplay(value) {
    // Prevent multiple decimal points in the same number
    if (value === '.' && display.value.includes('.') && 
        !display.value.match(/[-+*/]/)) {
        return;
    }
    
    // Prevent operators at the beginning
    if (display.value === '' && ['+', '*', '/'].includes(value)) {
        return;
    }
    
    // Handle negative numbers at the beginning
    if (display.value === '' && value === '-') {
        display.value += value;
        return;
    }
    
    // Prevent multiple operators in a row
    const lastChar = display.value.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar) && 
        ['+', '-', '*', '/'].includes(value)) {
        return;
    }
    
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        // Replace × with * for evaluation
        let expression = display.value.replace(/×/g, '*');
        
        // Validate expression
        if (!isValidExpression(expression)) {
            throw new Error('Invalid expression');
        }
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Handle division by zero
        if (!isFinite(result)) {
            throw new Error('Cannot divide by zero');
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        display.value = result;
    } catch (error) {
        display.value = 'Error';
        setTimeout(() => {
            clearDisplay();
        }, 1000);
    }
}

function isValidExpression(expr) {
    // Basic validation - check if expression ends with operator or decimal
    if (/[+\-*/.]]$/.test(expr)) {
        return false;
    }
    
    // Check for invalid characters
    if (!/^[0-9+\-*/.()\s]+$/.test(expr)) {
        return false;
    }
    
    return true;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (['+', '-', '*', '/', '.'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Prevent default behavior for calculator keys
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (['+', '-', '*', '/', '=', 'Enter', 'Escape', 'c', 'C', 'Backspace'].includes(key)) {
        event.preventDefault();
    }
});