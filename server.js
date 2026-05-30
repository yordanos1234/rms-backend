require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Grade = require('./models/Grade');
const DocumentRequest = require('./models/DocumentRequest');
const Announcement = require('./models/Announcement');

const app = express();
app.use(cors());
app.use(express.json());

const ethiopianFirstNames = [
  'Abebe','Abera','Abiy','Adane','Alemayehu','Asfaw','Ashenafi','Belay','Bereket','Berhanu',
  'Dawit','Degu','Demissie','Desta','Ephrem','Eyasu','Fikadu','Gashaw','Gebre','Girma',
  'Haile','Hailu','Kebede','Kassahun','Mekonnen','Mengistu','Mewded','Mulugeta','Seifu','Tadesse',
  'Tadesse','Tilahun','Wondimu','Worku','Yared','Yohannes','Zelalem',
  'Abeba','Aberash','Alem','Almaz','Birtukan','Desta','Ejigayehu','Elfinesh','Emebet','Etsegenet',
  'Fana','Fatuma','Fetlework','Genet','Habtamu','Hiwot','Kidan','Konjit','Mekdes','Melat',
  'Meron','Mulu','Netsanet','Saba','Sintayehu','Tigist','W/ro','W/ro','W/ro','W/ro',
  'Wondimu','Worku','Yeshi','Yodit','Zeinaba'
];
const ethiopianLastNames = [
  'Abebe','Abera','Adane','Alemayehu','Asfaw','Ashenafi','Belay','Bereket','Berhanu',
  'Dawit','Degu','Demissie','Desta','Ephrem','Eyasu','Fikadu','Gashaw','Gebre','Girma',
  'Haile','Hailu','Kebede','Kassahun','Mekonnen','Mengistu','Mulugeta','Seifu','Tadesse',
  'Tilahun','Wondimu','Worku','Yohannes','Zelalem',
  'Bekele','Bogale','Chala','Dibaba','Ejigu','Gemechu','Getahun','Hunde','Jaleta','Kuma',
  'Lema','Mamo','Nigatu','Oljira','Regassa','Tola','Urgessa','Wakjira','Zerihun'
];

