export const videoValidationRules = {
  title: { required: true, minLength: 3, maxLength: 100 },
  description: { maxLength: 500 },
  video: { required: true },
  thumbnail: { url: true }
};

export const validateVideoForm = (formData, rules = videoValidationRules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      return;
    }
    
    // Min length validation
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.minLength} characters`;
    }
    
    // Max length validation
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rule.maxLength} characters`;
    }
    
    // File type validation for video
    if (field === 'video' && value && value.type) {
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!allowedTypes.includes(value.type)) {
        errors[field] = 'Invalid video format. Please upload MP4, WebM, OGG, or MOV files';
      }
    }
    
    // File size validation for video (max 100MB)
    if (field === 'video' && value && value.size) {
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (value.size > maxSize) {
        errors[field] = 'Video file must be smaller than 100MB';
      }
    }
    
    // URL validation for thumbnail
    if (rule.url && value && value.trim() !== '') {
      try {
        new URL(value);
      } catch {
        errors[field] = 'Please enter a valid URL';
      }
    }
  });
  
  return errors;
};
