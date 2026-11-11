import assert from 'node:assert';
import { extractHashtags, normalizeHashtag, resolveCollegeHashtag, checkCollegeConflict } from '../src/services/hashtag.service.js';
import { calculateSmartPriority } from '../src/services/priority.service.js';
import { generateTicketId, submitProblemReport, markProblemInProgress, markProblemResolved, studentVerifySuccess } from '../src/services/problem.service.js';
import { calculateCollegeScore, getWeeklyLeaderboard } from '../src/services/leaderboard.service.js';
import { colleges } from '../src/data/colleges.js';
import { authService, SEEDED_STUDENT, SEEDED_ADMIN, SEEDED_FACULTY } from '../src/services/auth.service.js';
import { db } from '../src/services/db.service.js';

console.log('🧪 Running PARIHAARAM Full Automated Verification Suite (44 Tests)...\n');

// 1. Test Hashtag Extraction & Case Normalization
console.log('Test 1: Hashtag Extraction & Case Normalization...');
assert.strictEqual(normalizeHashtag('#cek'), '#CEK');
assert.strictEqual(normalizeHashtag('Cek'), '#CEK');

const textSample = 'There is a broken projector in Room 204 at #cek and #CET.';
const extracted = extractHashtags(textSample);
assert.deepStrictEqual(extracted, ['#CEK', '#CET']);
console.log('  ✅ Extracted and normalized hashtags:', extracted);

// 2. Test Hashtag Lookup
console.log('Test 2: College Hashtag Database Lookup...');
const cekCollege = resolveCollegeHashtag('#cek');
assert.ok(cekCollege);
assert.strictEqual(cekCollege.code, 'CEK');
assert.strictEqual(cekCollege.name, 'College of Engineering, Kalloopara');

const unknownCollege = resolveCollegeHashtag('#RandomCollege');
assert.strictEqual(unknownCollege, null);
console.log('  ✅ #CEK resolved correctly and unknown hashtag returned null.');

// 3. Test Student Authority & College Conflict Warning
console.log('Test 3: College Ownership & Conflict Warning...');
const conflict = checkCollegeConflict('CEK', '#CET');
assert.strictEqual(conflict.hasConflict, true);
assert.ok(conflict.message.includes('belongs to another college'));
console.log('  ✅ Conflict warning triggered correctly.');

// 4. Test Smart Priority Calculation
console.log('Test 4: Smart Priority Scoring Engine...');
const criticalResult = calculateSmartPriority({
  category: 'infrastructure',
  title: 'Structural Crack in Main Block',
  description: 'Dangerous structural crack detected near main entrance',
  studentPriority: 'HIGH',
  affectedCount: 30
});
assert.strictEqual(criticalResult.priority, 'CRITICAL');
assert.ok(criticalResult.priorityScore >= 85);
console.log('  ✅ Smart Priority computed: CRITICAL');

// 5. Test Ticket ID Format
console.log('Test 5: Server Ticket Generator...');
const ticketId = generateTicketId('CEK');
assert.ok(ticketId.startsWith('CE-CEK-2026-'));
console.log('  ✅ Generated Ticket ID:', ticketId);

// 6. Test Weekly Leaderboard Scoring & Movement
console.log('Test 6: Leaderboard Algorithm & Rank Movement...');
const leaderboard = getWeeklyLeaderboard(colleges);
assert.strictEqual(leaderboard.length, colleges.length);
assert.strictEqual(leaderboard[0].currentRank, 1);
assert.ok(leaderboard[0].calculatedScore >= leaderboard[1].calculatedScore);
console.log('  ✅ Leaderboard Top 3 computed successfully.');

// 7. Test Valid Student Login
console.log('Test 7: Valid Student Login (STU001 / student123)...');
const studentRes = authService.loginStudent('STU001', 'student123');
assert.strictEqual(studentRes.success, true);
assert.strictEqual(studentRes.user.id, 'STU001');
assert.strictEqual(studentRes.user.role, 'STUDENT');
console.log('  ✅ Valid Student Login successful.');

