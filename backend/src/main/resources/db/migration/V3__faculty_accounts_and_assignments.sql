ALTER TABLE users ADD COLUMN department VARCHAR(100);

ALTER TABLE complaints ADD COLUMN assigned_faculty_id VARCHAR(50) REFERENCES users(id);
ALTER TABLE complaints ADD COLUMN assigned_faculty_name VARCHAR(150);
ALTER TABLE complaints ADD COLUMN assigned_department VARCHAR(100);
ALTER TABLE complaints ADD COLUMN assignment_due_date DATE;

CREATE INDEX idx_complaints_assigned_faculty ON complaints(assigned_faculty_id);
