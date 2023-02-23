import './App.css';
import React from 'react';
import { useState, useEffect } from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs';

const API_URL = 'http://localhost:5000';

function App() {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const response = await fetch(API_URL + '/todos', {
        method: 'GET',
        mode: 'cors'
      })
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => console.log(error));

      setLoading(false);

      setTodos(response);
    }

    loadData();
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    }

    await fetch(API_URL + '/todos', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setTodos((prevState) => [...prevState, todo]);

    setTitle('');
    setTime('');
  }

  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const todoData = await fetch(API_URL + '/todos/' + todo.id, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setTodos((prevState) => prevState.map((todo) => todo.id === todoData.id ? todoData : todo))
  }

  const handleDelete = async (id) => {
    await fetch(API_URL + '/todos/' + id, {
      method: 'DELETE',
      mode: 'cors'
    })

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  }

  if(loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>React To-do</h1>
      </div>

      <div className="form-todo">
        <h2>Insira a sua próxima tarefa: </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input
              type="text" name="title" placeholder="Título da tarefa"
              onChange={(event) => setTitle(event.target.value)}
              value={title || ''}
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="time">Duração: </label>
            <input
              type="text" name="time" placeholder="Tempo estimado (em horas)"
              onChange={(event) => setTime(event.target.value)}
              value={time || ''}
              required
            />
          </div>

          <input type="submit" value="Criar tarefa" />
        </form>
      </div>

      <div className="list-todo">
        <p>Lista de tarefas</p>
        {todos.length === 0 && <p>Não há tarefas</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>

            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>

              <BsTrash onClick={() => handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
