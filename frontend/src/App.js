import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoName, setEditingTodoName] = useState("");

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/todos");
      setTodos(response.data.todos);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/todos", {
        name: newTodo,
      });

      setTodos([
        ...todos,
        {
          name: data.todo.name,
          completed: data.todo.completed,
          _id: data.todo._id,
        },
      ]);

      setNewTodo("");
    } catch (error) {
      console.log("Error creating todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/todos/${id}`);

      const updatedTodos = todos.filter((todo) => todo._id !== id);

      setTodos(updatedTodos);
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.put(`http://localhost:8000/todos/${id}`, {
        completed: !getTodoById(id).completed,
      });

      const updatedTodos = todos.map((todo) => {
        if (todo._id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      });

      setTodos(updatedTodos);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  const handleStartEdit = (id, name) => {
    setEditingTodoId(id);
    setEditingTodoName(name);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:8000/todos/${id}`, {
        name: editingTodoName,
      });

      const updatedTodos = todos.map((todo) => {
        if (todo._id === id) {
          return {
            ...todo,
            name: editingTodoName,
          };
        }
        return todo;
      });

      setTodos(updatedTodos);
      setEditingTodoId(null);
      setEditingTodoName("");
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingTodoName("");
  };

  const getTodoById = (id) => {
    return todos.find((todo) => todo._id === id);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todoapp stack-large">
      <h1>What to Todo</h1>
      <form>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
            What needs to be done?
          </label>
        </h2>
        <input
          type="text"
          id="new-todo-input"
          className="input input__lg"
          name="text"
          autoComplete="off"
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
          value={newTodo}
        />
        <button
          type="submit"
          className="btn btn__primary btn__lg"
          onClick={handleClick}
        >
          Add
        </button>
      </form>

      {todos.length ? (
        <h2 id="list-heading">
          {todos.reduce((sum, todo) => {
            if (todo.completed) return sum;
            return sum + 1;
          }, 0)}{" "}
          tasks remaining
        </h2>
      ) : null}
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {todos.map((todo) => (
          <li className="todo stack-small" key={todo._id}>
            {editingTodoId === todo._id ? (
              <div>
                <input
                  type="text"
                  className="input todo-edit"
                  value={editingTodoName}
                  onChange={(e) => setEditingTodoName(e.target.value)}
                />
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn__primary"
                    onClick={() => handleUpdate(todo._id)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn__danger"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="c-cb">
                <input
                  id={`todo-${todo._id}`}
                  type="checkbox"
                  defaultChecked={todo.completed}
                  onChange={() => handleToggle(todo._id)}
                />
                <label
                  className={`todo-label ${todo.completed ? "completed" : ""}`}
                  htmlFor={`todo-${todo._id}`}
                >
                  {todo.name}
                </label>
              </div>
            )}
            <div className="btn-group">
              <button
                type="button"
                className="btn btn__danger"
                onClick={() => handleDelete(todo._id)}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn__primary"
                onClick={() => handleStartEdit(todo._id, todo.name)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
