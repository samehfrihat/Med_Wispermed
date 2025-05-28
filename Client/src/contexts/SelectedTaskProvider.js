import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

// Create a context
const SelectedTaskContext = createContext();

const pathsAllowedWithoutTask = [
  "/studycase/welcome",
  "/studycase/login",
  "/studycase/description",
  "/login",
  "/signup",
  "*",
];

// const REDIRECT_URI = "/studycase/welcome";
const REDIRECT_URI = "/studycase/welcome";

// Create a provider component
export const SelectedTaskProvider = ({ children }) => {
  const [currentTask, setCurrentTask] = useState(null);
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [relevanceCount, setRelevanceCount] = useState(0);
  const location = useLocation();
  useEffect(() => {
    try {
      const visibleTaskBanner = sessionStorage.getItem("visibleTaskBanner");
      setVisible(Boolean(visibleTaskBanner));
      // alert(visibleTaskBanner)
      const task = JSON.parse(window.localStorage.getItem("task"));
      if (!task) {
        throw new Error("Task not found");
      } else {
        setCurrentTask(task);
      }
    } catch (error) {
      if (!pathsAllowedWithoutTask.includes(location.pathname)) {
        // history.push(REDIRECT_URI);
      }
    }
  }, [history, location.pathname]);

  if (
    !pathsAllowedWithoutTask.includes("*") &&
    !pathsAllowedWithoutTask.includes(location.pathname) &&
    !currentTask
  ) {
    return null;
  }

  return (
    <SelectedTaskContext.Provider
      value={{
        currentTask,
        visible,
        relevanceCount,
        setVisible: (visible) => {
          sessionStorage.setItem("visibleTaskBanner", visible);
          setVisible(visible);
        },
        setCurrentTask: (task) => {
          window.localStorage.setItem("task", JSON.stringify(task));
          setCurrentTask(task);
        },
        clearCurrentTask: () => {
          window.localStorage.removeItem("task");
          setCurrentTask(null);
        },
        setRelevanceCount: (amount = 1, reset = false) => {
          setRelevanceCount((relevanceCount) => {
            if (reset) {
              relevanceCount = amount;
            } else {
              if (amount === 1) {
                relevanceCount += amount;
              } else if (amount === -1 && relevanceCount > 0) {
                relevanceCount += amount;
              }
            }
            localStorage.setItem("relevance", relevanceCount);
            return relevanceCount;
          });
        },
      }}
    >
      {children}
    </SelectedTaskContext.Provider>
  );
};

export const useSelectedTask = () => useContext(SelectedTaskContext);
