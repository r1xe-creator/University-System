import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createCohort, getDegrees } from "../services/api";

function NewCohort() {
  const [id, setId] = useState("");
  const [year, setYear] = useState("");
  const [degree, setDegree] = useState("");
  const [degrees, setDegrees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await getDegrees();
        setDegrees(response.data);
        const defaultDegree = response.data.find((deg) => deg.shortcode === "COMBUS");
        if (defaultDegree) {
          setDegree(defaultDegree.shortcode);
        } else if (response.data.length > 0) {
          setDegree(response.data[0].shortcode);
        } else {
          setError("No degrees available. Please create a degree first.");
        }
      } catch (err) {
        setError("Failed to fetch degrees. Check if the API is running.");
      }
    };
    fetchDegrees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!degree) {
      setError("Please select a valid degree.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const degreeUrl = `http://127.0.0.1:8000/api/degree/${degree}/`;
      const data = { id, year: parseInt(year), degree: degreeUrl };
      await createCohort(data);
      navigate("/cohorts");
    } catch (err) {
      const errorDetail = err.response?.data;
      let errorMessage = "Failed to create cohort. Is the API running?";
      if (errorDetail) {
        if (errorDetail.id) errorMessage = `ID error: ${errorDetail.id[0]}`;
        else if (errorDetail.year) errorMessage = `Year error: ${errorDetail.year[0]}`;
        else if (errorDetail.degree) errorMessage = `Degree error: ${errorDetail.degree[0]}`;
        else errorMessage = "Failed to create cohort. Check your input.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Create New Cohort</h2>
      {error && <p className="text-red-500 mb-4 animate-pulse">{error}</p>}
      {loading && (
        <div className="text-center mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Creating cohort...</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="id" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Cohort ID
          </label>
          <input
            id="id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            placeholder="e.g., TSTD2"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="year" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Year
          </label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            placeholder="e.g., 2"
            min="1"
            max="4"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="degree" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Degree
          </label>
          <select
            id="degree"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            required
            disabled={loading}
          >
            <option value="">Select a degree</option>
            {degrees.map((deg) => (
              <option key={deg.shortcode} value={deg.shortcode}>
                {deg.shortcode} ({deg.full_name})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Cohort"}
        </button>
      </form>
      <Link
        to="/cohorts"
        className="block text-center mt-4 text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
      >
        Back to All Cohorts
      </Link>
    </div>
  );
}

export default NewCohort;