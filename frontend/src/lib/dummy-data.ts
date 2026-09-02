// Dummy data for SentinelAI demo

export const scamReports = [
  { id: 1, user: "Aarav Sharma", message: "Your KYC will expire today, click http://bit.ly/kyc-renew", scam_type: "Phishing", risk: 92, city: "Mumbai", date: "2025-06-22" },
  { id: 2, user: "Priya Patel", message: "Congratulations! You won ₹50,00,000 lottery. Send Aadhaar.", scam_type: "Lottery", risk: 88, city: "Ahmedabad", date: "2025-06-22" },
  { id: 3, user: "Rahul Verma", message: "I am from CBI. Your number is involved in a money laundering case.", scam_type: "Impersonation", risk: 95, city: "Delhi", date: "2025-06-21" },
  { id: 4, user: "Sneha Iyer", message: "Investment opportunity – 30% guaranteed monthly returns via Telegram.", scam_type: "Investment", risk: 81, city: "Bengaluru", date: "2025-06-21" },
  { id: 5, user: "Mohammed Khan", message: "Your electricity bill is unpaid. Power will be cut in 1 hour.", scam_type: "Utility", risk: 76, city: "Hyderabad", date: "2025-06-20" },
  { id: 6, user: "Ananya Nair", message: "Pay ₹2 to update FASTag. Click here", scam_type: "Phishing", risk: 84, city: "Kochi", date: "2025-06-20" },
];

export const fraudTypes = [
  { name: "Phishing", value: 38, color: "oklch(0.82 0.15 210)" },
  { name: "Impersonation", value: 24, color: "oklch(0.65 0.18 240)" },
  { name: "Investment", value: 18, color: "oklch(0.78 0.16 75)" },
  { name: "Lottery", value: 12, color: "oklch(0.72 0.17 155)" },
  { name: "Utility", value: 8, color: "oklch(0.62 0.22 25)" },
];

export const trendData = [
  { month: "Jan", reports: 420, blocked: 380 },
  { month: "Feb", reports: 510, blocked: 460 },
  { month: "Mar", reports: 680, blocked: 610 },
  { month: "Apr", reports: 740, blocked: 690 },
  { month: "May", reports: 920, blocked: 850 },
  { month: "Jun", reports: 1180, blocked: 1080 },
];

export const hotspots = [
  { city: "Mumbai", state: "Maharashtra", lat: 19.07, lng: 72.87, reports: 1842, top: "Phishing" },
  { city: "Delhi", state: "Delhi", lat: 28.61, lng: 77.21, reports: 2104, top: "Impersonation" },
  { city: "Bengaluru", state: "Karnataka", lat: 12.97, lng: 77.59, reports: 1356, top: "Investment" },
  { city: "Hyderabad", state: "Telangana", lat: 17.39, lng: 78.49, reports: 982, top: "Utility" },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.08, lng: 80.27, reports: 874, top: "Phishing" },
  { city: "Kolkata", state: "West Bengal", lat: 22.57, lng: 88.36, reports: 763, top: "Lottery" },
  { city: "Ahmedabad", state: "Gujarat", lat: 23.02, lng: 72.57, reports: 645, top: "Investment" },
  { city: "Pune", state: "Maharashtra", lat: 18.52, lng: 73.85, reports: 591, top: "Phishing" },
];

export const chatHistory = [
  { id: 1, role: "user" as const, text: "I got an SMS saying my SBI account will be blocked. Is it real?" },
  { id: 2, role: "ai" as const, text: "That message has classic phishing signs. Banks never ask you to click links to 'unblock' accounts. Do NOT click. Forward the SMS to 1909 and report on the National Cybercrime Portal (cybercrime.gov.in). I can guide you through filing a report." },
  { id: 3, role: "user" as const, text: "Someone is calling me pretending to be from TRAI saying my number will be disconnected." },
  { id: 4, role: "ai" as const, text: "This is the rapidly growing 'TRAI Disconnection' / 'Digital Arrest' scam. TRAI does not call individuals about disconnection. Hang up immediately, block the number, and report it on Sanchar Saathi (sancharsaathi.gov.in) and at 1930." },
];

export const suggestedQuestions = [
  "How do I report a UPI fraud?",
  "Is this WhatsApp investment group safe?",
  "What is 'digital arrest' scam?",
  "How to recover money lost to OTP fraud?",
];

export const adminAlerts = [
  { id: 1, severity: "Critical", title: "Surge in 'Digital Arrest' calls — Delhi NCR", count: 142, time: "12 min ago" },
  { id: 2, severity: "High", title: "Fake SBI YONO APK circulating on WhatsApp", count: 87, time: "1 hr ago" },
  { id: 3, severity: "High", title: "Investment scam Telegram group flagged", count: 54, time: "2 hr ago" },
  { id: 4, severity: "Medium", title: "FASTag renewal phishing campaign", count: 31, time: "4 hr ago" },
];

export const users = [
  { id: 1, name: "Aarav Sharma", email: "aarav@example.com", role: "citizen", joined: "2025-03-12", reports: 4 },
  { id: 2, name: "Priya Patel", email: "priya@example.com", role: "citizen", joined: "2025-04-02", reports: 2 },
  { id: 3, name: "Insp. R. Nair", email: "nair@police.gov.in", role: "officer", joined: "2025-01-18", reports: 27 },
  { id: 4, name: "Admin", email: "admin@sentinel.ai", role: "admin", joined: "2024-12-01", reports: 0 },
];

export const scamTypeOptions = [
  "Phishing", "Impersonation", "Investment", "Lottery", "Utility",
  "Job Offer", "Romance", "OTP Fraud", "UPI Fraud", "Other",
];

export const indianStates = [
  "Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu",
  "West Bengal", "Gujarat", "Uttar Pradesh", "Rajasthan", "Kerala", "Punjab",
];
