const defaultItems = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const tasksStorageKey = "tasks";
const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const templateElement = document.getElementById("to-do__item-template");

let items = [];

function loadTasks() {
	const savedTasks = localStorage.getItem(tasksStorageKey);

	if (!savedTasks) {
		return [...defaultItems];
	}

	try {
		const parsedTasks = JSON.parse(savedTasks);
		return Array.isArray(parsedTasks) ? parsedTasks : [...defaultItems];
	} catch (error) {
		return [...defaultItems];
	}
}

function saveTasks(tasks) {
	localStorage.setItem(tasksStorageKey, JSON.stringify(tasks));
}

function getTasksFromDOM() {
	const taskTextElements = listElement.querySelectorAll(".to-do__item-text");

	return Array.from(taskTextElements, (taskTextElement) => taskTextElement.textContent);
}

function syncTasks() {
	items = getTasksFromDOM();
	saveTasks(items);
}

function setTaskEditable(textElement, isEditable) {
	textElement.setAttribute("contenteditable", String(isEditable));
}

function finishEditing(textElement) {
	setTaskEditable(textElement, false);
	syncTasks();
}

function createItem(itemName) {
	const clone = templateElement.content
		.querySelector(".to-do__item")
		.cloneNode(true);
	const textElement = clone.querySelector(".to-do__item-text");
	const editButton = clone.querySelector(".to-do__item-button_type_edit");
	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete");

	textElement.textContent = itemName;

	deleteButton.addEventListener("click", () => {
		clone.remove();
		syncTasks();
	});

	duplicateButton.addEventListener("click", () => {
		const duplicatedItem = createItem(textElement.textContent);
		listElement.prepend(duplicatedItem);
		syncTasks();
	});

	editButton.addEventListener("click", () => {
		setTaskEditable(textElement, true);
		textElement.focus();
	});

	textElement.addEventListener("blur", () => {
		finishEditing(textElement);
	});

	return clone;
}

function renderTasks(tasks) {
	listElement.replaceChildren();
	tasks.forEach((taskName) => {
		listElement.append(createItem(taskName));
	});
}

function handleFormSubmit(event) {
	event.preventDefault();

	const newTaskName = inputElement.value.trim();

	if (newTaskName === "") {
		return;
	}

	listElement.prepend(createItem(newTaskName));
	formElement.reset();
	syncTasks();
}

items = loadTasks();
renderTasks(items);
formElement.addEventListener("submit", handleFormSubmit);
