-- =============================================================================
-- PARIHAARAM Database Seed Data Migration V2
-- Seed colleges, users (BCrypt hashed), and initial complaint records
-- =============================================================================

-- 1. Seed Colleges
INSERT INTO colleges (id, code, name, hashtag, location, district, lat, lng, principal, phone, email, established_year, is_active, current_rank, performance_score)
VALUES
('cek', 'CEK', 'College of Engineering, Kalloopara', '#CEK', 'Kalloopara, Pathanamthitta, Kerala', 'Pathanamthitta', 9.3887, 76.5872, 'Dr. S. Jose', '+91 469 2677890', 'principal@cek.ac.in', 1999, TRUE, 4, 91.8),
('mec', 'MEC', 'Model Engineering College', '#MEC', 'Ernakulam, Kerala', 'Ernakulam', 8.5463, 76.9063, 'Dr. V. Suresh', '+91 471 2598370', 'principal@mec.ac.in', 1939, TRUE, 1, 96.4),
('cec', 'CEC', 'College of Engineering Chengannur', '#CEC', 'Chengannur, Alappuzha, Kerala', 'Alappuzha', 10.0543, 76.6263, 'Dr. Bos Mathew', '+91 485 2822363', 'principal@cec.ac.in', 1961, TRUE, 2, 94.7),
('cea', 'CEA', 'College of Engineering, Adoor', '#CEA', 'Adoor, Pathanamthitta, Kerala', 'Pathanamthitta', 8.9056, 76.6341, 'Dr. Shahul Hameed', '+91 474 2712024', 'principal@cea.ac.in', 1958, TRUE, 3, 93.1),
('cectl', 'CECTL', 'College of Engineering, Cherthala', '#CECTL', 'Cherthala, Alappuzha, Kerala', 'Alappuzha', 11.3216, 75.9336, 'Dr. B. Jayarajan', '+91 478 2814880', 'principal@cectl.ac.in', 1961, TRUE, 6, 88.4),
('cekrg', 'CEKRG', 'College of Engineering, Karunagappally', '#CEKRG', 'Karunagappally, Kollam, Kerala', 'Kollam', 9.0543, 76.5381, 'Dr. C. G. Radhamani', '+91 476 2665935', 'principal@cekrg.ac.in', 1999, TRUE, 7, 85.6),
('cekn', 'CEKN', 'College of Engineering, Kottarakkara', '#CEKN', 'Kottarakkara, Kollam, Kerala', 'Kollam', 9.0012, 76.7721, 'Dr. M. S. Preetha', '+91 474 2450570', 'principal@cekn.ac.in', 2004, TRUE, 8, 83.2),
('cept', 'CEPT', 'College of Engineering, Poonjar', '#CEPT', 'Poonjar, Kottayam, Kerala', 'Kottayam', 9.6734, 76.8123, 'Dr. K. R. Harilal', '+91 4822 274375', 'principal@cept.ac.in', 2000, TRUE, 9, 81.5),
('cem', 'CEM', 'College of Engineering, Munnar', '#CEM', 'Munnar, Idukki, Kerala', 'Idukki', 9.1530, 76.7329, 'Dr. Beyon Koshy', '+91 4734 224075', 'principal@cem.ac.in', 1994, TRUE, 10, 82.1),
('cet', 'CET', 'College of Engineering, Trivandrum', '#CET', 'Sreekaryam, Thiruvananthapuram, Kerala', 'Thiruvananthapuram', 8.5463, 76.9063, 'Dr. Suresh K.', '+91 471 2598370', 'principal@cet.ac.in', 1939, TRUE, 5, 89.5),
('ihrd', 'IHRD', 'IHRD Central Headquarters', '#IHRD', 'Vazhuthacaud, Thiruvananthapuram, Kerala', 'Thiruvananthapuram', 8.4984, 76.9570, 'Director, IHRD', '+91 471 2322985', 'director@ihrd.ac.in', 1987, TRUE, 0, 95.0);

