import { useReducer, useRef, useEffect } from "react"
import { v4 as uuid } from "uuid"
import './App.css'

enum Actions {
    ADD_TASK, REMOVE_TASK, CHECK_TASK
}

type Task = {
    id: string;
    title: string;
    checked: boolean;
}

type ActionTaks = {
    task?: Task;
    type: Actions;
    title?: string;
};

const inital_tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]")

const reducer = (state: Task[], action: ActionTaks): Task[] => {

    const { type, title, task } = action;

    if (type === Actions.ADD_TASK && title && title.length > 2) {
        const newState = [
            {
                id: uuid(),
                title,
                checked: false
            },
            ...state
        ];
        localStorage.setItem("tasks", JSON.stringify(newState))
        return newState
    }

    if (type === Actions.CHECK_TASK && task) {

        const newState = state.map((t: Task) =>
            t.id !== task.id
            ? t
            : {
                ...t,
                checked: !t.checked
            }
        );

    localStorage.setItem("tasks", JSON.stringify(newState))
    return newState
    }

    if (type === Actions.REMOVE_TASK && task) {
        const newState = state.filter((t: Task) => t.id !== task.id)
        localStorage.setItem("tasks", JSON.stringify(newState))
        return newState
    }

    return state
}

function App() {

    const [tasks, dispatch] = useReducer(reducer, inital_tasks)
    const new_task = useRef<HTMLInputElement>(null)

    const addTasks = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        dispatch({
            title: new_task.current?.value,
            type: Actions.ADD_TASK
        })

        if (new_task.current) new_task.current.value = ""
    }

    const handlerCheck = (task: Task) => {
        dispatch({
            task, type: Actions.CHECK_TASK
        })
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

    return (
        <main>
            <header>
                <h1># Blank</h1>
                <span>Simple, sencillo y útil.</span>
            </header>

            <form onSubmit={addTasks} className='new-task'>
                <input type="submit" value="✔️" />
                <input type="text" ref={new_task} placeholder="Titulo de tu tarea" />
            </form>

            <section className='tasks'>
                <ul>
                    {tasks.length === 0 && (
                        <span className='empty-message'>No tienes tareas</span>
                    )}
                    {tasks.map((task) => (
                        <li key={task.id} id={task.id} className='task'>
                            <button onClick={() => {
                                dispatch({
                                    task,
                                    type: Actions.REMOVE_TASK
                                })
                            }} className='delete'>🗑️</button>
                            <input
                                type="checkbox"
                                checked={task.checked}
                                className='check'
                                onChange={() => {
                                    handlerCheck(task)
                                }} />
                            <span id={`text-${task.id}`}>{task.title}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    )
}

export default App
