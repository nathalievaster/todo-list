# Todo-applikation i TypeScript

Detta är en enkel men funktionell "att göra"-applikation byggd med TypeScript, HTML och CSS. Applikationen låter användaren skapa uppgifter, markera dem som klara, ta bort dem samt lagrar dessa i webbläsarens LocalStorage så att informationen finns kvar mellan sidvisningar.

---


## Funktioner

- Lägg till nya todos med prioritet  
- Markera todos som klara  
- Visa datum då todos skapades och när de markerades som klara  
- Ta bort todos  
- Validering av inmatade uppgifter  
- Automatisk sparning i LocalStorage

---

## Teknisk beskrivning

### Interface: `Todo`

Todo definieras som ett TypeScript-interface med följande egenskaper:

- `task`: sträng som beskriver uppgiften  
- `completed`: boolean som anger om uppgiften är klar  
- `priority`: ett heltal (`1`, `2` eller `3`)  
- `createdAt`: datum och tid då todo skapades  
- `completedAt`: datum och tid då todo markerades som klar

---

### Klass: `TodoList`

Logiken för todo-hantering ligger i klassen `TodoList`. Den har följande metoder:

#### `addTodo(task: string, priority: number): boolean`  
Lägger till en ny todo. Returnerar `false` vid ogiltig inmatning.

#### `markTodoCompleted(index: number): void`  
Markerar en todo som klar och sparar tidpunkten.

#### `deleteTodo(index: number): void`  
Tar bort en todo från listan.

#### `getTodos(): Todo[]`  
Returnerar en kopia av todo-listan sorterad efter prioritet.

#### `saveToLocalStorage(): void`  
Sparar todo-listan i webbläsarens LocalStorage.

#### `loadFromLocalStorage(): void`  
Läser in todos från LocalStorage och validerar datan.

---

## DOM-hantering

- Visar todos i en lista  
- Renderar olika element dynamiskt (checkboxar, knappar, tidsstämplar)  
- Lyssnar på formulärinmatning och användarinteraktioner  
- Använder klassen `TodoList` för att hantera all data

---


## Ladda ner eller klona projektet till din dator:

```bash
git clone https://github.com/ditt-användarnamn/todo-typescript.git
cd todo-typescript
