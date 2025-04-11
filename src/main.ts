interface Todo {
  task: string;
  completed: boolean;
  priority: 1 | 2 | 3;
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
      priority: priority as 1 | 2 | 3 // Typecastar till exakt 1, 2 eller 3
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

      // Spara uppdaterad lista till localStorage
      this.saveToLocalStorage();
    }
  }

  // Returnerar alla todos i listan
  getTodos(): Todo[] {
    return this.todos;
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
        // Om något går fel vid parsning, t.ex. korrupt JSON
        // Återställ listan till en tom array
        this.todos = [];
      }
    }
  }
}