// 8. Test Invalid Student Login
console.log('Test 8: Invalid Student Login Failure...');
const invalidStudent = authService.loginStudent('STU001', 'wrongpass');
assert.strictEqual(invalidStudent.success, false);
assert.strictEqual(invalidStudent.message, 'Invalid student credentials.');
console.log('  ✅ Invalid Student credentials correctly rejected.');

// 9. Test Valid Admin Login
console.log('Test 9: Valid Admin Login (ADMIN001 / admin123)...');
const adminRes = authService.loginAdmin('ADMIN001', 'admin123');
assert.strictEqual(adminRes.success, true);
assert.strictEqual(adminRes.user.id, 'ADMIN001');
assert.strictEqual(adminRes.user.role, 'COLLEGE_ADMIN');
console.log('  ✅ Valid Admin Login successful.');

// 10. Test Invalid Admin Login
console.log('Test 10: Invalid Admin Login Failure...');
const invalidAdmin = authService.loginAdmin('ADMIN001', 'wrongpass');
assert.strictEqual(invalidAdmin.success, false);
assert.ok(invalidAdmin.message.includes('Invalid admin credentials'));
console.log('  ✅ Invalid Admin credentials correctly rejected.');

// 11. Test Role Guard: Student cannot access Admin Role
console.log('Test 11: Role Guard Verification — Student Role vs Admin Role...');
authService.logoutAdmin();
authService.loginStudent('STU001', 'student123');
assert.strictEqual(authService.isAuthenticatedStudent(), true);
assert.strictEqual(authService.isAuthenticatedAdmin(), false);
console.log('  ✅ Student session is NOT authorized as Admin.');

// 12. Test Role Guard: Admin cannot access Student-only Role
console.log('Test 12: Role Guard Verification — Admin Session Isolation...');
authService.logoutStudent();
authService.loginAdmin('ADMIN001', 'admin123');
assert.strictEqual(authService.isAuthenticatedAdmin(), true);
assert.strictEqual(authService.isAuthenticatedStudent(), false);
console.log('  ✅ Admin session is NOT authorized as Student.');

// 13. Test Shared DB: Student complaint appears in Admin dashboard
console.log('Test 13: Shared DB — Student Complaint visible in Admin DB view...');
const testStudentUser = { id: 'STU001', studentId: 'STU001', name: 'Sample Student', collegeCode: 'CEK', collegeId: 'cek' };
const newReport = submitProblemReport({
  title: 'Water Cooler Leakage in Block C',
  description: 'Leakage near water cooler in Block C #CEK',
  category: 'Water / Plumbing',
  categoryId: 'water',
  building: 'Block C',
  floor: '2nd Floor',
  room: 'Hallway',
  studentPriority: 'MEDIUM'
}, testStudentUser);

const adminProblemView = db.getProblemById(newReport.id);
assert.ok(adminProblemView);
assert.strictEqual(adminProblemView.title, 'Water Cooler Leakage in Block C');
console.log('  ✅ Newly submitted student report immediately readable in Admin DB view.');

// 14. Test Shared DB: Admin status update reflects in Student view
console.log('Test 14: Shared DB — Admin IN_PROGRESS update reflects in Student view...');
const adminUser = { id: 'ADMIN001', name: 'PARIHAARAM Admin' };
markProblemInProgress(newReport.id, 'Plumber dispatched on site', adminUser);

const studentUpdatedView = db.getProblemById(newReport.id);
assert.strictEqual(studentUpdatedView.status, 'IN_PROGRESS');
console.log('  ✅ Status update IN_PROGRESS reflected in Student view.');

// 15. Test Shared DB: Student verification changes Admin-visible status
console.log('Test 15: Shared DB — Student verification CLOSED reflects in Admin view...');
db.updateProblem(newReport.id, { status: 'STUDENT_VERIFICATION' });
studentVerifySuccess(newReport.id, { rating: 5, comment: 'Fixed perfectly!' }, testStudentUser);

const finalAdminView = db.getProblemById(newReport.id);
assert.strictEqual(finalAdminView.status, 'CLOSED');
assert.strictEqual(finalAdminView.studentFeedback.rating, 5);
console.log('  ✅ Student verification CLOSED reflected in Admin DB view.');

