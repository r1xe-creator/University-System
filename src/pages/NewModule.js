import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createModule, getCohorts } from "../services/api";

function NewModule() {
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [caSplit, setCaSplit] = useState("");
  const [deliveredTo, setDeliveredTo] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const response = await getCohorts();
        setCohorts(response.data);
        const defaultCohorts = response.data
          .filter(cohort => ["COMBUS1", "COMBUS2"].includes(cohort.id))
          .map(cohort => cohort.id);
        setDeliveredTo(defaultCohorts);
      } catch (err) {
        setError("Failed to load cohorts. Is the API server running?");
      }
    };
    fetchCohorts();
  }, []);

  const handleDeliveredToChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setDeliveredTo(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (deliveredTo.length === 0) {
      setError("Please select at least one cohort.");
      return;
    }
    try {
      const data = {
        code: code,
        full_name: fullName,
        ca_split: parseInt(caSplit),
        delivered_to: deliveredTo,
      };
      await createModule(data);
      navigate("/modules");
    } catch (err) {
      const errorMessage = err.response?.data?.delivered_to
        ? err.response.data.delivered_to[0]
        : err.response?.data?.code
        ? err.response.data.code[0]
        : "An unexpected error occurred. Is the API server running?";
      setError(`Failed to create module: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Create New Module</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">Module Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., TSTD4"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Test Design 4"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">CA Split (%)</label>
          <input
            type="number"
            value={caSplit}
            onChange={(e) => setCaSplit(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 50"
            min="0"
            max="100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">Delivered to (Select Cohorts)</label>
          <select
            multiple
            value={deliveredTo}
            onChange={handleDeliveredToChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {cohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.id}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Create Module
        </button>
      </form>
      <Link
        to="/modules"
        className="block text-center mt-4 text-blue-500 hover:underline"
      >
        Back to All Modules
      </Link>
    </div>
  );
}

export default NewModule;