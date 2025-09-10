import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getModules, setGrade } from "../services/api";

function SetGrade() {
  const { studentId } = useParams();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [caMark, setCaMark] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await getModules();
        setModules(response.data);
      } catch (err) {
        setError("Failed to load modules.");
      }
    };
    fetchModules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedModule) {
      setError("Please select a module.");
      return;
    }
    if (caMark < 0 || caMark > 100) {
      setError("CA Mark must be between 0 and 100.");
      return;
    }
    try {
      const gradeData = {
        student: `http://127.0.0.1:8000/api/student/${studentId}/`,
        module: `http://127.0.0.1:8000/api/module/${selectedModule}/`,
        ca_mark: parseInt(caMark),
      };
      await setGrade(gradeData);
      navigate(`/students/${studentId}`);
    } catch (err) {
      setError("Failed to set grade.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Set Grade for Student {studentId}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="module">
            Module
          </label>
          <select
            id="module"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 dark:border-gray-600"
            required
          >
            <option value="">Select a module</option>
            {modules.map((module) => (
              <option key={module.code} value={module.code}>
                {module.full_name} ({module.code})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="caMark">
            CA Mark (%)
          </label>
          <input
            type="number"
            id="caMark"
            value={caMark}
            onChange={(e) => setCaMark(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 dark:border-gray-600"
            placeholder="e.g., 75"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-300"
        >
          Set Grade
        </button>
      </form>
    </div>
  );
}

export default SetGrade;