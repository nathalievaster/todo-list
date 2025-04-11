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
  

  markTodoCompleted(index: number): void {
    if (index >= 0 && index < this.todos.length) {
      this.todos[index].completed = true;
      this.saveToLocalStorage();
    }
  }


}