// 16. Test Logout Destroys Session State
console.log('Test 16: Session Destruction on Logout...');
authService.logoutStudent();
authService.logoutAdmin();
assert.strictEqual(authService.isAuthenticatedStudent(), false);
assert.strictEqual(authService.isAuthenticatedAdmin(), false);
console.log('  ✅ Logout destroys active sessions.');

// --- NEW AUTOMATED TESTS 17 - 30 ---

// 17. Student creates normal complaint (OWN_COLLEGE)
console.log('Test 17: Student creates normal complaint (OWN_COLLEGE)...');
const normalReport = submitProblemReport({
  reportType: 'OWN_COLLEGE',
  title: 'Broken Classroom Chair',
  description: 'Wobbly chair in Room 102',
  category: 'Furniture',
  building: 'Main Block',
  floor: 'Ground Floor',
  room: 'Room 102',
  studentPriority: 'LOW'
}, testStudentUser);
assert.ok(db.getProblemById(normalReport.id));
assert.strictEqual(normalReport.reportType, 'OWN_COLLEGE');
console.log('  ✅ Normal complaint created and exists in shared DB.');

// 18. Admin reads same normal complaint
console.log('Test 18: Admin reads same normal complaint...');
const readByAdmin = db.getProblemById(normalReport.id);
assert.ok(readByAdmin);
assert.strictEqual(readByAdmin.title, 'Broken Classroom Chair');
console.log('  ✅ Admin successfully read normal complaint from shared DB.');

// 19. Student creates OTHER_COLLEGE report
console.log('Test 19: Student creates OTHER_COLLEGE report...');
const externalReport = submitProblemReport({
  reportType: 'OTHER_COLLEGE',
  targetCollege: 'CEC',
  visitReason: 'Competition',
  observedDate: '2026-09-12',
  title: 'Dangerously Rusted Railing',
  description: 'Staircase railing near second-floor lab block is heavily rusted and unstable.',
  category: 'Infrastructure',
  building: 'Academic Block',
  floor: '2nd Floor',
  room: 'Corridor',
  studentPriority: 'HIGH',
  evidence: ['data:image/jpeg;base64,samplephoto1']
}, testStudentUser);
assert.ok(externalReport);
assert.strictEqual(externalReport.reportType, 'OTHER_COLLEGE');
console.log('  ✅ OTHER_COLLEGE report created successfully.');

// 20. Reporter college remains unchanged
console.log('Test 20: Reporter college remains preserved on external report...');
assert.strictEqual(externalReport.reporterCollege, '#CEK');
console.log('  ✅ Reporter college correctly preserved as #CEK.');

// 21. Target college is correctly assigned
console.log('Test 21: Target college correctly assigned on external report...');
assert.strictEqual(externalReport.targetCollege, 'CEC');
console.log('  ✅ Target college correctly assigned to CEC.');

// 22. Correct target Admin receives external report
console.log('Test 22: Correct target Admin (#CEC) receives external report...');
const allProbs = db.getProblems();
const cecAdminFeed = allProbs.filter(p => (p.targetCollege || p.collegeCode || '').toUpperCase() === 'CEC');
assert.ok(cecAdminFeed.some(p => p.id === externalReport.id));
console.log('  ✅ #CEC Admin feed includes the external report.');

// 23. Wrong college Admin (#CEK) filtering by target college cannot see external report
console.log('Test 23: Wrong college Admin (#CEK) cannot see external report targeting #CEC...');
const cekAdminFeed = allProbs.filter(p => (p.targetCollege || p.collegeCode || '').toUpperCase() === 'CEK');
assert.strictEqual(cekAdminFeed.some(p => p.id === externalReport.id), false);
console.log('  ✅ #CEK Admin correctly filtered out report targeting #CEC.');

// 24. Evidence metadata is stored
console.log('Test 24: Evidence metadata stored on report...');
assert.ok(Array.isArray(externalReport.evidence));
assert.strictEqual(externalReport.evidence.length, 1);
console.log('  ✅ Evidence metadata stored successfully.');

