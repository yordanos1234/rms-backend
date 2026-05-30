// Comprehensive validation utility for RMS
const validator = {
  isEmail: (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  },
  isNotEmpty: (val) => val !== undefined && val !== null && String(val).trim().length > 0,
  isPositiveInt: (val) => Number.isInteger(Number(val)) && Number(val) > 0,
  isPositiveNumber: (val) => !isNaN(Number(val)) && Number(val) >= 0,
  isValidRole: (role) => ['student', 'instructor', 'registrar', 'admin', 'department_head'].includes(role),
  isValidStatus: (status) => ['active', 'graduated', 'suspended', 'withdrawn'].includes(status),
  isValidGradeStatus: (status) => ['draft', 'submitted', 'approved', 'rejected'].includes(status),
  isValidDocType: (type) => ['transcript', 'enrollment_letter', 'certificate', 'clearance', 'id_card'].includes(type),
  isValidDocStatus: (status) => ['pending', 'processing', 'ready', 'delivered', 'rejected'].includes(status),
  isValidSemester: (sem) => ['1st', '2nd'].includes(sem),
  isValidPhone: (phone) => {
    if (!phone) return true; // optional
    const re = /^0[79]\d{8}$/;
    return re.test(String(phone));
  },
  minLength: (val, len) => String(val).trim().length >= len,
  maxLength: (val, len) => String(val).trim().length <= len,
  inRange: (val, min, max) => {
    const n = Number(val);
    return !isNaN(n) && n >= min && n <= max;
  }
};

// Helper to get nested value from object using dot notation
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

// Generic validate middleware factory
const validate = (rules) => (req, res, next) => {
  const errors = {};
  for (const [field, checks] of Object.entries(rules)) {
    const value = field.includes('.') ? getNestedValue(req.body, field) : req.body[field];
    for (const check of checks) {
      const result = check(value, field);
      if (result !== true) {
        errors[field] = result;
        break;
      }
    }
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors,
      type: 'VALIDATION_ERROR'
    });
  }
  next();
};

