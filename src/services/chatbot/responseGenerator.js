const responses = {
  GREETING: 'Welcome to PARIHAARAM. I can guide you through submitting a grievance, checking updates, and using your role’s workspace.',
  SUBMIT_GRIEVANCE: 'Students can submit a grievance from the “Report a problem” page. Add a clear title, category, description, location, and any supporting evidence, then submit to receive a reference number.',
  TRACK_GRIEVANCE: 'Open “My reports” in the student portal to see each grievance, its current status, and the recorded timeline. You must sign in to view your own records.',
  PENDING_GRIEVANCE: 'Open the grievance from “My reports” to review its latest status and timeline. If it is still awaiting action, the recorded updates are the source of truth; I cannot see or predict an individual case here.',
  RESOLUTION: 'Open a resolved grievance to read its resolution details and evidence. The reporting student can confirm the resolution or request reopening from the grievance page.',
  LOGIN_ACCOUNT: 'Use the sign-in page for your role. Student accounts can be registered on the student portal; faculty accounts are provisioned by an administrator. If you cannot sign in, contact your college administrator to verify your account.',
  CATEGORIES: 'The grievance form offers Infrastructure & Civil; Electrical & Lighting; Water & Plumbing; Network, Wi-Fi & IT; Cleanliness & Sanitation; Canteen & Food Quality; Library & Resources; and General / Other. Choose the closest match and describe the issue clearly.',
  FACULTY: 'Sign in through the faculty portal to review grievances assigned to you. Assignment and status actions depend on the permissions enabled for your account.',
  ADMINISTRATOR: 'Administrators can review grievances for their authorized college, assign eligible faculty, manage accounts, and view available reports from the admin workspace.',
  HELP: 'I can explain submission, tracking, statuses, account access, and role workspaces. Try one of the suggested questions below.'
};

export function generateResponse(result, role) {
  if (result.intent === 'AMBIGUOUS') return 'I’m not sure which you mean. Are you trying to submit a grievance, track one, or check a pending update?';
  if (result.intent === 'FALLBACK' || result.confidence < 0.2) return 'I’m not sure I understood. I can help with submitting or tracking a grievance, account access, categories, or role-specific guidance.';
  let response = responses[result.intent] || responses.HELP;
  if (result.intent === 'FACULTY' && role !== 'FACULTY') response = 'Faculty instructions: ' + responses.FACULTY;
  if (result.intent === 'ADMINISTRATOR' && !['COLLEGE_ADMIN', 'SUPER_ADMIN', 'ADMIN'].includes(role)) response = 'Administrator instructions: ' + responses.ADMINISTRATOR;
  return response;
}
