interface Todo {
  task: string;
  completed: boolean;
  priority: 1 | 2 | 3;
  createdAt: string;
  completedAt?: string;
}

class TodoList {
  private todos: Todo[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  addTodo(task: string, priority: number): boolean {
    // Kolla om task är tom eller bara mellanslag
    // OCH om prioriteten INTE är 1, 2 eller 3
    if (!task.trim() || ![1, 2, 3].includes(priority)) {
      return false; // Ogiltig input → returnera false
    }

    // Skapa ett nytt todo-objekt som följer Todo-interfacet
    const newTodo: Todo = {
      task: task.trim(),      // Tar bort onödiga mellanslag i början/slutet
      completed: false,       // Alla nya todos är inte klara från början
      priority: priority as 1 | 2 | 3, // Typecastar till exakt 1, 2 eller 3
      createdAt: new Date().toISOString() // Lägg till skapad-datum
    };

    // Lägg till det nya todo-objektet i todos-arrayen
    this.todos.push(newTodo);

    // Spara den uppdaterade listan till localStorage
    this.saveToLocalStorage();

    // Allt gick bra → returnera true
    return true;
  }

  // Metod för att markera en todo som "klar"
  markTodoCompleted(index: number): void {
    // Kontrollera att indexet är inom giltigt intervall (inte utanför arrayen)
    if (index >= 0 && index < this.todos.length) {
      // Sätt "completed" till true för vald todo
      this.todos[index].completed = true;
      this.todos[index].completedAt = new Date().toISOString(); // Spara datum den markerades som klar
      // Spara uppdaterad lista till localStorage
      this.saveToLocalStorage();
    }
  }

  // Metod för att redigera en todo
  editTodo(index: number, newTask: string): void {
    if (newTask.trim()) {
      this.todos[index].task = newTask.trim();
      this.saveToLocalStorage();
    }
  }

  // Metod för att ta bort en todo
  deleteTodo(index: number): void {
    this.todos.splice(index, 1);
    this.saveToLocalStorage();
  }

  // Returnerar alla todos i listan (sorterade efter prioritet)
  getTodos(): Todo[] {
    return this.todos.slice().sort((a, b) => a.priority - b.priority);
  }

  // Sparar todos till webbläsarens localStorage
  saveToLocalStorage(): void {
    // Konverterar todos-arrayen till en sträng i JSON-format och sparar den
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  // Läser in todos från localStorage (om det finns några sparade)
  loadFromLocalStorage(): void {
    // Hämtar strängen från localStorage
    const saved = localStorage.getItem("todos");

    if (saved) {
      try {
        // Försöker parsa strängen till ett riktigt JavaScript-objekt (en array)
        const parsed = JSON.parse(saved);

        // Kontroll: säkerställ att det är en array
        if (Array.isArray(parsed)) {
          // Filtrera fram bara objekt som följer Todo-strukturen:
          this.todos = parsed.filter(
            (todo: any) =>
              typeof todo.task === "string" &&                // task ska vara en sträng
              typeof todo.completed === "boolean" &&          // completed ska vara boolean
              [1, 2, 3].includes(todo.priority)               // priority måste vara 1, 2 eller 3
          );
        }
      } catch {
        // Om något går fel vid parsning
        // Återställ listan till en tom array
        this.todos = [];
      }
    }
  }
}

// DOM-hantering

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

  todos.forEach((todo, index) => {
    const li = document.createElement("li"); // Skapa nytt <li>-element
    li.dataset.priority = todo.priority.toString(); // Sätt prioritet som data-attribut
    li.className = todo.completed ? "completed" : ""; // Lägg till klass om uppgiften är klar

    const label = document.createElement("label"); // Skapa en etikett för checkbox + text
    const checkbox = document.createElement("input"); // Skapa en checkbox
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed; // Bocka i om uppgiften redan är klar

    // När checkbox ändras (klickas i), markera todo som klar
    checkbox.addEventListener("change", () => {
      todoList.markTodoCompleted(index); // Uppdatera datan i TodoList
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
        todoList.deleteTodo(index);
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