// 25. Multiple evidence images supported (up to 5)
console.log('Test 25: Multiple evidence images supported...');
const multiEvidenceReport = submitProblemReport({
  reportType: 'OTHER_COLLEGE',
  targetCollege: 'CEC',
  title: 'Multi Photo Test',
  description: 'Testing multi evidence photos upload',
  evidence: ['img1', 'img2', 'img3', 'img4', 'img5']
}, testStudentUser);
assert.strictEqual(multiEvidenceReport.evidence.length, 5);
console.log('  ✅ 5 evidence photos stored correctly.');

// 26. Admin-created student can log in
console.log('Test 26: Admin-created student can log in...');
const createdStudent = db.createStudent({
  name: 'Created Student',
  studentId: 'STU002',
  email: 'stu002@pariharam.demo',
  password: 'student123',
  collegeCode: 'CEK',
  department: 'ECE',
  year: '2'
});
assert.ok(createdStudent);

const authCreatedStudent = authService.loginStudent('STU002', 'student123');
assert.strictEqual(authCreatedStudent.success, true);
assert.strictEqual(authCreatedStudent.user.studentId, 'STU002');
console.log('  ✅ Admin-created student (STU002) successfully authenticated.');

// 27. Admin status change propagates to Student
console.log('Test 27: Admin status change IN_PROGRESS propagates to Student...');
markProblemInProgress(externalReport.id, 'Maintenance inspecting railing', { id: 'ADMIN002', name: 'CEC Admin' });
const updatedExternal = db.getProblemById(externalReport.id);
assert.strictEqual(updatedExternal.status, 'IN_PROGRESS');
console.log('  ✅ Status change IN_PROGRESS reflected in Student view.');

// 28. Student verification propagates to Admin
console.log('Test 28: Student verification propagates to Admin...');
db.updateProblem(externalReport.id, { status: 'STUDENT_VERIFICATION' });
studentVerifySuccess(externalReport.id, { rating: 4, comment: 'Railing repaired' }, testStudentUser);
const verifiedExternal = db.getProblemById(externalReport.id);
assert.strictEqual(verifiedExternal.status, 'CLOSED');
console.log('  ✅ Student verification CLOSED reflected in Admin view.');

// 29. External report generates target-college ticket number
console.log('Test 29: External report generates target-college ticket number...');
assert.ok(externalReport.ticketId.startsWith('CE-CEC-2026-'));
console.log('  ✅ Generated Ticket ID prefix: CE-CEC-2026-');

// 30. Student can access college profile and start external report
console.log('Test 30: Student college profile external observation flow...');
const targetCollegeObj = db.getCollegeByHashtag('#CEC') || db.getCollegeById('cec');
assert.ok(targetCollegeObj);
assert.strictEqual(targetCollegeObj.code, 'CEC');
console.log('  ✅ Target college profile pre-selects #CEC correctly.');

// --- NEW AUTOMATED TESTS 31 - 40 (Lifecycle & Persistence Verification) ---

// 31. db.getStudentReports retrieves reports for student object
console.log('Test 31: db.getStudentReports query by student object...');
const studentReports = db.getStudentReports(testStudentUser);
assert.ok(studentReports.length >= 2);
assert.ok(studentReports.some(r => r.id === newReport.id));
console.log('  ✅ db.getStudentReports retrieved student reports accurately.');

// 32. Newly created ticket immediately in db.getProblems()
console.log('Test 32: Immediate persistence in db.getProblems()...');
const freshReport = submitProblemReport({
  title: 'Lab Computer Monitor Flicker',
  description: 'Monitor flickers in CSE Lab 3',
  building: 'CS Block',
  room: 'Lab 3'
}, testStudentUser);
const freshFetch = db.getProblems().find(p => p.id === freshReport.id);
assert.ok(freshFetch);
assert.strictEqual(freshFetch.title, 'Lab Computer Monitor Flicker');
console.log('  ✅ Newly submitted ticket immediately readable from db.getProblems().');

// 33. Target college code normalization
console.log('Test 33: Target college hashtag & case normalization...');
const normalizedReport = submitProblemReport({
  reportType: 'OTHER_COLLEGE',
  targetCollege: '#cek',
  title: 'Hashtag prefixed target test',
  description: 'Testing #cek target college normalization'
}, testStudentUser);
assert.strictEqual(normalizedReport.targetCollege, 'CEK');
console.log('  ✅ Target college stripped leading # and uppercased to CEK.');

