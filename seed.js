require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Grade = require('./models/Grade');
const DocumentRequest = require('./models/DocumentRequest');
const Announcement = require('./models/Announcement');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany();
  await Student.deleteMany();
  await Course.deleteMany();
  await Enrollment.deleteMany();
  await Grade.deleteMany();
  await DocumentRequest.deleteMany();
  await Announcement.deleteMany();

  // Create users
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const admin = await User.create({ name: 'Admin User', email: 'admin@rms.com', password: hashedPassword, role: 'admin', department: 'IT' });
  const registrar = await User.create({ name: 'Registrar Staff', email: 'registrar@rms.com', password: hashedPassword, role: 'registrar', department: 'Registrar' });
  const deptHead = await User.create({ name: 'Dr. Abebe', email: 'depthead@rms.com', password: hashedPassword, role: 'department_head', department: 'Computer Science' });
  const instructor = await User.create({ name: 'Mr. Ashenafi', email: 'instructor@rms.com', password: hashedPassword, role: 'instructor', department: 'Computer Science' });
  const studentUser = await User.create({ name: 'Elham Namus', email: 'elham@rms.com', password: hashedPassword, role: 'student', department: 'Computer Science' });
  const studentUser2 = await User.create({ name: 'Selamawit Shumbet', email: 'selam@rms.com', password: hashedPassword, role: 'student', department: 'Computer Science' });
  const studentUser3 = await User.create({ name: 'Yordanos Zerihun', email: 'yordanos@rms.com', password: hashedPassword, role: 'student', department: 'Computer Science' });

  // Create students
  const student1 = await Student.create({ user: studentUser._id, studentId: 'NSE/2513/14', program: 'BSc Computer Science', year: 4, semester: 1, gpa: 3.5 });
  const student2 = await Student.create({ user: studentUser2._id, studentId: 'NSE/7812/14', program: 'BSc Computer Science', year: 4, semester: 1, gpa: 3.2 });
  const student3 = await Student.create({ user: studentUser3._id, studentId: 'NSE/5836/14', program: 'BSc Computer Science', year: 4, semester: 1, gpa: 3.7 });

  // Create courses
  const course1 = await Course.create({ courseCode: 'CS401', title: 'Software Engineering', credits: 4, department: 'Computer Science', semester: '1st', year: 4, instructor: instructor._id });
  const course2 = await Course.create({ courseCode: 'CS402', title: 'Database Systems', credits: 3, department: 'Computer Science', semester: '1st', year: 4, instructor: instructor._id });
  const course3 = await Course.create({ courseCode: 'CS403', title: 'Web Development', credits: 3, department: 'Computer Science', semester: '1st', year: 4, instructor: instructor._id });

  // Create enrollments
  const enroll1 = await Enrollment.create({ student: student1._id, course: course1._id, semester: '1st', year: 2025 });
  const enroll2 = await Enrollment.create({ student: student1._id, course: course2._id, semester: '1st', year: 2025 });
  const enroll3 = await Enrollment.create({ student: student2._id, course: course1._id, semester: '1st', year: 2025 });
  const enroll4 = await Enrollment.create({ student: student3._id, course: course3._id, semester: '1st', year: 2025 });

  // Create grades
  await Grade.create({ enrollment: enroll1._id, student: student1._id, course: course1._id, instructor: instructor._id, marks: { midterm: 35, assignment: 15, final: 40, total: 90 }, grade: 'A', status: 'approved' });
  await Grade.create({ enrollment: enroll2._id, student: student1._id, course: course2._id, instructor: instructor._id, marks: { midterm: 30, assignment: 14, final: 38, total: 82 }, grade: 'A-', status: 'approved' });
  await Grade.create({ enrollment: enroll3._id, student: student2._id, course: course1._id, instructor: instructor._id, marks: { midterm: 25, assignment: 12, final: 35, total: 72 }, grade: 'B', status: 'submitted' });
  await Grade.create({ enrollment: enroll4._id, student: student3._id, course: course3._id, instructor: instructor._id, marks: { midterm: 38, assignment: 18, final: 42, total: 98 }, grade: 'A+', status: 'draft' });

  // Create document requests
  await DocumentRequest.create({ student: student1._id, type: 'transcript', status: 'ready', purpose: 'Graduation application' });
  await DocumentRequest.create({ student: student2._id, type: 'enrollment_letter', status: 'pending', purpose: 'Internship' });

  // Create announcements
  await Announcement.create({ title: 'Welcome to RMS', content: 'The new Registrar Management System is now live!', targetAudience: 'all', postedBy: admin._id });
  await Announcement.create({ title: 'Grade Submission Deadline', content: 'Instructors must submit all grades by June 30.', targetAudience: 'instructors', postedBy: registrar._id });

  console.log('Seed data created successfully!');
  console.log('Demo accounts:');
  console.log('  admin@rms.com / password123 (Admin)');
  console.log('  registrar@rms.com / password123 (Registrar)');
  console.log('  depthead@rms.com / password123 (Department Head)');
  console.log('  instructor@rms.com / password123 (Instructor)');
  console.log('  elham@rms.com / password123 (Student)');
  console.log('  selam@rms.com / password123 (Student)');
  console.log('  yordanos@rms.com / password123 (Student)');
  process.exit(0);
};

seedData().catch(err => { console.error(err); process.exit(1); });
