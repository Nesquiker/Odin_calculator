let current_inputs = "";
let has_dot = false;

function generateButtons (container) {
	const button_defs = ["+","-","*","/","1","2","3","4","5","6","7","8","9","0",".","del"];
	let count = 0;
	let row;	
	for (let b of button_defs) {
		if (count === 0) {
			row = document.createElement("div");
			row.classList.add("row");
		}
		const button = document.createElement("button");
		button.classList.add("button");
		button.textContent = b;
		row.appendChild(button);
		button.addEventListener("click", addContent);
		count++;
		if (count === 4) {
			container.appendChild(row);
			count = 0;
		}
	}
	container.appendChild(row);
}

function addContent(e) {
	let t = e.target.textContent;
	if (t === "del") {
		current_inputs = "";
		compute(e);
		return;
	}
	const numbers = "0123456789";
	let is_num = numbers.includes(t);
	const size = current_inputs.length;
	if (size === 0) {
		if (t === ".") {
			has_dot = true;
			current_inputs += t;
		}
		else if (is_num) {
			current_inputs += t;
		}
	} else if (is_num) {
		const prev = current_inputs[size - 1];
		if (prev === "0" && size === 1) {
			current_inputs = t;
		} else {
			current_inputs += t;
		}
	} else {
		const prev = current_inputs[size - 1];
		if (t === ".") {
			if (!has_dot) {
				current_inputs += t;
				has_dot = true;
			}
		}
		else if (numbers.includes(prev) || prev === ".") {
			current_inputs += t;
			has_dot = false;
		}
	}
	const screen = document.querySelector(".screen");
	screen.textContent = current_inputs;
}
		
function compute(e) {
	const screen = document.querySelector(".screen");
	has_dot = false;
	if (current_inputs === "") {
		screen.textContent = current_inputs;
		return;
	}
	while (current_inputs.length > 1) {
		const bounds = findBounds();
		if (bounds[1] === -1) {
			break;
		}
		const left_num = Number(current_inputs.slice(bounds[0], bounds[1]));
		const right_num = Number(current_inputs.slice(bounds[1] + 1, bounds[2]+ 1));
		const operation = current_inputs[bounds[1]];
		let replace_num = 0;
		if (operation === "+") {
			replace_num = addition(left_num, right_num);
		} else if (operation === "-") {
			replace_num = subtraction(left_num, right_num);
		} else if (operation === "*") {
			replace_num = multiply(left_num, right_num);
		} else if (operation === "/") {
			replace_num = division(left_num, right_num);
		}
		replace_num = Math.round(replace_num * 10000) / 10000;	
		let text_num = replace_num.toString();
		current_inputs = current_inputs.slice(0, bounds[0]) + text_num + current_inputs.slice(bounds[2] + 1, current_inputs.length);

	}
	screen.textContent = current_inputs;
}	 

function addition (num_1, num_2) {
	return num_1 + num_2;
}

function subtraction (num_1, num_2) {
	return num_1 - num_2;
}

function division (num_1, num_2) {
	if (num_2 === 0) {
		return 0;
	}
	return num_1 / num_2;
}

function multiply (num_1, num_2) {
	return num_1 * num_2;
}

function findBounds() {
	let mid = -1;
	let first_2 = -1;
	let first_1 = -1;
	let left = 0;
	let right = current_inputs.length - 1;
	for (let i = 0; i < current_inputs.length; i++) {
		let c = current_inputs[i];
		if (c === "*" || c === "/") {
			first_2 = i;
			left = nextOperand(first_2, -1);
			right = nextOperand(first_2, 1);
			mid = first_2;
			break;
		}
		if (c === "+" || c === "-") {
			if (first_1 === -1) {
				first_1 = i;
			}
		}
	}
	if (first_2 === -1) {
		left = nextOperand(first_1, -1);
		right = nextOperand(first_1, 1);
		mid = first_1;
	}
	return [left, mid, right];
		
}
	
function nextOperand(begin, direction) {
	let next = begin + direction;
	const operands = "-+/*";
	const size = current_inputs.length;	
	while (!operands.includes(current_inputs[next])) {
		next += direction;	
		if (next === size || next < 0) {
			break;
		}	
	}
	return next - direction;
}
			
			 

function main() {
	const container = document.querySelector(".buttons");
	generateButtons(container);
	const enter = document.querySelector(".enter");
	enter.addEventListener("click", compute);
	
}

main();
