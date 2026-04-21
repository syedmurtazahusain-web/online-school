export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      return;
    }
    
    // Email validation
    if (rule.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors[field] = 'Please enter a valid email address';
      }
    }
    
    // Phone validation
    if (rule.phone && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        errors[field] = 'Please enter a valid phone number';
      }
    }
    
    // Min length validation
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.minLength} characters`;
    }
    
    // Max length validation
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rule.maxLength} characters`;
    }
    
    // Number validation
    if (rule.number && value) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be a valid number`;
      } else {
        if (rule.min !== undefined && num < rule.min) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.min}`;
        }
        if (rule.max !== undefined && num > rule.max) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rule.max}`;
        }
      }
    }
    
    // URL validation
    if (rule.url && value) {
      try {
        new URL(value);
      } catch {
        errors[field] = 'Please enter a valid URL';
      }
    }
  });
  
  return errors;
};

export const studentValidationRules = {
  name: { required: true, minLength: 2 },
  email: { required: true, email: true },
  grade: { required: true, minLength: 1 },
  phone: { phone: true },
  parentName: { minLength: 2 },
  parentPhone: { phone: true }
};

export const teacherValidationRules = {
  name: { required: true, minLength: 2 },
  email: { required: true, email: true },
  department: { required: true, minLength: 2 },
  subjects: { required: true, minLength: 2 },
  phone: { phone: true },
  qualification: { minLength: 2 },
  experience: { number: true, min: 0 }
};

export const courseValidationRules = {
  title: { required: true, minLength: 3 },
  description: { required: true, minLength: 10 },
  duration: { required: true, minLength: 1 },
  level: { required: true },
  price: { required: true, number: true, min: 0 },
  category: { required: true, minLength: 2 },
  teacher: { required: true, minLength: 2 },
  thumbnail: { url: true }
};

export const scheduleValidationRules = {
  subject: { required: true, minLength: 2 },
  day: { required: true },
  time: { required: true },
  teacher: { required: true, minLength: 2 },
  type: { required: true },
  maxStudents: { number: true, min: 1 }
};
