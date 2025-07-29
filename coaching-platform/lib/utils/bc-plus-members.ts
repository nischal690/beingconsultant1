/**
 * List of email addresses that should automatically be granted BC Plus membership
 * upon signup or onboarding
 */
export const bcPlusMemberEmails = [
  'sanjeev.kamiri@gmail.com',
  'prateek1.srivastava@gmail.com',
  'divyapatil278@gmail.com',
  'hamza.peljto@gmail.com',
  'avanijain2897@gmail.com',
  'aditya15shiv@gmail.com',
  'yash.nagar@insead.edu',
  'vazetanya@yahoo.com',
  'ritu.annroygeorge@insead.edu',
  'shwetatiwari_6@yahoo.co.in',
  'nrj127@gmail.com',
  '2009.nilesh.patil@gmail.com',
  'abdullah.siddiqui24D@insead.edu',
  'nischal.n@xcellify.com',
  'nlpworkspace2@gmail.com',
  'prathapsankar@outlook.com',
  'shakshiagarwal.dm@gmail.com',
  'tanushe@gmail.com',
  
];

/**
 * Check if an email address is in the BC Plus members list
 * @param email The email address to check
 * @returns boolean indicating if the email is a BC Plus member
 */
export function isBCPlusMember(email: string): boolean {
  if (!email) return false;
  
  // Normalize email by converting to lowercase for case-insensitive comparison
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check if the email is in the BC Plus members list
  return bcPlusMemberEmails.some(memberEmail => 
    memberEmail.toLowerCase().trim() === normalizedEmail
  );
}
