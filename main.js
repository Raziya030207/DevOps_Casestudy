window.addEventListener("load", () => {
  const list = document.getElementById("list");
  const createBtn = document.getElementById("create");
  const todoInput = document.getElementById("todo-input");
  const completedCount = document.getElementById("completed-count");
  const totalCount = document.getElementById("total-count");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
    updateStats();
  };

  const updateStats = () => {
    const completed = todos.filter(t => t.complete).length;
    completedCount.textContent = completed;
    totalCount.textContent = todos.length;
  };

  const renderTodos = () => {
    list.innerHTML = "";
    todos.forEach((t, i) => {
      const item = document.createElement("div");
      item.classList.add("item");
      if (t.complete) item.classList.add("complete");

      item.innerHTML = `
        <input type="checkbox" ${t.complete ? "checked" : ""}>
        <input type="text" value="${t.content}" ${t.editing ? "" : "disabled"}>
        <div class="actions">
          <button class="material-icons edit-btn">edit</button>
          <button class="material-icons remove-btn">delete</button>
        </div>
      `;

      const checkbox = item.querySelector('input[type="checkbox"]');
      const textInput = item.querySelector('input[type="text"]');
      const editBtn = item.querySelector(".edit-btn");
      const removeBtn = item.querySelector(".remove-btn");

      checkbox.addEventListener("change", () => {
        todos[i].complete = checkbox.checked;
        saveTodos();
        renderTodos();
      });

      editBtn.addEventListener("click", () => {
        if (textInput.disabled) {
          textInput.disabled = false;
          textInput.focus();
          editBtn.textContent = "save";
        } else {
          todos[i].content = textInput.value;
          textInput.disabled = true;
          editBtn.textContent = "edit";
          saveTodos();
        }
      });

      removeBtn.addEventListener("click", () => {
        todos.splice(i, 1);
        saveTodos();
        renderTodos();
      });

      list.appendChild(item);
    });
    updateStats();
  };

  const addTodo = () => {
    const content = todoInput.value.trim();
    if (content) {
      todos.push({ content, complete: false });
      todoInput.value = "";
      saveTodos();
      renderTodos();
    }
  };

  createBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTodo();
  });

  renderTodos();
});
