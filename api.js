export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Don't set Content-Type for FormData (browser sets it with boundary)
  const isFormData = options.body instanceof FormData;
  
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    if (window.showToast) {
      window.showToast(error.message, 'error');
    }
    
    throw error;
  }
};

export const get = (url, options = {}) => apiRequest(url, { method: 'GET', ...options });
export const post = (url, data, options = {}) => {
  // Handle FormData (for file uploads) vs JSON
  const isFormData = data instanceof FormData;
  
  return apiRequest(url, { 
    method: 'POST', 
    body: isFormData ? data : JSON.stringify(data), 
    ...options 
  });
};
export const put = (url, data, options = {}) => apiRequest(url, { 
  method: 'PUT', 
  body: JSON.stringify(data), 
  ...options 
});
export const del = (url, options = {}) => apiRequest(url, { method: 'DELETE', ...options });

export const apiEndpoints = {
  // Authentication
  login: '/auth/login',
  logout: '/auth/logout',
  
  // Admin
  adminStats: '/admin/stats',
  students: '/admin/students',
  teachers: '/admin/teachers',
  
  // Teacher
  teacherCourses: '/teacher/courses',
  teacherSchedule: '/teacher/schedule',
  
  // Student
  studentCourses: '/student/courses',
  studentSchedule: '/student/schedule',
  
  // Dynamic endpoints
  student: (id) => `/admin/students/${id}`,
  teacher: (id) => `/admin/teachers/${id}`,
  course: (id) => `/teacher/courses/${id}`,
  schedule: (id) => `/teacher/schedule/${id}`
};

export const createQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      searchParams.append(key, params[key]);
    }
  });
  
  return searchParams.toString();
};

export const downloadFile = (data, filename, type = 'application/json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
