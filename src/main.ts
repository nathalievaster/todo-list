// DOM-hantering
import { Todo } from "./todo.model";
import { TodoList } from "./todo-list";

// Skapa ett nytt TodoList-objekt som hanterar data
const todoList = new TodoList();

// Hämta referenser till HTML-element jag behöver arbeta med
const form = document.querySelector("#todoForm") as HTMLFormElement;
const taskInput = document.querySelector("#taskInput") as HTMLInputElement;
const priorityInput = document.querySelector("#priorityInput") as HTMLSelectElement;
const list = document.querySelector("#todoList") as HTMLUListElement;
const error = document.querySelector("#error") as HTMLParagraphElement;

// Funktion för att rendera todos i gränssnittet
function renderTodos() {
  list.innerHTML = ""; // Töm listan först

  const todos = todoList.getTodos(); // Hämta alla todos från klassen

  todos.forEach((todo) => {
    const li = document.createElement("li"); // Skapa nytt <li>-element
    li.dataset.priority = todo.priority.toString(); // Sätt prioritet som data-attribut
    li.className = todo.completed ? "completed" : ""; // Lägg till klass om uppgiften är klar

    const label = document.createElement("label"); // Skapa en etikett för checkbox + text
    const checkbox = document.createElement("input"); // Skapa en checkbox
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed; // Bocka i om uppgiften redan är klar

    // När checkbox ändras (klickas i), markera todo som klar
    checkbox.addEventListener("change", () => {
      todoList.markTodoCompleted(todo.id); // Uppdatera datan i TodoList
      renderTodos(); // Rita om listan så förändringen syns
    });

    // Lägg checkbox och text i etiketten
    label.appendChild(checkbox);
    label.append(" " + todo.task);

    // Skapa <small>-element som visar när uppgiften skapades
    const createdAt = document.createElement("small");
    createdAt.textContent = `Skapad: ${new Date(todo.createdAt).toLocaleString()}`;

    // Om uppgiften är klar, visa även när
    const completedAt = document.createElement("small");
    if (todo.completed && todo.completedAt) {
      completedAt.textContent = `Klar: ${new Date(todo.completedAt).toLocaleString()}`;
    }

    // Skapa knapp för borttagning
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", () => {
      if (confirm("Vill du ta bort uppgiften?")) {
        todoList.deleteTodo(todo.id);
        renderTodos();
      }
    });

    li.appendChild(label); // Lägg etiketten i <li>
    li.appendChild(document.createElement("br"));
    li.appendChild(createdAt);
    if (todo.completedAt) {
      li.appendChild(document.createElement("br"));
      li.appendChild(completedAt);
    }
    li.appendChild(document.createElement("br"));
    li.appendChild(deleteBtn);

    list.appendChild(li); // Lägg till <li> i todo-listan i DOM
  });
}

// När användaren klickar på "Lägg till"
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Förhindra att sidan laddas om

  const task = taskInput.value; // Hämta värdet från inputfältet
  const priority = Number(priorityInput.value); // Konvertera prioritet till ett nummer

  // Försök lägga till todo via klassen
  const success = todoList.addTodo(task, priority);

  if (!success) {
    // Ogiltig inmatning → visa felmeddelande
    error.textContent = "Fel: Vänligen fyll i uppgiften och välj en giltig prioritet (1–3).";
  } else {
    // Rensa felmeddelande, formuläret och rendera listan igen
    error.textContent = "";
    form.reset();
    renderTodos();
  }
});

// Rendera todos första gången sidan laddas
renderTodos();
