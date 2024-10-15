import React, { useState, useEffect, useRef } from "react";
import "../styles/body/Body.css";
import "../../node_modules/react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Todo from "./Todo";
import { db } from "../firebase/Firebase";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

function Body() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef();
  const [filter, setFilter] = useState("all");

  // Đọc dữ liệu
  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        todosArray.push({ ...data, id: doc.id });
      });
      setTodos(todosArray);
    });
    return () => unsubscribe();
  }, []);

  // Thêm công việc
  const createTodo = async (e) => {
    e.preventDefault();
    if (input === "") {
      toast.error("Hãy nhập việc cần làm!");
      return;
    }
    try {
      await addDoc(collection(db, "todos"), {
        text: input,
        completed: false,
        timestamp: serverTimestamp(),
      });
      setInput("");
      toast.success("Tạo mới công việc thành công!");
      inputRef.current.focus();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Có lỗi xảy ra khi thêm công việc. Hãy thử lại!");
    }
  };

  // Cập nhật trạng thái
  const toggleComplete = async (todo) => {
    try {
      await updateDoc(doc(db, "todos", todo.id), {
        completed: !todo.completed,
      });
    } catch (error) {
      console.error("Error updating document's state: ", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái. Hãy thử lại!");
    }
  };

  // Cập nhật công việc
  const updateTodo = async (id, newText) => {
    try {
      await updateDoc(doc(db, "todos", id), {
        text: newText,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Có lỗi xảy ra khi cập nhật việc. Hãy thử lại!");
    }
  };

  // Xóa công việc
  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      toast.success("Xóa việc thành công!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Có lỗi xảy ra khi xóa công việc. Hãy thử lại!");
    }
  };

  // Thay đổi trạng thái toàn bộ công việc
  const toggleAllTodos = async () => {
    try {
      const allCompleted = todos.every((todo) => todo.completed);
      todos.forEach(async (todo) => {
        await updateDoc(doc(db, "todos", todo.id), {
          completed: !allCompleted,
        });
      });
      toast.success(
        allCompleted
          ? "Tất cả việc đã được đặt lại là chưa hoàn thành!"
          : "Tất cả việc đã hoàn thành!"
      );
    } catch (error) {
      console.error("Error updating all todos: ", error);
      toast.error("Có lỗi xảy ra khi cập nhật tất cả công việc. Hãy thử lại!");
    }
  };

  // Xóa toàn bộ công việc đã hoàn thành
  const clearCompletedTodos = async () => {
    try {
      const completedTodos = todos.filter((todo) => todo.completed);
      if (completedTodos.length === 0) {
        toast.info("Không thể xóa vì chưa có việc hoàn thành!");
        return;
      }
      completedTodos.forEach(async (todo) => {
        await deleteDoc(doc(db, "todos", todo.id));
      });
      toast.success("Đã xóa tất cả các việc đã hoàn thành!");
    } catch (error) {
      console.error("Error deleting all todos: ", error);
      toast.error("Có lỗi xảy ra khi xóa tất cả công việc. Hãy thử lại!");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      createTodo(event);
    }
  };

  const remainingItems = todos.filter((todo) => !todo.completed).length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="container">
      <div className="input-container">
        {filteredTodos.length > 0 && (
          <button className="toggle-button" onClick={toggleAllTodos}>
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
        )}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="text-input"
          placeholder="What needs to be done?"
          onKeyDown={handleKeyDown}
        />
      </div>
      <ul>
        {filteredTodos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
          />
        ))}
      </ul>
      {todos.length > 0 && (
        <div className="footer">
          <p className="count">{`${remainingItems} items left!`}</p>
          <button
            className={filter === "all" ? "selected" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "active" ? "selected" : ""}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={filter === "completed" ? "selected" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button className="clear-completed" onClick={clearCompletedTodos}>
            Clear completed
          </button>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Body;