// Predefined validation rules
const validators = {
  // Auth
  register: validate({
    name: [
      (v) => validator.isNotEmpty(v) || 'Name is required',
      (v) => validator.minLength(v, 2) || 'Name must be at least 2 characters',
      (v) => validator.maxLength(v, 100) || 'Name must be at most 100 characters',
      (v) => /^[a-zA-Z\s'-]+$/.test(v) || 'Name can only contain letters, spaces, hyphens and apostrophes'
    ],
    email: [
      (v) => validator.isNotEmpty(v) || 'Email is required',
      (v) => validator.isEmail(v) || 'Please enter a valid email address'
    ],
    password: [
      (v) => validator.isNotEmpty(v) || 'Password is required',
      (v) => validator.minLength(v, 6) || 'Password must be at least 6 characters',
      (v) => validator.maxLength(v, 128) || 'Password must be at most 128 characters'
    ],
    role: [
      (v) => validator.isNotEmpty(v) || 'Role is required',
      (v) => validator.isValidRole(v) || 'Invalid role selected'
    ],
    department: [
      (v) => !v || validator.minLength(v, 2) || 'Department must be at least 2 characters',
      (v) => !v || validator.maxLength(v, 100) || 'Department must be at most 100 characters'
    ],
    phone: [
      (v) => !v || validator.isValidPhone(v) || 'Phone must be a valid Ethiopian number (e.g., 0911223344)'
    ]
  }),
  login: validate({
    email: [
      (v) => validator.isNotEmpty(v) || 'Email is required',
      (v) => validator.isEmail(v) || 'Please enter a valid email address'
    ],
    password: [
      (v) => validator.isNotEmpty(v) || 'Password is required'
    ]
  }),

  // Student
  studentCreate: validate({
    user: [
      (v) => validator.isNotEmpty(v) || 'User ID is required'
    ],
    studentId: [
      (v) => validator.isNotEmpty(v) || 'Student ID is required',
      (v) => validator.minLength(v, 3) || 'Student ID must be at least 3 characters',
      (v) => validator.maxLength(v, 50) || 'Student ID must be at most 50 characters'
    ],
    program: [
      (v) => validator.isNotEmpty(v) || 'Program is required',
      (v) => validator.minLength(v, 2) || 'Program must be at least 2 characters'
    ],
    year: [
      (v) => validator.isNotEmpty(v) || 'Year is required',
      (v) => validator.isPositiveInt(v) || 'Year must be a positive integer',
      (v) => validator.inRange(v, 1, 7) || 'Year must be between 1 and 7'
    ],
    semester: [
      (v) => validator.isNotEmpty(v) || 'Semester is required',
      (v) => validator.isPositiveInt(v) || 'Semester must be a positive integer',
      (v) => validator.inRange(v, 1, 3) || 'Semester must be between 1 and 3'
    ],
    gpa: [
      (v) => !v || validator.inRange(v, 0, 4) || 'GPA must be between 0.00 and 4.00'
    ],
    status: [
      (v) => !v || validator.isValidStatus(v) || 'Invalid status'
    ]
  }),

  // Course
  courseCreate: validate({
    courseCode: [
      (v) => validator.isNotEmpty(v) || 'Course code is required',
      (v) => validator.minLength(v, 2) || 'Course code must be at least 2 characters',
      (v) => validator.maxLength(v, 20) || 'Course code must be at most 20 characters'
    ],
    title: [
      (v) => validator.isNotEmpty(v) || 'Course title is required',
      (v) => validator.minLength(v, 2) || 'Title must be at least 2 characters',
      (v) => validator.maxLength(v, 200) || 'Title must be at most 200 characters'
    ],
    credits: [
      (v) => validator.isNotEmpty(v) || 'Credits are required',
      (v) => validator.isPositiveInt(v) || 'Credits must be a positive integer',
      (v) => validator.inRange(v, 1, 20) || 'Credits must be between 1 and 20'
    ],
    department: [
      (v) => validator.isNotEmpty(v) || 'Department is required',
      (v) => validator.minLength(v, 2) || 'Department must be at least 2 characters'
    ],
    year: [
      (v) => validator.isNotEmpty(v) || 'Year is required',
      (v) => validator.isPositiveInt(v) || 'Year must be a positive integer',
      (v) => validator.inRange(v, 1, 7) || 'Year must be between 1 and 7'
    ],
    semester: [
      (v) => validator.isNotEmpty(v) || 'Semester is required',
      (v) => validator.isValidSemester(v) || 'Semester must be 1st or 2nd'
    ]
  }),

  // Grade
  gradeCreate: validate({
    student: [
      (v) => validator.isNotEmpty(v) || 'Student is required'
    ],
    course: [
      (v) => validator.isNotEmpty(v) || 'Course is required'
    ],
    'marks.midterm': [
      (v) => v === undefined || v === null || (validator.isPositiveNumber(v) && validator.inRange(v, 0, 100)) || 'Midterm must be between 0 and 100'
    ],
    'marks.assignment': [
      (v) => v === undefined || v === null || (validator.isPositiveNumber(v) && validator.inRange(v, 0, 100)) || 'Assignment must be between 0 and 100'
    ],
    'marks.final': [
      (v) => v === undefined || v === null || (validator.isPositiveNumber(v) && validator.inRange(v, 0, 100)) || 'Final must be between 0 and 100'
    ]
  }),

  // Document
  docCreate: validate({
    type: [
      (v) => validator.isNotEmpty(v) || 'Document type is required',
      (v) => validator.isValidDocType(v) || 'Invalid document type'
    ],
    purpose: [
      (v) => !v || validator.minLength(v, 2) || 'Purpose must be at least 2 characters',
      (v) => !v || validator.maxLength(v, 500) || 'Purpose must be at most 500 characters'
    ]
  }),

  // Announcement
  announcementCreate: validate({
    title: [
      (v) => validator.isNotEmpty(v) || 'Title is required',
      (v) => validator.minLength(v, 3) || 'Title must be at least 3 characters',
      (v) => validator.maxLength(v, 200) || 'Title must be at most 200 characters'
    ],
    content: [
      (v) => validator.isNotEmpty(v) || 'Content is required',
      (v) => validator.minLength(v, 5) || 'Content must be at least 5 characters',
      (v) => validator.maxLength(v, 5000) || 'Content must be at most 5000 characters'
    ]
  })
};

// Partial validation for updates (only validates fields present in req.body)
const validatePartial = (rules) => (req, res, next) => {
  const errors = {};
  for (const [field, checks] of Object.entries(rules)) {
    const value = field.includes('.') ? getNestedValue(req.body, field) : req.body[field];
    if (value === undefined) continue; // skip fields not provided
    for (const check of checks) {
      const result = check(value, field);
      if (result !== true) {
        errors[field] = result;
        break;
      }
    }
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors,
      type: 'VALIDATION_ERROR'
    });
  }
  next();
};

module.exports = { validator, validate, validatePartial, validators };
