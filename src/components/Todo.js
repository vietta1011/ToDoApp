import React, { useState } from "react";
import { toast } from "react-toastify";
import "../styles/body/Todo.css";

function Todo({ todo, toggleComplete, deleteTodo, updateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setEditText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateTodo(todo.id, editText);
      setIsEditing(false);
      toast.success("Đã cập nhật nội dung việc!");
    }
  };

  return (
    <li className={todo.completed ? "liComplete" : "li"}>
      <div className="row">
        {!isEditing && (
          <input
            onChange={() => {
              toggleComplete(todo);
              if (todo.completed) {
                toast.success(
                  "Đã cập nhật trạng thái công việc là chưa hoàn thành!"
                );
              } else {
                toast.success(
                  "Đã cập nhật trạng thái công việc là hoàn thành!"
                );
              }
            }}
            type="checkbox"
            checked={todo.completed}
          />
        )}

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="editInput"
          />
        ) : (
          <p
            onDoubleClick={handleDoubleClick}
            className={todo.completed ? "textComplete" : "text"}
          >
            {todo.text}
          </p>
        )}

        {!isEditing && (
          <button className="deleteTodo" onClick={() => deleteTodo(todo.id)}>
            x
          </button>
        )}
      </div>
    </li>
  );
}

export default Todo;