const programs = ['BSc Computer Science','BSc Information Technology','BSc Software Engineering','BA Economics','BSc Nursing','BSc Civil Engineering','LLB Law','BPharm Pharmacy','BSc Electrical Engineering','BSc Mechanical Engineering'];
const departments = ['Computer Science','Information Technology','Software Engineering','Economics','Nursing','Civil Engineering','Law','Pharmacy','Electrical Engineering','Mechanical Engineering'];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedIfEmpty = async () => {
  const count = await User.countDocuments();
  if (count > 0) return;

  console.log('Seeding rich Ethiopian demo data...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const admin = await User.create({ name: 'Admin User', email: 'admin@rms.com', password: hashedPassword, role: 'admin', department: 'IT', phone: '0911121314' });
  const registrar = await User.create({ name: 'Ato Mekonnen Kebede', email: 'registrar@rms.com', password: hashedPassword, role: 'registrar', department: 'Registrar Office', phone: '0922232425' });
  const deptHead1 = await User.create({ name: 'Dr. Berhanu Asfaw', email: 'depthead@rms.com', password: hashedPassword, role: 'department_head', department: 'Computer Science', phone: '0933343536' });
  const deptHead2 = await User.create({ name: 'Dr. Almaz Desta', email: 'depthead2@rms.com', password: hashedPassword, role: 'department_head', department: 'Economics', phone: '0944454647' });
  const instructor1 = await User.create({ name: 'Mr. Ashenafi Tadesse', email: 'instructor@rms.com', password: hashedPassword, role: 'instructor', department: 'Computer Science', phone: '0955565758' });
  const instructor2 = await User.create({ name: 'Ms. Tigist Ejigu', email: 'instructor2@rms.com', password: hashedPassword, role: 'instructor', department: 'Computer Science', phone: '0966676869' });
  const instructor3 = await User.create({ name: 'Mr. Dawit Haile', email: 'instructor3@rms.com', password: hashedPassword, role: 'instructor', department: 'Economics', phone: '0977787980' });

  // Original group members (guaranteed accounts)
  const elham = await User.create({ name: 'Elham Namus', email: 'elham@rms.com', password: hashedPassword, role: 'student', department: 'Computer Science', phone: '0911223344' });
  const selam = await User.create({ name: 'Selamawit Shumbet', email: 'selam@rms.com', password: hashedPassword, role: 'student', department: 'Computer Science', phone: '0922334455' });
  const yordanos = await User.create({ name: 'Yordanos Zerihun', email: 'yordanos@rms.com', password: hashedPassword, role: 'student', department: 'Computer Science', phone: '0933445566' });

  const studentElham = await Student.create({ user: elham._id, studentId: 'NSE/2513/14', program: 'BSc Computer Science', year: 4, semester: 1, gpa: 3.55, status: 'active' });
  const studentSelam = await Student.create({ user: selam._id, studentId: 'NSE/7812/14', program: 'BSc Computer Science', year: 4, semester: 1, gpa: 3.42, status: 'active' });
  const studentYordanos = await Student.create({ user: yordanos._id, studentId: 'NSE/5836/14', program: 'BSc Computer Science', year: 4, semester: 1, gpa: 3.68, status: 'active' });

  const studentUsers = [elham, selam, yordanos];
  const studentRecords = [studentElham, studentSelam, studentYordanos];

  for (let i = 0; i < 30; i++) {
    const fname = rand(ethiopianFirstNames);
    const lname = rand(ethiopianLastNames);
    const fullName = `${fname} ${lname}`;
    const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${i}@rms.com`;
    const program = rand(programs);
    const dept = departments[programs.indexOf(program)];
    const year = randInt(1, 5);
    const gpa = +(Math.random() * 2.5 + 1.5).toFixed(2);

    const user = await User.create({
      name: fullName, email, password: hashedPassword, role: 'student', department: dept, phone: `09${randInt(10000000, 99999999)}`
    });
    const student = await Student.create({
      user: user._id,
      studentId: `NSE/${randInt(1000,9999)}/${randInt(10,20)}`,
      program, year, semester: randInt(1,2),
      enrollmentDate: new Date(2020 + randInt(0,4), randInt(0,11), randInt(1,28)),
      status: rand(['active','active','active','graduated','suspended']),
      gpa
    });
    studentUsers.push(user);
    studentRecords.push(student);
  }

  const courseData = [
    { code: 'CS401', title: 'Software Engineering', credits: 4, dept: 'Computer Science', year: 4, sem: '1st', instructor: instructor1._id },
    { code: 'CS402', title: 'Database Systems', credits: 3, dept: 'Computer Science', year: 4, sem: '1st', instructor: instructor1._id },
    { code: 'CS403', title: 'Web Development', credits: 3, dept: 'Computer Science', year: 4, sem: '1st', instructor: instructor2._id },
    { code: 'CS404', title: 'Artificial Intelligence', credits: 3, dept: 'Computer Science', year: 4, sem: '1st', instructor: instructor2._id },
    { code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, dept: 'Computer Science', year: 3, sem: '2nd', instructor: instructor1._id },
    { code: 'CS302', title: 'Operating Systems', credits: 3, dept: 'Computer Science', year: 3, sem: '2nd', instructor: instructor2._id },
    { code: 'IT401', title: 'Network Security', credits: 3, dept: 'Information Technology', year: 4, sem: '1st', instructor: instructor2._id },
    { code: 'IT402', title: 'Cloud Computing', credits: 3, dept: 'Information Technology', year: 4, sem: '1st', instructor: instructor1._id },
    { code: 'SE401', title: 'Software Architecture', credits: 3, dept: 'Software Engineering', year: 4, sem: '1st', instructor: instructor1._id },
    { code: 'ECO401', title: 'Development Economics', credits: 3, dept: 'Economics', year: 4, sem: '1st', instructor: instructor3._id },
    { code: 'NUR401', title: 'Community Health Nursing', credits: 3, dept: 'Nursing', year: 4, sem: '1st', instructor: instructor2._id },
    { code: 'LAW401', title: 'Constitutional Law', credits: 4, dept: 'Law', year: 4, sem: '1st', instructor: instructor3._id },
  ];

  const courses = [];
  for (const c of courseData) {
    const course = await Course.create({
      courseCode: c.code, title: c.title, credits: c.credits,
      department: c.dept, semester: c.sem, year: c.year,
      instructor: c.instructor,
      description: `This course covers fundamental concepts and advanced topics in ${c.title.toLowerCase()}. Students will gain hands-on experience through assignments and projects.`,
      isActive: true
    });
    courses.push(course);
  }

  const grades = [];
  for (let i = 0; i < studentRecords.length; i++) {
    const student = studentRecords[i];
    const numCourses = randInt(2, 5);
    const shuffled = [...courses].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numCourses);

    for (const course of selected) {
      const enrollment = await Enrollment.create({
        student: student._id, course: course._id,
        semester: course.semester, year: 2025,
        status: 'enrolled'
      });

      const midterm = randInt(15, 40);
      const assignment = randInt(10, 20);
      const final = randInt(20, 45);
      const total = midterm + assignment + final;
      let grade = 'F';
      if (total >= 90) grade = 'A+';
      else if (total >= 85) grade = 'A';
      else if (total >= 80) grade = 'A-';
      else if (total >= 75) grade = 'B+';
      else if (total >= 70) grade = 'B';
      else if (total >= 65) grade = 'B-';
      else if (total >= 60) grade = 'C+';
      else if (total >= 55) grade = 'C';
      else if (total >= 50) grade = 'C-';
      else if (total >= 45) grade = 'D';

      const status = rand(['approved','approved','approved','submitted','draft']);
      const g = await Grade.create({
        enrollment: enrollment._id, student: student._id, course: course._id,
        instructor: course.instructor,
        marks: { midterm, assignment, final, total },
        grade, status,
        submittedAt: status !== 'draft' ? new Date() : null,
        approvedAt: status === 'approved' ? new Date() : null
      });
      grades.push(g);
    }
  }

  const docTypes = ['transcript','enrollment_letter','certificate','clearance','id_card'];
  for (let i = 0; i < 12; i++) {
    const student = rand(studentRecords);
    await DocumentRequest.create({
      student: student._id,
      type: rand(docTypes),
      status: rand(['pending','processing','ready','ready','delivered']),
      purpose: rand(['Graduation application','Internship','Job application','Scholarship','Visa application','Transfer']),
      requestedAt: new Date(2025, randInt(0,4), randInt(1,28))
    });
  }

  const annTitles = [
    { t: 'Welcome to RMS', c: 'The new Registrar Management System is now live! All students and staff are encouraged to login and explore the new features.', a: 'all' },
    { t: 'Grade Submission Deadline', c: 'All instructors must submit final grades by June 30, 2025. Late submissions will require department head approval.', a: 'instructors' },
    { t: 'Registration for 2nd Semester', c: 'Online registration for the second semester of 2025 is now open. Deadline: July 15, 2025.', a: 'students' },
    { t: 'Document Processing Hours', c: 'The registrar office will process document requests from Monday to Friday, 8:00 AM - 5:00 PM.', a: 'all' },
    { t: 'System Maintenance Notice', c: 'Scheduled maintenance on Sunday, June 25, 2025 from 2:00 AM - 4:00 AM. Service may be briefly unavailable.', a: 'all' },
  ];
  for (const a of annTitles) {
    await Announcement.create({ title: a.t, content: a.c, targetAudience: a.a, postedBy: rand([admin, registrar, deptHead1])._id });
  }

  console.log('Demo data seeded successfully!');
  console.log('  admin@rms.com / password123 (Admin)');
  console.log('  registrar@rms.com / password123 (Registrar)');
  console.log('  depthead@rms.com / password123 (Dept Head - CS)');
  console.log('  depthead2@rms.com / password123 (Dept Head - Economics)');
  console.log('  instructor@rms.com / password123 (Instructor - CS)');
  console.log('  instructor2@rms.com / password123 (Instructor - CS)');
  console.log('  instructor3@rms.com / password123 (Instructor - Economics)');
  console.log('  30 Ethiopian students seeded with real names');
  console.log('  12 courses, ~80 enrollments, ~80 grades, 12 document requests');
};

const startServer = async () => {
  await connectDB();
  await seedIfEmpty();

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/students', require('./routes/students'));
  app.use('/api/courses', require('./routes/courses'));
  app.use('/api/enrollments', require('./routes/enrollments'));
  app.use('/api/grades', require('./routes/grades'));
  app.use('/api/documents', require('./routes/documents'));
  app.use('/api/announcements', require('./routes/announcements'));
  app.use('/api/reports', require('./routes/reports'));

  app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'RMS API is running' }));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