// 34. isProblemTargetingAdminCollege helper
console.log('Test 34: isProblemTargetingAdminCollege helper validation...');
const { isProblemTargetingAdminCollege, isProblemReportedByStudent } = await import('../src/services/problem.service.js');
assert.strictEqual(isProblemTargetingAdminCollege(normalizedReport, 'CEK'), true);
assert.strictEqual(isProblemTargetingAdminCollege(normalizedReport, 'CEC'), false);
console.log('  ✅ isProblemTargetingAdminCollege helper verified.');

// 35. isProblemReportedByStudent helper
console.log('Test 35: isProblemReportedByStudent helper validation...');
assert.strictEqual(isProblemReportedByStudent(freshReport, testStudentUser), true);
assert.strictEqual(isProblemReportedByStudent(freshReport, { id: 'STU999' }), false);
console.log('  ✅ isProblemReportedByStudent helper verified.');

// 36. Student reopen action sets REOPENED status and adds timeline entry
console.log('Test 36: Student reopen action lifecycle...');
const { studentReopenProblem } = await import('../src/services/problem.service.js');
db.updateProblem(freshReport.id, { status: 'STUDENT_VERIFICATION' });
const reopened = studentReopenProblem(freshReport.id, { explanation: 'Fix failed, still flickering', rejectionImages: ['img_proof'] }, testStudentUser);
assert.strictEqual(reopened.status, 'REOPENED');
assert.strictEqual(reopened.studentRejectionData.explanation, 'Fix failed, still flickering');
assert.ok(reopened.timeline.some(t => t.status === 'REOPENED'));
console.log('  ✅ Student reopen transition and timeline audit entry verified.');

// 37. Duplicate problem detection helper
console.log('Test 37: Duplicate problem detection helper...');
const { findDuplicateProblems } = await import('../src/services/problem.service.js');
const dupes = findDuplicateProblems({
  collegeId: 'cek',
  categoryId: 'water',
  building: 'CS Block',
  room: 'Lab 3',
  title: 'Lab Computer Monitor Flicker'
});
assert.ok(dupes.length >= 1);
console.log('  ✅ Duplicate problem detection identified existing report.');

// 38. Student stats updated automatically
console.log('Test 38: Student stats computed correctly...');
const studentStats = db.getStudentStats(testStudentUser);
assert.ok(studentStats.totalSubmitted >= 3);
console.log('  ✅ db.getStudentStats computed total reports count accurately.');

// 39. Evidence gallery images preserved
console.log('Test 39: Evidence images array structure preserved...');
assert.ok(Array.isArray(reopened.evidence));
assert.strictEqual(reopened.evidence.length, freshReport.evidence.length);
console.log('  ✅ Evidence images array preserved in DB.');

// 40. Full Complaint Lifecycle (REPORTED -> VERIFIED -> ASSIGNED -> IN_PROGRESS -> STUDENT_VERIFICATION -> CLOSED)
console.log('Test 40: End-to-end full complaint lifecycle audit...');
const fullReport = submitProblemReport({
  title: 'Full Lifecycle Electrical Wire Hazard',
  description: 'Exposed wiring near Library Entrance',
  building: 'Library',
  room: 'Entrance'
}, testStudentUser);
assert.strictEqual(fullReport.status, 'REPORTED');

const { verifyProblemReport, assignProblemReport } = await import('../src/services/problem.service.js');
const verified = verifyProblemReport(fullReport.id, adminUser);
assert.strictEqual(verified.status, 'VERIFIED');

const assigned = assignProblemReport(fullReport.id, {
  department: 'Electrical',
  responsiblePerson: SEEDED_FACULTY.name,
  assignedFacultyId: SEEDED_FACULTY.id,
  assignedFacultyEmail: SEEDED_FACULTY.email,
  dueDate: '2026-09-15'
}, adminUser);
assert.strictEqual(assigned.status, 'ASSIGNED');
assert.strictEqual(assigned.assignedFacultyId, SEEDED_FACULTY.id);

