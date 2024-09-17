import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import axios from 'axios';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import Search from "./components/search";
import DeleteSelected from "./components/deleteSelected"
import InsertMultiple from "./components/insertMultiple";
import "./index.css";

const Main = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5050/record/')
      .then(response => {
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      })
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const deleteRecord = async (id) => {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const newEmployees = employees.filter((el) => el._id !== id);
    setEmployees(newEmployees);
    setFilteredEmployees(newEmployees);
  };

  return (
    <div>
      <Search employees={employees} setFilteredEmployees={setFilteredEmployees} />
      <RecordList employees={filteredEmployees} deleteRecord={deleteRecord} />
    </div>
  );
};



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <Record />,
      },
    ],
  },
  {
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
        element: <Record />,
      },
    ],
  },
  {
    path: "/deleteSelected",
    element: <App />,
    children: [
      {
        path: "/deleteSelected",
        element: <DeleteSelected/>,
      },
    ],
  },
  {
    path: "/insertMultiple",
    element: <App />,
    children: [
      {
        path: "/insertMultiple",
        element: <InsertMultiple />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
