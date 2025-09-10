import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

// Axios instance with base URL and error handling
const api = axios.create({
  baseURL: API_URL,
});

// Add global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Degrees
export const getDegrees = () => api.get("degree/");
export const getDegree = (code) => api.get(`degree/${code}/`);
export const createDegree = (data) => api.post("degree/", data);

// Cohorts
export const getCohorts = () => api.get("cohort/");
export const getCohort = (id) => api.get(`cohort/${id}/`);
export const getCohortsByDegree = (degreeCode) => api.get(`cohort/?degree=${degreeCode}`);
export const createCohort = (data) => api.post("cohort/", data); // Remove the degree formatting here

// Modules
export const getModules = () => api.get("module/");
export const getModule = (code) => api.get(`module/${code}/`);
export const getModulesByCohort = (cohortId) => api.get(`module/?delivered_to=${cohortId}`);
export const createModule = (data) =>
  api.post("module/", {
    ...data,
    delivered_to: data.delivered_to.map((id) => `${API_URL}cohort/${id}/`), // Format as URL array
  });

// Students
export const getStudent = (id) => api.get(`student/${id}/`);
export const getStudentsByCohort = (cohortId) => api.get(`student/?cohort=${cohortId}`);
export const createStudent = (data) =>
  api.post("student/", {
    ...data,
    cohort: data.cohort ? `${API_URL}cohort/${data.cohort}/` : null, // Format as URL
  });

// Grades
export const getGrades = (studentId) => api.get(`grade/?student=${studentId}`);
export const setGrade = (gradeData) => api.post("grade/", gradeData);