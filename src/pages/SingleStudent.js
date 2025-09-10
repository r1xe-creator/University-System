import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudent, getGrades, getModule } from "../services/api";

function SingleStudent() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await getStudent(studentId);
        setStudent(studentResponse.data);
        const gradesResponse = await getGrades(studentId);
        setGrades(gradesResponse.data);
        const modulePromises = gradesResponse.data.map((grade) =>
          getModule(grade.module.split("/").slice(-2, -1)[0])
        );
        const moduleResponses = await Promise.all(modulePromises);
        setModules(moduleResponses.map((res) => res.data));
      } catch (err) {
        setError("Failed to load student or grades.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (loading) return (
    <div className="text-center mt-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto"></div>
    </div>
  );
  if (error) return <div className="text-center mt-10 text-red-500 animate-pulse">{error}</div>;
  if (!student) return <div className="text-center mt-10 text-gray-600 dark:text-gray-300">Student not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {student.first_name} {student.last_name}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-2">Student ID: {student.student_id}</p>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Cohort: {student.cohort.split("/").slice(-2, -1)[0]}
      </p>
      <Link
        to={`/students/${studentId}/grades/new`}
        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block transition-colors duration-300 group relative"
      >
        Set Grade
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
      </Link>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Modules and Grades</h3>
      {grades.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {grades.map((grade, index) => (
            <div
              key={grade.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link
                to={`/modules/${modules[index]?.code}`}
                className="text-lg font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                {modules[index]?.full_name}
              </Link>
              <p className="text-gray-600 dark:text-gray-300">Grade: {grade.ca_mark}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No grades found for this student.</p>
      )}
    </div>
  );
}

export default SingleStudent;