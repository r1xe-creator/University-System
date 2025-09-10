// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react"; // Add useEffect
import AllDegrees from "./pages/AllDegrees";
import SingleDegree from "./pages/SingleDegree";
import NewDegree from "./pages/NewDegree";
import AllCohorts from "./pages/AllCohorts";
import SingleCohort from "./pages/SingleCohort";
import NewCohort from "./pages/NewCohort";
import AllModules from "./pages/AllModules";
import NewModule from "./pages/NewModule";
import SingleModule from "./pages/SingleModule";
import NewStudent from "./pages/NewStudent";
import SingleStudent from "./pages/SingleStudent";
import ModulesByCohort from "./pages/ModulesByCohort";
import StudentsByCohort from "./pages/StudentsByCohort";
import SetGrade from "./pages/SetGrade";
import StudentsByModule from "./pages/StudentsByModule";
import Button from "./components/Button";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isFading, setIsFading] = useState(false); // New state for fade

  const toggleDarkMode = () => {
    setIsFading(true); // Start fade-out
  };

  // Handle the fade sequence
  useEffect(() => {
    if (isFading) {
      const timer = setTimeout(() => {
        setDarkMode((prev) => !prev); // Toggle mode after fade-out
        setIsFading(false); // Fade back in
      }, 250); // Half of 500ms for fade-out, then fade-in
      return () => clearTimeout(timer);
    }
  }, [isFading]);

  // Apply dark mode to HTML root
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-100 to-gray-200"
        } flex flex-col items-center p-6 transition-colors duration-500 ${
          isFading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-350`}
      >
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8 animate-fade-in">
          University System
        </h1>
        <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 p-6 rounded-lg mb-8 flex justify-center gap-8 sticky top-0 z-10">
          <Link
            to="/degrees"
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 px-4 py-2 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
          >
            Degrees
          </Link>
          <Link
            to="/cohorts"
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 px-4 py-2 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
          >
            Cohorts
          </Link>
          <Link
            to="/modules"
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 px-4 py-2 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
          >
            Modules
          </Link>
          <Button onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </nav>
        <Routes>
          <Route path="/" element={<AllDegrees />} />
          <Route path="/degrees" element={<AllDegrees />} />
          <Route path="/degrees/:degreeCode" element={<SingleDegree />} />
          <Route path="/degrees/new" element={<NewDegree />} />
          <Route path="/cohorts" element={<AllCohorts />} />
          <Route path="/cohorts/:cohortId" element={<SingleCohort />} />
          <Route path="/cohorts/:cohortId/modules" element={<ModulesByCohort />} />
          <Route path="/cohorts/:cohortId/students" element={<StudentsByCohort />} />
          <Route path="/cohorts/new" element={<NewCohort />} />
          <Route path="/modules" element={<AllModules />} />
          <Route path="/modules/new" element={<NewModule />} />
          <Route path="/modules/:moduleId" element={<SingleModule />} />
          <Route path="/modules/:moduleId/students" element={<StudentsByModule />} />
          <Route path="/students/new" element={<NewStudent />} />
          <Route path="/students/:studentId" element={<SingleStudent />} />
          <Route path="/students/:studentId/grades/new" element={<SetGrade />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;