const progress = markProblemInProgress(fullReport.id, 'Wiring insulated', adminUser);
assert.strictEqual(progress.status, 'IN_PROGRESS');

const resolved = markProblemResolved(fullReport.id, { resolutionDescription: 'Replaced electrical casing' }, adminUser);
assert.strictEqual(resolved.status, 'STUDENT_VERIFICATION');

const closed = studentVerifySuccess(fullReport.id, { rating: 5, comment: 'Verified safe' }, testStudentUser);
assert.strictEqual(closed.status, 'CLOSED');
assert.strictEqual(closed.timeline.length, 6);
console.log('  ✅ Full 6-stage lifecycle executed with 6 timeline audit entries.');

// 41. Faculty login and cross-role session isolation
console.log('Test 41: Faculty login and cross-role session isolation...');
authService.loginStudent('STU001', 'student123');
assert.strictEqual(authService.isAuthenticatedStudent(), true);
const facultyRes = authService.loginFaculty('FAC001', 'faculty123');
assert.strictEqual(facultyRes.success, true);
assert.strictEqual(facultyRes.user.role, 'FACULTY');
assert.strictEqual(authService.isAuthenticatedStudent(), false);
assert.strictEqual(authService.isAuthenticatedFaculty(), true);
assert.strictEqual(authService.loginFaculty('FAC001', 'wrongpass').success, false);
authService.loginAdmin('ADMIN001', 'admin123');
assert.strictEqual(authService.isAuthenticatedFaculty(), false);
assert.strictEqual(authService.isAuthenticatedAdmin(), true);
console.log('  ✅ Faculty credentials authenticate, invalid passwords fail, and role sessions do not overlap.');

// 42. Admin can create a faculty account with unique credentials
console.log('Test 42: Admin faculty account creation and duplicate protection...');
const newFaculty = db.createFaculty({
  facultyId: 'FAC_TEST_42',
  name: 'Test Faculty',
  email: 'faculty.test.42@pariharam.demo',
  password: 'securefaculty42',
  department: 'Electrical Maintenance',
  collegeCode: 'CEK'
});
assert.strictEqual(newFaculty.success, true);
assert.strictEqual(newFaculty.user.role, 'FACULTY');
assert.strictEqual(db.createFaculty({
  facultyId: 'FAC_TEST_42',
  name: 'Duplicate Faculty',
  email: 'duplicate.faculty@pariharam.demo',
  password: 'securefaculty42',
  department: 'Electrical Maintenance',
  collegeCode: 'CEK'
}).success, false);
assert.strictEqual(authService.loginFaculty('FAC_TEST_42', 'securefaculty42').success, true);
console.log('  ✅ Admin-created faculty accounts authenticate and duplicate IDs are blocked.');

// 43. Faculty assignment visibility is limited to the assigned account
console.log('Test 43: Faculty sees only problems assigned to their account...');
assert.ok(db.getFacultyAssignedProblems(SEEDED_FACULTY.id).some(problem => problem.id === fullReport.id));
assert.strictEqual(db.getFacultyAssignedProblems('FAC_TEST_42').length, 0);
console.log('  ✅ Assignment records are scoped to the faculty account ID.');

// 44. Faculty accounts cannot receive assignments from another college
console.log('Test 44: Faculty assignment college isolation...');
const outOfCollegeFaculty = db.createFaculty({
  facultyId: 'FAC_CEC_44',
  name: 'CEC Test Faculty',
  email: 'faculty.cec.44@pariharam.demo',
  password: 'securefaculty44',
  department: 'Facilities',
  collegeCode: 'CEC'
});
assert.strictEqual(outOfCollegeFaculty.success, true);
assert.strictEqual(assignProblemReport(fullReport.id, {
  department: 'Electrical',
  responsiblePerson: outOfCollegeFaculty.user.name,
  assignedFacultyId: outOfCollegeFaculty.user.id,
  dueDate: '2026-09-15'
}, adminUser), null);
console.log('  ✅ Cross-college faculty assignments are rejected.');

console.log('\n🎉 ALL 44 AUTOMATED TESTS PASSED CLEANLY (44/44)!');
