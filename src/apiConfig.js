
const API_BASE_URL = 'http://localhost:5000/api';

// Define specific endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/login`,

  // Student Management
  GET_STUDENTS: `${API_BASE_URL}/students`,
  ADD_STUDENT: `${API_BASE_URL}/students`,
  GET_STUDENT_BY_ID: (studentId) => `${API_BASE_URL}/students/${studentId}`, 
  UPDATE_STUDENT: (studentId) => `${API_BASE_URL}/students/${studentId}`,
  DELETE_STUDENT: (studentId) => `${API_BASE_URL}/students/${studentId}`,
  BULK_IMPORT_STUDENTS: `${API_BASE_URL}/students/bulk-import`,
  MARK_STUDENT_VACCINATED: (studentId) => `${API_BASE_URL}/students/${studentId}/vaccinate`, 

  // Vaccination Drive Management
  GET_DRIVES: `${API_BASE_URL}/drives`,
  ADD_DRIVE: `${API_BASE_URL}/drives`, // POST
  GET_DRIVE_BY_ID: (driveId) => `${API_BASE_URL}/drives/${driveId}`,
  UPDATE_DRIVE: (driveId) => `${API_BASE_URL}/drives/${driveId}`, // PUT
  // DELETE_DRIVE: (driveId) => `${API_BASE_URL}/drives/${driveId}`, // (if applicable)

  // Dashboard
  GET_DASHBOARD_METRICS: `${API_BASE_URL}/dashboard`,

  // Reports
  GENERATE_VACCINATION_REPORT: `${API_BASE_URL}/reports/vaccinations`,
};

// You can also export the base URL if you need it separately sometimes
export { API_BASE_URL };