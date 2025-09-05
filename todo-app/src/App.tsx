import { useState, useEffect } from 'react'
import './index.css'
import type { Todo } from './types/todo'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  // بارگذاری از localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (error) {
        console.error('خطا در بارگذاری از localStorage:', error)
        // اگر خطا داشت، داده‌های نمونه را بارگذاری کن
        const mockTodos: Todo[] = [
          { id: "1", title: "یادگیری TypeScript", isCompleted: false, createdAt: Date.now() - 20000 },
          { id: "2", title: "راه‌اندازی Tailwind", isCompleted: true, createdAt: Date.now() - 120000 },
          { id: "3", title: "ساخت UI اولیه To-Do", isCompleted: false, createdAt: Date.now() - 3600000 },
        ]
        setTodos(mockTodos)
      }
    } else {
      // داده‌های نمونه برای اولین بار
      const mockTodos: Todo[] = [
        { id: "1", title: "یادگیری TypeScript", isCompleted: false, createdAt: Date.now() - 20000 },
        { id: "2", title: "راه‌اندازی Tailwind", isCompleted: true, createdAt: Date.now() - 120000 },
        { id: "3", title: "ساخت UI اولیه To-Do", isCompleted: false, createdAt: Date.now() - 3600000 },
      ]
      setTodos(mockTodos)
    }
    setIsInitialized(true)
  }, [])

  // ذخیره در localStorage (فقط بعد از بارگذاری اولیه)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos, isInitialized])

  // افزودن todo جدید
  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        title: newTodo.trim(),
        isCompleted: false,
        createdAt: Date.now()
      }
      setTodos([todo, ...todos])
      setNewTodo('')
    }
  }

  // حذف todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // تغییر وضعیت تکمیل
  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    ))
  }

  // شروع ویرایش
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingText(todo.title)
  }

  // ذخیره ویرایش
  const saveEdit = () => {
    if (editingText.trim()) {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, title: editingText.trim() } : todo
      ))
    }
    setEditingId(null)
    setEditingText('')
  }

  // لغو ویرایش
  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  // شمارش todos (برای استفاده آینده)
  // const completedCount = todos.filter(todo => todo.isCompleted).length
  // const totalCount = todos.length

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            TODO
            <span className="inline-block w-6 h-6 bg-orange-500 rounded-full ml-2 align-middle">
              <span className="text-white text-xs flex items-center justify-center h-full">✓</span>
            </span>
          </h1>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button className="px-4 py-3 text-orange-600 font-semibold border-b-2 border-orange-500 mr-8 text-sm">
              Personal
            </button>
            <button className="px-4 py-3 text-gray-400 hover:text-gray-600 text-sm">
              Professional
            </button>
          </div>
        </header>

        {/* Add Todo Form */}
        <div className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What do you need to do?"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm"
            />
            <button
              onClick={addTodo}
              disabled={!newTodo.trim()}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
            >
              ADD
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-0">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              <p>No tasks added yet</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between py-4 px-0 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      todo.isCompleted
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                  >
                    {todo.isCompleted && <span className="text-xs">✓</span>}
                  </button>

                  {/* Content */}
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`text-gray-800 text-sm ${
                          todo.isCompleted
                            ? 'line-through text-gray-400'
                            : ''
                        }`}
                      >
                        {todo.title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {editingId !== todo.id && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(todo)}
                      className="text-orange-500 hover:text-orange-700 transition-colors text-sm"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 transition-colors text-sm"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Clear Completed Button */}
        {todos.some(todo => todo.isCompleted) && (
          <div className="mt-8 text-right">
            <button
              onClick={() => setTodos(todos.filter(todo => !todo.isCompleted))}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 ml-auto"
            >
              <span className="text-orange-500">✕</span>
              Clear Completed
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
