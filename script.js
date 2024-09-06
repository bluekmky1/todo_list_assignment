// DOM 요소 참조
const addTodoBtn = document.getElementById("add-todo-btn");
const cancelAddTodoBtn = document.getElementById("cancel-add-todo-btn");
const formContainer = document.getElementById("todo-form-container");
const form = document.getElementById("todo-form");
const addTodoInput = document.getElementById("add-todo-input");
const todoList = document.getElementById("todo-list");

// 상태 관리 변수
let todoFormVisible = false;
let todos = Array.from(JSON.parse(localStorage.getItem("todos"))) || [];

// 초기 렌더링
renderTodos();

// 이벤트 리스너 초기화
form.addEventListener("submit", handleAddTodo);
addTodoBtn.addEventListener("click", toggleInputForm);
cancelAddTodoBtn.addEventListener("click", toggleInputForm);

// 할 일 렌더링 함수
function renderTodos() {
  todoList.innerHTML = ""; // 기존 목록 초기화
  todos.forEach((todo, index) => {
    todoList.appendChild(createTodoItem(todo, index));
  });
}

// 단일 할 일 렌더링 함수
function renderSingleTodo(index) {
  todoList.replaceChild(
    createTodoItem(todos[index], index),
    todoList.children[index]
  );
}

// 할 일 추가 및 입력 폼 토글 함수
function toggleInputForm() {
  todoFormVisible = !todoFormVisible;
  formContainer.style.display = todoFormVisible ? "flex" : "none";
  addTodoBtn.style.display = todoFormVisible ? "none" : "block";
  addTodoInput.focus();
  setTimeout(() => {
    formContainer.classList.toggle("hidden", !todoFormVisible);
    addTodoBtn.classList.toggle("hidden", todoFormVisible);
  }, 10);
}

// 로컬 스토리지에 할 일 저장
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 할 일 아이템 생성 함수
function createTodoItem(todo, index) {
  const li = document.createElement("li");

  const checkbox = createCheckbox(todo, index);
  const text = createTodoText(todo);
  const buttonContainer = createButtonContainer(index);

  li.append(checkbox, text, buttonContainer);
  return li;
}

// 체크박스 생성 함수
function createCheckbox(todo, index) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => toggleComplete(index));
  return checkbox;
}

// 할 일 텍스트 생성 함수
function createTodoText(todo) {
  const span = document.createElement("span");
  span.className = `todo-text ${todo.completed ? "completed" : ""}`;
  span.textContent = todo.text;
  return span;
}

// 버튼 컨테이너 생성 함수
function createButtonContainer(index) {
  const editButton = createButton("수정", () => editTodo(index));
  const deleteButton = createButton("삭제", () => deleteTodo(index));

  const container = document.createElement("div");
  container.className = "edit-buttons";
  container.append(editButton, deleteButton);
  return container;
}

// 버튼 생성 유틸리티 함수
function createButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

// 할 일 추가 처리 함수
function handleAddTodo(event) {
  event.preventDefault();
  const todoText = addTodoInput.value.trim();
  if (todoText) {
    todos.push({ text: todoText, completed: false });
    saveTodos();
    toggleInputForm();
    renderTodos();
    addTodoInput.value = "";
  }
}

// 할 일 삭제 함수
function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

// 할 일 수정 함수
function editTodo(index) {
  const li = todoList.children[index];
  const todoText = todos[index].text;

  li.innerHTML = ""; // 기존 요소 제거

  const checkbox = createCheckbox(todos[index], index);
  checkbox.disabled = true;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = todoText;

  const saveButton = createButton("저장", () =>
    saveEditedTodo(index, editInput)
  );
  const cancelButton = createButton("취소", () => cancelEdit(index));

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "edit-buttons";
  buttonContainer.append(saveButton, cancelButton);

  li.append(checkbox, editInput, buttonContainer);
  editInput.focus();
}

// 할 일 수정 저장 함수
function saveEditedTodo(index, editInput) {
  const newText = editInput.value.trim();
  if (newText) {
    todos[index].text = newText;
    saveTodos();
    renderSingleTodo(index);
  }
}

// 할 일 수정 취소 함수
function cancelEdit(index) {
  renderSingleTodo(index);
}

// 할 일 완료 토글 함수
function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}