-- 2. Seed Users (BCrypt Hashes: student123 -> $2a$10$wN1rLhy62174mS5a7oH49O.y2F/krhhF.9d8hX0656v3K4v5uJgK2, admin123 -> $2a$10$Q3sP1KqKxH1p.Qh85oX/l.PzC8J3VfL5R7IqP4O4J8Y6N8V5T2Q2y)
INSERT INTO users (id, username, email, password_hash, name, role, college_code, is_active)
VALUES
('STU001', 'STU001', 'student@pariharam.demo', '$2a$10$6oR8.R3N64Z7F8rK5fQ25.1e8nS9iY7l7O.iF5u2X8h7F3b3L8fW.', 'Sample Student', 'STUDENT', 'CEK', TRUE),
('ADMIN001', 'ADMIN001', 'admin.cek@pariharam.demo', '$2a$10$6oR8.R3N64Z7F8rK5fQ25.1e8nS9iY7l7O.iF5u2X8h7F3b3L8fW.', 'CEK Campus Administrator', 'COLLEGE_ADMIN', 'CEK', TRUE),
('ADMIN002', 'ADMIN002', 'admin.cec@pariharam.demo', '$2a$10$6oR8.R3N64Z7F8rK5fQ25.1e8nS9iY7l7O.iF5u2X8h7F3b3L8fW.', 'CEC Campus Administrator', 'COLLEGE_ADMIN', 'CEC', TRUE),
('SUPER001', 'SUPER001', 'director@ihrd.ac.in', '$2a$10$6oR8.R3N64Z7F8rK5fQ25.1e8nS9iY7l7O.iF5u2X8h7F3b3L8fW.', 'Director of IHRD', 'SUPER_ADMIN', 'IHRD', TRUE);

-- 3. Seed Students Profile
INSERT INTO students (user_id, student_id, department, year_of_study)
VALUES
('STU001', 'STU001', 'Computer Science & Engineering', 3);

-- 4. Seed Initial Baseline Complaint (For demo readiness)
INSERT INTO complaints (
    id, ticket_id, reporter_id, reporter_name, reporter_email, reporter_college_code, target_college_code,
    report_type, category, category_id, title, description, building, floor, room,
    student_priority, system_priority, priority_score, priority_reason, status,
    sla_due_at, created_at, updated_at
) VALUES (
    'comp-seed-101', 'CE-CEK-2026-000101', 'STU001', 'Sample Student', 'student@pariharam.demo', 'CEK', 'CEK',
    'OWN_COLLEGE', 'Electrical', 'electrical', 'Flickering lights in Room 204',
    'Multiple LED tube lights are flickering rapidly creating difficulty during lectures.',
    'Main Academic Block', '2nd Floor', 'Room 204',
    'MEDIUM', 'MEDIUM', 65, 'Standard classroom electrical grievance', 'IN_PROGRESS',
    CURRENT_TIMESTAMP + INTERVAL '48' HOUR, CURRENT_TIMESTAMP - INTERVAL '24' HOUR, CURRENT_TIMESTAMP
);

INSERT INTO complaint_status_history (complaint_id, from_status, to_status, actor_id, actor_name, actor_role, comment, created_at)
VALUES
('comp-seed-101', NULL, 'SUBMITTED', 'STU001', 'Sample Student', 'STUDENT', 'Complaint submitted via Student Portal', CURRENT_TIMESTAMP - INTERVAL '24' HOUR),
('comp-seed-101', 'SUBMITTED', 'UNDER_REVIEW', 'ADMIN001', 'CEK Campus Administrator', 'COLLEGE_ADMIN', 'Grievance reviewed by Nodal Officer', CURRENT_TIMESTAMP - INTERVAL '18' HOUR),
('comp-seed-101', 'UNDER_REVIEW', 'IN_PROGRESS', 'ADMIN001', 'CEK Campus Administrator', 'COLLEGE_ADMIN', 'Assigned to Electrical maintenance team', CURRENT_TIMESTAMP - INTERVAL '12' HOUR);

INSERT INTO notifications (id, user_id, role, title, message, complaint_id, is_read, created_at)
VALUES
('notif-seed-1', 'STU001', 'STUDENT', 'Status Updated to IN_PROGRESS', 'Your complaint CE-CEK-2026-000101 is now under active repair by the electrical crew.', 'comp-seed-101', FALSE, CURRENT_TIMESTAMP - INTERVAL '12' HOUR);

INSERT INTO audit_logs (actor_id, actor_role, action, entity_type, entity_id, metadata, created_at)
VALUES
('STU001', 'STUDENT', 'LOGIN_SUCCESS', 'USER', 'STU001', '{"ip": "127.0.0.1"}', CURRENT_TIMESTAMP - INTERVAL '25' HOUR),
('STU001', 'STUDENT', 'COMPLAINT_CREATED', 'COMPLAINT', 'comp-seed-101', '{"ticketId": "CE-CEK-2026-000101"}', CURRENT_TIMESTAMP - INTERVAL '24' HOUR),
('ADMIN001', 'COLLEGE_ADMIN', 'STATUS_CHANGED', 'COMPLAINT', 'comp-seed-101', '{"from": "UNDER_REVIEW", "to": "IN_PROGRESS"}', CURRENT_TIMESTAMP - INTERVAL '12' HOUR);
