export const suggestedQuestions = [
  'How can I submit a grievance?',
  'How can I track my grievance?',
  'Why is my grievance still pending?',
  'What categories can I report?'
];

export const intents = [
  { id: 'TRACK_GRIEVANCE', priority: 100, phrases: ['track complaint', 'track grievance', 'check status', 'complaint status', 'grievance status', 'application status', 'track my submitted grievance'], terms: ['track', 'status', 'tracking'], synonyms: ['follow up', 'where is'] },
  { id: 'PENDING_GRIEVANCE', priority: 90, phrases: ['under review', 'not resolved', 'still pending', 'waiting for response'], terms: ['pending', 'delayed', 'waiting'], synonyms: ['no update'] },
  { id: 'SUBMIT_GRIEVANCE', priority: 80, phrases: ['submit complaint', 'submit grievance', 'new grievance', 'register complaint', 'report issue', 'file complaint'], terms: ['submit', 'report', 'register'], synonyms: ['raise an issue', 'make a complaint'] },
  { id: 'RESOLUTION', priority: 70, phrases: ['resolution details', 'view resolution', 'mark as resolved'], terms: ['resolved', 'resolution', 'completed', 'closed', 'finished'], synonyms: ['fixed', 'complete'] },
  { id: 'LOGIN_ACCOUNT', priority: 65, phrases: ['forgot password', 'sign in', 'log in'], terms: ['login', 'password', 'account'], synonyms: ['credentials'] },
  { id: 'CATEGORIES', priority: 60, phrases: ['grievance category', 'complaint category'], terms: ['category', 'academic', 'examination', 'infrastructure', 'transportation', 'facilities'], synonyms: ['amenities', 'exam'] },
  { id: 'FACULTY', priority: 55, phrases: ['assigned grievance', 'review complaint'], terms: ['faculty', 'staff', 'teacher', 'assigned'], synonyms: ['work queue'] },
  { id: 'ADMINISTRATOR', priority: 50, phrases: ['manage users', 'view reports'], terms: ['administrator', 'admin', 'assign', 'analytics', 'reports'], synonyms: ['allocate'] },
  { id: 'GREETING', priority: 40, phrases: ['good morning', 'good afternoon', 'good evening'], terms: ['hello', 'hi', 'hey'], synonyms: ['greetings'] },
  { id: 'HELP', priority: 10, phrases: ['how to use', 'need help'], terms: ['help', 'support', 'guide', 'assistance'], synonyms: ['what can you do'] }
];
