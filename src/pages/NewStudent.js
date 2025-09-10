import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createStudent, getCohorts } from "../services/api";

function NewStudent() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cohort, setCohort] = useState("");
  const [cohorts, setCohorts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const response = await getCohorts();
        setCohorts(response.data);
        const defaultCohort = response.data.find((c) => c.id === "COMBUS1");
        if (defaultCohort) {
          setCohort(defaultCohort.id);
        } else if (response.data.length > 0) {
          setCohort(response.data[0].id);
        } else {
          setError("No cohorts available. Please create a cohort first.");
        }
      } catch (err) {
        setError("Failed to fetch cohorts. Check if the API is running.");
      }
    };
    fetchCohorts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cohort) {
      setError("Please select a valid cohort.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = {
        first_name: firstName,
        last_name: lastName,
        cohort: cohort,
      };
      const response = await createStudent(data);
      const newStudentId = response.data.student_id;
      navigate(`/students/${newStudentId}`);
    } catch (err) {
      const errorDetail = err.response?.data;
      let errorMessage = "An unexpected error occurred. Is the API running?";
      if (errorDetail) {
        if (errorDetail.first_name) errorMessage = `First name error: ${errorDetail.first_name[0]}`;
        else if (errorDetail.last_name) errorMessage = `Last name error: ${errorDetail.last_name[0]}`;
        else if (errorDetail.cohort) errorMessage = `Cohort error: ${errorDetail.cohort[0]}`;
        else if (errorDetail.student_id) errorMessage = `Student ID error: ${errorDetail.student_id[0]}`;
        else errorMessage = "Failed to create student. Check your input or API status.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Create New Student
      </h2>
      {error && <p className="text-red-500 mb-4 animate-pulse">{error}</p>}
      {loading && (
        <div className="text-center mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Creating student...</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            placeholder="e.g., Clive"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            placeholder="e.g., Kitu"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="cohort"
            className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
          >
            Cohort
          </label>
          <select
            id="cohort"
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            required
            disabled={loading}
          >
            <option value="">Select a cohort</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} {c.name ? `- ${c.name}` : ""}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 dark:disabled:bg-gray-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Student"}
        </button>
      </form>
      <Link
        to="/students"
        className="block text-center mt-4 text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
      >
        Back to All Students
      </Link>
    </div>
  );
}

export default NewStudent;