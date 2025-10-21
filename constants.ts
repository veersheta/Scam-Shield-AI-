import { Type } from '@google/genai';
import { ScamReport, User, DashboardStats, RegionalResources, TakedownResource, ReportingGuide } from './types';

export const QUICK_SCAN_MODEL = 'gemini-2.5-flash';
export const DEEP_ANALYSIS_MODEL = 'gemini-2.5-pro';

export const DEEP_ANALYSIS_PROMPT = `Perform a deep and thorough analysis of the following message for sophisticated scam tactics, emotional manipulation, and linguistic red flags. Consider the context, tone, and any psychological tricks being employed. The message is:`;

// FIX: Updated prompt to remove "Use Google Search" to be compatible with JSON output mode.
export const QUICK_SCAN_PROMPT = `Analyze the following message for potential scams. Check for information about current scams, suspicious links, or entities mentioned. Provide your analysis as a valid JSON object only, with no markdown formatting or any other text outside the JSON. The JSON object should have the following structure: { "isScam": boolean, "riskLevel": "Low" | "Medium" | "High", "explanation": string, "confidenceScore": number (0-1) }. Message to analyze:`;

export const EMAIL_ANALYSIS_PROMPT = `Analyze the following email for signs of a phishing attempt or scam. Pay close attention to the sender's address, the subject line, and the email body. Look for urgency, threats, suspicious links (even if not clickable), grammatical errors, and whether the sender's email domain matches the purported company. Provide your analysis as a valid JSON object only, with no markdown formatting. The JSON object should have the structure: { "isScam": boolean, "riskLevel": "Low" | "Medium" | "High", "explanation": string, "confidenceScore": number (0-1) }.`;

export const URL_ANALYSIS_PROMPT = `Act as a cybersecurity expert. Analyze the following URL for signs of phishing or malicious intent. Do not visit the URL. Perform a static analysis of the URL string itself. Look for these red flags:
1. Domain Spoofing: Does the domain look like a well-known brand but is slightly misspelled (e.g., 'go0gle.com')?
2. Homoglyphs: Are there any characters that look like others (e.g., 'l' vs 'I', 'o' vs '0')?
3. Suspicious TLD: Is it using an uncommon or suspicious top-level domain (e.g., .zip, .mov, .xyz)?
4. Subdomain Abuse: Are there excessive or misleading subdomains (e.g., 'yourbank.com.secure-login.net')?
5. URL Shorteners: Is a URL shortener like bit.ly or tinyurl used to hide the final destination?
6. Keywords: Does the path or query parameters contain urgent or alarming words like 'login', 'verify', 'secure', 'account-update', 'suspended'?
Provide your analysis as a valid JSON object only, with no markdown formatting. The JSON object should have the structure: { "isScam": boolean, "riskLevel": "Low" | "Medium" | "High", "explanation": string, "confidenceScore": number (0-1) }. URL to analyze:`;

export const ANALYSIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isScam: { type: Type.BOOLEAN, description: 'Whether the message is classified as a scam.' },
    riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'], description: 'The assessed risk level.' },
    explanation: { type: Type.STRING, description: 'A detailed explanation of the reasoning behind the classification.' },
    confidenceScore: { type: Type.NUMBER, description: 'A score from 0.0 to 1.0 indicating confidence in the assessment.' },
  },
  required: ['isScam', 'riskLevel', 'explanation', 'confidenceScore'],
};

export const QUIZ_DATA = [
  {
    question: "You receive an email with a link to reset your bank password, which you didn't request. What's the safest action?",
    options: [
      "Click the link and change your password just in case.",
      "Ignore the email and delete it.",
      "Go to your bank's official website directly and check your account status.",
      "Reply to the email to ask if it's legitimate."
    ],
    correctAnswerIndex: 2,
    explanation: "This is a classic phishing attempt. Never click links in unsolicited emails. Always navigate to official websites directly by typing the URL yourself to ensure you're on the legitimate site."
  },
  {
    question: "A message from an unknown number claims you've won a lottery. To claim your prize, you need to pay a small 'processing fee'. This is likely a...",
    options: [
      "Legitimate win, but with standard fees.",
      "Advance-fee scam.",
      "Mistake, intended for someone else.",
      "Marketing survey."
    ],
    correctAnswerIndex: 1,
    explanation: "This is an advance-fee scam. Legitimate lotteries or prizes do not require you to pay a fee to receive your winnings. Any request for money upfront is a major red flag."
  },
  {
    question: "What is 'social engineering' in the context of scams?",
    options: [
      "A type of software used to build social networks.",
      "A government program for community planning.",
      "Manipulating people into divulging confidential information.",
      "An engineering discipline focused on public infrastructure."
    ],
    correctAnswerIndex: 2,
    explanation: "Social engineering is the psychological manipulation of people into performing actions or divulging confidential information. Scammers use it to gain your trust and trick you."
  },
  {
    question: "You see an online ad for a product at a price that's 'too good to be true'. What should you be cautious of?",
    options: [
      "The product might be of low quality.",
      "The website might be fake, designed to steal your credit card info.",
      "The shipping might take a long time.",
      "All of the above."
    ],
    correctAnswerIndex: 3,
    explanation: "Extremely low prices are a common lure for scam websites. They might sell counterfeit goods, low-quality items, or nothing at all, with the primary goal of harvesting your personal and financial details."
  },
  {
    question: "What is the primary purpose of Multi-Factor Authentication (MFA)?",
    options: [
      "To make your password longer and harder to guess.",
      "To add an extra layer of security beyond just a password.",
      "To automatically log you into all your accounts.",
      "To speed up the login process."
    ],
    correctAnswerIndex: 1,
    explanation: "MFA adds a crucial second step to logging in, like a code from your phone, making it much harder for attackers to get in even if they steal your password."
  },
  {
    question: "You're at a coffee shop and need to check your bank account. What's the safest way to do it?",
    options: [
      "Use the free, public Wi-Fi provided by the shop.",
      "Use your phone's cellular data (hotspot) instead of the public Wi-Fi.",
      "Ask the barista if the Wi-Fi is secure.",
      "Connect to the Wi-Fi but use incognito mode."
    ],
    correctAnswerIndex: 1,
    explanation: "Public Wi-Fi networks are often unencrypted, meaning hackers on the same network could potentially intercept your data. Using your own cellular data is a much safer alternative for sensitive activities."
  },
  {
    question: "A pop-up appears on your screen with a loud alarm, stating 'VIRUS DETECTED! Call Microsoft Support at 1-800-XXX-XXXX immediately!' What should you do?",
    options: [
      "Call the number immediately to get the virus removed.",
      "Click the 'Scan Now' button on the pop-up.",
      "Close the browser tab or restart your computer. Do not call the number.",
      "Provide your credit card details to pay for the 'support'."
    ],
    correctAnswerIndex: 2,
    explanation: "This is a common tech support scam. Legitimate companies like Microsoft will never use scary pop-ups asking you to call a number. The goal is to gain remote access to your computer and charge you for fake services."
  },
  {
    question: "A person claiming to be from the IRS calls and says you owe back taxes, which you must pay immediately using Google Play gift cards. This is a scam because...",
    options: [
      "The IRS only accepts Apple gift cards.",
      "You can't pay taxes with gift cards.",
      "Legitimate government agencies and businesses will never demand payment in the form of gift cards.",
      "The IRS only communicates through text messages."
    ],
    correctAnswerIndex: 2,
    explanation: "Gift cards are a scammer's favorite because they are like cash—once the code is used, the money is gone and it's virtually untraceable. No legitimate organization will ever demand payment via gift cards."
  },
  {
    question: "You receive an SMS: 'Your account has been suspended due to suspicious activity. Click here to verify your identity: [shortened link]'. What is the biggest red flag?",
    options: [
      "The message was sent via SMS instead of email.",
      "The use of a generic, shortened link (e.g., bit.ly) that hides the true destination.",
      "The message uses a serious tone.",
      "The message doesn't address you by your full name."
    ],
    correctAnswerIndex: 1,
    explanation: "While other elements can be suspicious, the shortened, non-official link is the most dangerous red flag in 'smishing'. It's designed to take you to a fake website to steal your login credentials."
  },
  {
    question: "You see a QR code on a parking meter that says 'Scan to Pay for Parking'. What is a potential risk?",
    options: [
      "The QR code might be a sticker placed over the real one, leading to a fake payment site.",
      "QR codes can't be used for payments.",
      "Scanning the code will drain your phone battery.",
      "The city only allows payment via coins."
    ],
    correctAnswerIndex: 0,
    explanation: "Scammers can place malicious QR code stickers over legitimate ones. Scanning them can lead you to a phishing website that steals your payment information or installs malware on your device. Always be wary of QR codes in public places."
  },
  {
    question: "What is a 'pig butchering' scam?",
    options: [
      "A scam involving the sale of counterfeit farm equipment.",
      "A scam where a person receives a wrong number text, which develops into a long-term friendship and then a fraudulent investment opportunity.",
      "A phishing email disguised as a promotion from a BBQ restaurant.",
      "A scam where a hacker threatens to delete your files unless you pay a ransom."
    ],
    correctAnswerIndex: 1,
    explanation: "'Pig butchering' is a long-con scam. The scammer 'fattens up the pig' (the victim) by building trust and a relationship over weeks or months before convincing them to invest in a fake cryptocurrency or trading platform."
  },
  {
    question: "What is the main security advantage of using a password manager?",
    options: [
      "It lets you use the same simple password for everything.",
      "It allows you to create and store long, unique, complex passwords for every account without needing to memorize them.",
      "It shares your passwords with tech support so they can help you faster.",
      "It types your passwords for you so you don't have to."
    ],
    correctAnswerIndex: 1,
    explanation: "A password manager's greatest strength is enabling you to have a different, strong, and complex password for every single online account. This prevents a breach on one site from compromising your other accounts (a 'credential stuffing' attack)."
  },
  {
    question: "Your phone suddenly loses all service, and you can't make calls or use data. This could be a sign of what type of attack?",
    options: [
      "A virus has infected your phone's antenna.",
      "A SIM swap scam, where a scammer has transferred your number to their own SIM card.",
      "Your phone is simply too old to get a signal.",
      "There is a widespread network outage affecting everyone."
    ],
    correctAnswerIndex: 1,
    explanation: "In a SIM swap attack, scammers trick your mobile carrier into porting your number to a SIM they control. This allows them to intercept security codes (MFA) sent via text to take over your sensitive accounts, like bank and email."
  },
  {
    question: "You work in finance and receive an URGENT email from your 'CEO' asking you to immediately wire $15,000 to a new vendor. What's the best course of action?",
    options: [
      "Wire the money immediately as requested to not anger the CEO.",
      "Reply to the email to confirm the bank details are correct.",
      "Independently verify the request through a different channel, like calling the CEO or your direct manager on a known number.",
      "Forward the email to the new vendor to let them know payment is coming."
    ],
    correctAnswerIndex: 2,
    explanation: "This is a classic Business Email Compromise (BEC) or CEO fraud scam. Scammers use urgency and authority to pressure employees into making fraudulent payments. Always verify such requests out-of-band (i.e., not by replying to the email)."
  },
  {
    question: "When entering payment information on a website, what should you look for in your browser's address bar to ensure the connection is secure?",
    options: [
      "The website's address starts with 'http://'.",
      "The website has a professional-looking logo.",
      "The website's address starts with 'https://' and shows a lock icon.",
      "The website promises not to share your data."
    ],
    correctAnswerIndex: 2,
    explanation: "'https://' indicates that the connection between your browser and the website is encrypted, making it much harder for attackers to intercept your data. The lock icon is a visual confirmation of this secure connection. While not foolproof, it's a critical first check."
  },
  {
    question: "After weeks of online chatting, your new romantic interest suddenly needs $2,000 for a medical emergency but can't use their bank. They ask for gift cards. What is this?",
    options: ["A genuine request from a person in need.", "A standard way to transfer money internationally.", "A major red flag for a romance scam.", "A test of your commitment to the relationship."],
    correctAnswerIndex: 2,
    explanation: "Scammers build emotional connections to exploit victims financially. Requests for money, especially via untraceable methods like gift cards or wire transfers, for a person you've never met in person, are classic signs of a romance scam."
  },
  {
    question: "You're invited to a 'guaranteed high-return' crypto investment group on Telegram by a stranger. They show screenshots of huge profits. What should you be wary of?",
    options: ["This is a rare, exclusive opportunity.", "The investment platform they promote is likely fake and designed to steal your funds.", "The high returns are normal for cryptocurrency.", "You should invest a small amount first to test it."],
    correctAnswerIndex: 1,
    explanation: "Scammers create fake crypto trading platforms. Any 'investment' you make goes directly to them. Guaranteed high returns with little to no risk are always a sign of a scam."
  },
  {
    question: "After a natural disaster, you receive an emotional plea to donate to a relief fund via a GoFundMe link in an unsolicited email. What's the safest way to donate?",
    options: ["Click the link, it's the fastest way to help.", "Verify the charity's legitimacy through independent sources (like Charity Navigator) and donate directly on their official website.", "Reply to the email to ask for more details.", "Donate a small amount to see if it's real."],
    correctAnswerIndex: 1,
    explanation: "Scammers exploit tragedies by creating fake charities. Always go directly to the official website of a known, reputable organization to donate rather than clicking on unsolicited links."
  },
  {
    question: "You get a call from someone claiming to be from the Social Security Administration, saying your number is suspended and you face arrest if you don't pay a fine. What should you do?",
    options: ["Pay the fine immediately to avoid legal trouble.", "Provide your Social Security number to verify your identity.", "Hang up immediately. Government agencies will never call to threaten you or demand immediate payment.", "Ask for their badge number and a case file number."],
    correctAnswerIndex: 2,
    explanation: "This is a scare tactic. Government agencies like the SSA or IRS initiate contact via mail, not with threatening phone calls demanding payment via gift cards, wire transfers, or cryptocurrency."
  },
  {
    question: "A website suddenly freezes your browser and displays a message: 'Your computer is infected with a Trojan! Click here to download our free scanner.' This is likely...",
    options: ["A helpful alert from your operating system.", "A legitimate antivirus company offering a free tool.", "A trick to get you to download malware or a Potentially Unwanted Program (PUP).", "A standard browser security feature."],
    correctAnswerIndex: 2,
    explanation: "This is a malvertising tactic. The 'free scanner' is the malware itself. Close the browser tab (using Task Manager if needed) and run a scan with your own trusted antivirus software."
  },
  {
    question: "You get an email that says 'Your Geek Squad subscription for $499 has been renewed. If you did not authorize this, call 1-800-XXX-XXXX immediately.' You don't have a subscription. What's the goal of this scam?",
    options: ["To genuinely inform you of a renewal.", "To get you to call the number so they can gain remote access to your PC or sell you fake services.", "To verify that your email address is active for marketing.", "To offer you a real discount on tech support."],
    correctAnswerIndex: 1,
    explanation: "This is a refund/tech support scam. When you call, they'll create a fake problem and charge you to 'fix' it, or trick you into installing remote access software."
  },
  {
    question: "You receive a DM on Instagram: 'OMG did you see this picture of you? [malicious link]'. This is an attempt to...",
    options: ["Show you a funny picture.", "Steal your Instagram login credentials by taking you to a fake login page.", "Help you increase your follower count.", "Share a news article with you."],
    correctAnswerIndex: 1,
    explanation: "This is a common phishing tactic to hijack social media accounts. The link leads to a fake login page. Once you enter your credentials, the scammer has control of your account."
  },
  {
    question: "When selling an item on Facebook Marketplace, a buyer offers to pay you MORE than the asking price via Zelle or Venmo and asks you to send the extra money to their 'shipper'. This is...",
    options: ["A generous offer from a serious buyer.", "A standard practice for online sales.", "A common overpayment scam using stolen funds. The initial payment will be reversed, and you'll lose the money you sent.", "A way to cover extra shipping costs."],
    correctAnswerIndex: 2,
    explanation: "In an overpayment scam, the scammer uses a stolen account or card to send you money. You forward the 'extra' cash, but the original fraudulent payment is eventually reversed by the bank, leaving you responsible for the loss."
  },
  {
    question: "A 'work from home' job offer involves receiving packages, repackaging them, and shipping them to a different address. The pay is very high for simple work. This job is likely...",
    options: ["A great opportunity in the logistics industry.", "A position as a 'parcel mule', illegally reshipping goods bought with stolen credit cards.", "A temporary job for a new startup.", "A product testing role."],
    correctAnswerIndex: 1,
    explanation: "This is a classic parcel mule scheme. You are being used to move illegally obtained goods, making it harder for law enforcement to track the criminals. Participating, even unknowingly, can have serious legal consequences."
  },
  {
    question: "An elderly relative gets a frantic call from someone pretending to be their grandchild, who says they're in jail and need bail money wired immediately, begging 'please don't tell mom and dad'. What's the best advice?",
    options: ["Send the money quickly to help their grandchild.", "Keep it a secret as requested.", "Hang up and call the grandchild or their parents directly on a known, trusted phone number to verify the story.", "Ask the caller security questions only the real grandchild would know."],
    correctAnswerIndex: 2,
    explanation: "This scam preys on emotion and urgency. The best defense is to independently verify the claim by contacting the person (or their family) through a separate, known communication channel."
  },
  {
    question: "You get an email about a data breach at a service you use. It says 'Click here IMMEDIATELY to secure your account.' How can you tell if it's a real notification or a phishing attempt?",
    options: ["Real notifications never ask you to click a link.", "Hover over the link to see the true web address; if it's not the official domain, it's a scam. Better yet, log in through the official site, not the link.", "If the email has the company's logo, it's legitimate.", "Phishing emails always have spelling mistakes."],
    correctAnswerIndex: 1,
    explanation: "Scammers use fake data breach alerts to create panic. Never trust links in the email. Always go directly to the company's website or app to check for notifications and change your password."
  },
  {
    question: "You see a charge on your credit card for an antivirus subscription you don't remember. The transaction description includes a phone number to call for disputes. Why is calling this number risky?",
    options: ["It's not risky; it's the official way to get a refund.", "The phone number is part of the scam, designed to connect you with a fake agent who will try to sell you more useless services or install malware.", "The call will have very high per-minute charges.", "They will only offer you store credit instead of a refund."],
    correctAnswerIndex: 1,
    explanation: "This is a variant of the tech support scam. The initial charge might be fake or real, but the phone number is controlled by scammers. They will use the call to escalate the scam."
  },
  {
    question: "You receive an email claiming the sender has a recording of you visiting adult websites and will send it to your contacts unless you pay a ransom in Bitcoin. What should you do?",
    options: ["Pay the ransom to protect your reputation.", "Reply to the email and try to negotiate.", "Delete the email and ignore it. It's almost always a bluff, using old passwords from data breaches to scare you.", "Report the email to your ISP."],
    correctAnswerIndex: 2,
    explanation: "This is a scareware tactic. They usually have no such recording. The password they mention is often from a past public data breach. Do not pay. Mark as spam and delete."
  },
  {
    question: "A business receives an email with an invoice for 'consulting services' they never ordered from a company they don't recognize. The goal of this scam is...",
    options: ["To see if the business's accounting department is paying attention.", "To trick a busy employee into paying a fake invoice without proper verification.", "A simple administrative mistake from the sender.", "A way to introduce a new vendor's services."],
    correctAnswerIndex: 1,
    explanation: "Scammers send fake invoices hoping they'll be paid by an accounts payable department that doesn't scrutinize small amounts or familiar-looking vendor names. Always verify invoices with the person who supposedly requested the service."
  },
  {
    question: "An ad on social media offers a 7-night luxury resort stay for an incredibly low price, like $299. The link goes to a beautiful but unfamiliar booking site. This could be a scam to...",
    options: ["Promote a new resort with a limited-time offer.", "Steal your credit card details and personal information on a fake booking site.", "Sign you up for a legitimate travel club.", "A great last-minute deal."],
    correctAnswerIndex: 1,
    explanation: "If a deal looks too good to be true, it probably is. Scammers create slick, fake travel websites to harvest financial data or take your money for a vacation that doesn't exist. Stick to reputable, well-known booking sites."
  },
  {
    question: "You get a call offering to help you enroll in a 'special' student loan forgiveness program for an upfront fee. This is a scam because...",
    options: ["All student loan programs have fees.", "Only a few companies are authorized to do this.", "You should never pay an upfront fee for help with student loans. Legitimate assistance is available for free from the Department of Education.", "The program they mentioned is real, but they are overcharging for it."],
    correctAnswerIndex: 2,
    explanation: "Scammers prey on the complexity of student loans. Never pay for help you can get for free from official government sources (like studentaid.gov). Upfront fees for credit or debt help are a major red flag."
  },
  {
    question: "A popular YouTuber's comment section is filled with replies from accounts that look like the creator, saying 'You've won! Contact me on Telegram to claim your prize!' This is...",
    options: ["The real creator running a surprise giveaway.", "A scam using impersonator accounts to lure victims off-platform to an advance-fee or phishing scam.", "A new feature by YouTube to reward commenters.", "Fans of the creator having fun."],
    correctAnswerIndex: 1,
    explanation: "Scammers create convincing impersonator accounts (often with a slight misspelling). They'll ask for a 'shipping fee' or personal data to 'claim' a prize that doesn't exist."
  },
  {
    question: "You receive a voice message that sounds exactly like your boss, asking you to urgently purchase several hundred dollars in gift cards for a client and text them the codes. What is the most critical verification step?",
    options: ["Text your boss back to confirm the amount.", "Call your boss back on their known, trusted phone number to verify the request verbally.", "Buy the gift cards; the voice was unmistakable.", "Email your boss to create a paper trail."],
    correctAnswerIndex: 1,
    explanation: "AI voice cloning is becoming more accessible. A voice message or even a live call is no longer foolproof verification. You must initiate a separate communication on a trusted channel (like calling their known number) to confirm any unusual or urgent request."
  },
  {
    question: "While browsing, a pop-up from a website (not your browser itself) says 'Your browser is outdated. Install our performance extension to stay secure.' What is the risk?",
    options: ["It's a helpful reminder to update your software.", "The 'extension' is likely adware or spyware that will track your browsing and inject ads.", "This is a standard way that browsers deliver updates.", "The extension will speed up your computer as promised."],
    correctAnswerIndex: 1,
    explanation: "Legitimate browser updates come from the browser itself, not from random website pop-ups. These malicious extensions can steal data, passwords, and hijack your search engine. Only install extensions from official browser stores."
  },
  {
    question: "You get a text from an unknown number: 'Hey, is this Sarah? I had a great time last night.' You're not Sarah. If you reply 'wrong number,' and they try to strike up a friendly conversation, what might be the end goal?",
    options: ["They are just being friendly and made an honest mistake.", "They are a lonely person looking to chat.", "This is the start of a 'pig butchering' scam, where they build a relationship over time to eventually pitch a fraudulent investment.", "They are confirming your number is active to sell to marketers."],
    correctAnswerIndex: 2,
    explanation: "This is a common opening for 'pig butchering' scams. The initial text seems innocent, but it's a calculated tactic to engage you, build trust over weeks or months, and then pivot to convincing you to 'invest' in a fake crypto platform."
  },
  {
    question: "You find a perfect apartment listing online at a great price. The 'landlord' says they're out of town and asks you to wire a security deposit to hold it before you can see it. What is this?",
    options: ["A standard way to secure a competitive rental.", "A necessary step because the landlord is traveling.", "A classic rental scam. Never pay a deposit for a property you haven't seen in person.", "A refundable fee to show you're a serious applicant."],
    correctAnswerIndex: 2,
    explanation: "Legitimate landlords or agents will meet you in person and allow you to view a property before any money changes hands. Requests for wired funds for a deposit on an unseen property are a major red flag for a scam."
  },
  {
    question: "You're selling a couch online. A buyer sends you a check for $500 more than the asking price, claiming it was a mistake. They ask you to deposit the check and wire them the extra $500. What happens next?",
    options: ["You've made an extra $500.", "The buyer's check will eventually bounce, and you will lose the $500 you wired.", "The bank will cover the difference because the check was deposited.", "This is a legitimate way to handle overpayment."],
    correctAnswerIndex: 1,
    explanation: "This is a fake check scam. The check is fraudulent and will be rejected by the bank days later, but by then, the money you wired is long gone. You are responsible for the full amount."
  },
  {
    question: "After being scammed, you find a 'recovery service' online that guarantees they can retrieve your lost money for an upfront fee. You should...",
    options: ["Pay the fee; it's your only chance to get your money back.", "Provide them all the details of the original scam.", "Avoid them. This is likely an advance-fee recovery scam, and you will lose more money.", "Check if they have good reviews on their website."],
    correctAnswerIndex: 2,
    explanation: "Scammers prey on victims twice. Legitimate recovery is handled by law enforcement and banks, not by private firms that charge upfront and make guarantees. These are almost always scams."
  },
  {
    question: "You receive a text from your 'boss': 'I'm in a meeting. I need you to buy four $100 Apple gift cards for a client right now. I'll reimburse you. Please text me the codes when you have them.' What's the best action?",
    options: ["Buy the gift cards immediately to be a helpful employee.", "Text back to ask which client it's for.", "Independently verify the request by calling your boss on their known number. This is a common impersonation scam.", "Email your boss to confirm the request."],
    correctAnswerIndex: 2,
    explanation: "This scam relies on impersonating authority and creating urgency. Any request for payment via gift cards is a massive red flag. Always verify such requests through a different, trusted communication channel."
  },
  {
    question: "You receive a small, inexpensive item (like a phone ring) in the mail from a retailer you don't recognize. What could this be?",
    options: ["A free sample from a new company.", "A gift from a secret admirer.", "A 'brushing scam,' where a seller uses your address to create fake sales and post positive reviews.", "A delivery mistake intended for your neighbor."],
    correctAnswerIndex: 2,
    explanation: "Brushing scams are used to boost a seller's ratings. While you're not directly losing money, it means your personal information (name and address) has been compromised and is being used without your consent."
  },
  {
    question: "What is 'Juice Jacking'?",
    options: ["A scam selling counterfeit fruit juice.", "When a public USB charging port is modified to install malware on or steal data from your device.", "A new type of energy drink promotion.", "A method to speed up your phone's charging time."],
    correctAnswerIndex: 1,
    explanation: "Scammers can load malware onto public USB stations. When you plug in your phone, it can be infected. It's safer to use an AC power outlet with your own charger or carry a portable power bank."
  },
  {
    question: "You find an online ad for a 'free' purebred puppy. The seller says you only need to pay for the 'climate-controlled shipping crate and insurance'. This is likely a scam because...",
    options: ["Purebred puppies are never free.", "They will continue to invent new fees (vet check, etc.) after you pay the first one, and there is no puppy.", "The shipping costs are slightly overestimated.", "All of the above."],
    correctAnswerIndex: 3,
    explanation: "Pet scams lure victims with cute pictures and low prices. They use emotional appeal to trick you into paying a series of escalating, non-existent fees. The animal never arrives."
  },
  {
    question: "You get a message saying you've been approved for a 'free government grant' of $5,000. To receive it, you first need to pay a $150 'processing fee' with a gift card. This is a scam because...",
    options: ["The grant amount is too low to be real.", "Real government grants never require you to pay a fee to receive them.", "Gift cards are not a valid way to pay government fees.", "Both B and C are correct."],
    correctAnswerIndex: 3,
    explanation: "Official government agencies will not contact you via social media or unsolicited messages about grants. More importantly, they will never ask you to pay a fee, especially with a gift card, to receive money."
  },
  {
    question: "An email from a 'law firm' in another country claims you've inherited millions from a distant relative you've never heard of. What's the catch?",
    options: ["You will have to travel to claim the money.", "The email is a scam to trick you into paying fake 'legal fees' or 'taxes' to access the non-existent inheritance.", "The inheritance is real but heavily taxed.", "You have to prove you are the real heir through a DNA test."],
    correctAnswerIndex: 1,
    explanation: "This is a classic advance-fee scam, also known as a 'Nigerian Prince' scam. The goal is to get you to send them money for various fictional fees, after which they will disappear."
  },
  {
    question: "You receive an email: 'Your Airline Miles are expiring! Click here to claim a bonus and keep your account active.' What's the safest response?",
    options: ["Click the link to make sure you don't lose your miles.", "Log in to your airline account directly through their official website or app to check your status.", "Forward the email to a friend to see if they got it too.", "Ignore it; airlines don't send these emails."],
    correctAnswerIndex: 1,
    explanation: "This is likely a phishing attempt to steal your account login and personal information. Never trust links in urgent-sounding emails. Always go directly to the source."
  },
  {
    question: "A website pop-up says, 'Your Flash Player is out of date. Click here to update.' What is the danger?",
    options: ["Flash Player is old technology and is no longer supported; the 'update' is likely malware.", "The update might slow down your computer.", "This is a legitimate update needed for modern websites.", "You might have to pay for the update."],
    correctAnswerIndex: 0,
    explanation: "Adobe officially discontinued Flash Player in 2020. Any pop-up telling you to install or update it is a scam attempting to get you to download malware, adware, or a virus."
  },
  {
    question: "You see a social media ad for a new online store selling brand-name clothing for 80% off. What are the red flags?",
    options: ["The prices are too good to be true.", "The website URL might be a strange variation of the real brand's name.", "There are no customer reviews or contact information other than a simple form.", "All of the above."],
    correctAnswerIndex: 3,
    explanation: "Scammers create fake e-commerce sites that either steal your credit card info, send counterfeit goods, or send nothing at all. Stick to well-known, reputable retailers."
  },
  {
    question: "You get an SMS: 'Your package from [Carrier] is pending due to an unpaid customs fee of $2.95. Please visit [suspicious link] to pay.' This is a...",
    options: ["Standard procedure for international shipping.", "Smishing (SMS phishing) attempt to steal your credit card details for a small, believable amount.", "A mistake from the shipping company.", "A notification that your package is delayed."],
    correctAnswerIndex: 1,
    explanation: "This scam uses a small, plausible fee to lower your guard. The goal isn't the $2.95; it's to harvest your full credit card information and personal details on the fake payment page."
  },
  {
    question: "What is a 'deepfake sextortion' scam?",
    options: ["A person threatens to release real intimate images of you.", "A scammer uses AI to create a fake explicit video or image of you, then threatens to release it unless you pay a ransom.", "A dating app matches you with an AI bot.", "A scam involving counterfeit AI software."],
    correctAnswerIndex: 1,
    explanation: "With the rise of AI, scammers can create convincing fake content. Even if you know it's fake, the threat of public embarrassment is used to extort money. Do not pay, and report the incident to law enforcement."
  },
  {
    question: "An online ad with a famous entrepreneur's face claims he has a 'secret investment system' that guarantees 50% monthly returns. This is a scam because...",
    options: ["Guaranteed, impossibly high returns are a hallmark of investment fraud.", "The celebrity's image is being used without their permission.", "The link will likely lead to a fake trading platform that steals your money.", "All of the above."],
    correctAnswerIndex: 3,
    explanation: "Scammers abuse the trust people have in public figures. Legitimate investments always carry risk and never have 'guaranteed' high returns. This is designed to lure you into a fraudulent investment scheme."
  },
  {
    question: "You search for a company's customer service number. The first result is a sponsored ad with a phone number. What's a potential risk?",
    options: ["There is no risk; sponsored ads are always legitimate.", "The ad could be placed by scammers who will impersonate the company's support to steal your info or charge you for fake services.", "The phone call might have a high cost per minute.", "The support agent will be less experienced."],
    correctAnswerIndex: 1,
    explanation: "Scammers buy search ads for common support queries. When you call their number, they impersonate the company to trick you into giving them account access, personal data, or payment for fraudulent services."
  },
  {
    question: "A pop-up on your screen warns, 'Your free antivirus trial is expiring! Enter your credit card now to avoid leaving your PC unprotected!' This is likely...",
    options: ["A helpful reminder from your legitimate antivirus software.", "A scare tactic from a malicious website to get you to buy a fake or unnecessary security product.", "A standard renewal process for all software.", "A sign that your computer is already infected."],
    correctAnswerIndex: 1,
    explanation: "This is scareware. It creates a sense of panic to rush you into making a payment. Renew your antivirus only through the official software application itself, not through a random browser pop-up."
  },
  {
    question: "A 'fun' social media quiz asks for your first pet's name, the street you grew on, and your mother's maiden name. Why is this risky?",
    options: ["It's not risky; it's just for fun.", "These are common answers to security questions used for password recovery on many accounts.", "The quiz will give your computer a virus.", "The results will be sold to advertisers."],
    correctAnswerIndex: 1,
    explanation: "Scammers create these seemingly innocent quizzes to harvest the answers to common security questions. With this information, they can attempt to take over your accounts by resetting your passwords."
  },
  {
    question: "You receive a robocall warning that your car's extended warranty is about to expire. The call prompts you to 'press 1 to speak to a specialist'. What is the purpose of this call?",
    options: ["A genuine public service announcement.", "A high-pressure sales tactic to sell you an overpriced and often useless service contract.", "A notification from your car's manufacturer.", "A way to verify if your phone number is active."],
    correctAnswerIndex: 1,
    explanation: "These infamous calls are designed to pressure car owners into buying expensive service contracts. They often use vague information and a sense of urgency. It's best to hang up."
  },
  {
    question: "You get a text: 'Your SIM card registration is incomplete. To avoid deactivation, please re-verify your details at [malicious link].' This is an attempt to...",
    options: ["Ensure your phone service is not interrupted.", "Steal your personal identity and account information on a phishing website.", "Update your contact information with your mobile provider.", "Offer you a new phone plan."],
    correctAnswerIndex: 1,
    explanation: "Mobile carriers will not ask you to verify your identity through a random link in a text message. This is a smishing scam to harvest your sensitive personal data for identity theft."
  }
];


export const SCAM_REPORTS_DATA: ScamReport[] = [
  {
    id: 1,
    title: 'The "FedEx Package Pending" Phishing Scam',
    description: "Received a text message claiming a FedEx package is pending and requires me to click a suspicious link to 'confirm delivery details'. The link leads to a fake site asking for personal and credit card information.",
    scamType: 'Phishing',
    tags: ['sms', 'delivery', 'phishing'],
    upvotes: 128,
    downvotes: 5,
    shares: 23,
    submittedBy: 'User_JaneD',
    createdAt: '2024-07-20T10:00:00Z',
  },
  {
    id: 2,
    title: 'Fake Job Offer on LinkedIn',
    description: "A 'recruiter' from a well-known tech company reached out with a too-good-to-be-true job offer. They conducted a quick chat interview and then asked for a 'refundable security deposit' for a work laptop. This is a classic advance-fee scam.",
    scamType: 'Job Offer',
    tags: ['linkedin', 'recruitment', 'advance-fee'],
    upvotes: 95,
    downvotes: 2,
    shares: 15,
    submittedBy: 'User_AlexR',
    createdAt: '2024-07-19T14:30:00Z',
  },
  {
    id: 3,
    title: 'Electricity Bill Disconnection Threat',
    description: "Got an urgent message saying my electricity would be disconnected in 30 minutes due to a pending bill. The message urged me to call a specific mobile number to pay immediately, bypassing the official app. The utility company confirmed it was a scam.",
    scamType: 'Impersonation',
    tags: ['utility-bill', 'impersonation', 'urgency'],
    upvotes: 210,
    downvotes: 12,
    shares: 45,
    submittedBy: 'User_SamK',
    createdAt: '2024-07-21T09:15:00Z',
  },
  {
    id: 4,
    title: "Fake Apartment Listing Asks for Deposit",
    description: "Found a great apartment on Craigslist. The 'landlord' said they were out of the country on missionary work and couldn't show it, but I could secure it by wiring a security deposit. They created a sense of urgency, saying others were interested. Total scam, never send money for a place you haven't seen.",
    scamType: 'Phishing',
    tags: ['rental', 'advance-fee', 'impersonation'],
    upvotes: 180,
    downvotes: 8,
    shares: 33,
    submittedBy: 'User_MariaP',
    createdAt: '2024-07-22T11:00:00Z',
  },
  {
    id: 5,
    title: "'Are you available?' - Boss Impersonation for Gift Cards",
    description: "Got a text from a number I didn't recognize, just saying 'Are you available?'. When I replied, they claimed to be my CEO and said they were in a meeting but needed me to urgently buy $500 in Google Play gift cards for a client. They promised to reimburse me. I called my boss directly and he had no idea what I was talking about.",
    scamType: 'Impersonation',
    tags: ['sms', 'ceo-fraud', 'gift-card'],
    upvotes: 250,
    downvotes: 15,
    shares: 51,
    submittedBy: 'User_BenC',
    createdAt: '2024-07-23T15:20:00Z',
  },
  {
    id: 6,
    title: "Marketplace Overpayment with a Fake Check",
    description: "Selling a bike on Facebook Marketplace. The buyer offered to send a certified check, but 'accidentally' sent it for $1,000 more than the price. They asked me to deposit it and wire the extra money to their 'mover'. The check looked real, but my bank confirmed a few days later it was fake. I almost lost $1,000.",
    scamType: 'Phishing',
    tags: ['marketplace', 'fake-check', 'overpayment'],
    upvotes: 165,
    downvotes: 6,
    shares: 28,
    submittedBy: 'User_CarlosG',
    createdAt: '2024-07-24T08:45:00Z',
  },
  {
    id: 7,
    title: "Received Unordered Amazon Package - Brushing Scam",
    description: "A cheap pair of sunglasses I didn't order arrived from Amazon. There was no charge on my account. After some research, I found out it's a 'brushing scam' where sellers use my address to create fake verified purchases and write good reviews. It's unsettling that they have my name and address.",
    scamType: 'Phishing',
    tags: ['brushing', 'amazon', 'data-privacy'],
    upvotes: 88,
    downvotes: 3,
    shares: 12,
    submittedBy: 'User_TechieTom',
    createdAt: '2024-07-25T18:05:00Z',
  },
  {
    id: 8,
    title: "Public USB Charging Port Malware (Juice Jacking)",
    description: "This is more of a PSA. I saw a news report about 'juice jacking', where scammers modify public USB charging ports (like at airports) to install malware on your phone. It can steal passwords, contacts, etc. Better to use a wall outlet with your own adapter or a power bank.",
    scamType: 'Tech Support',
    tags: ['malware', 'security-tip', 'juice-jacking'],
    upvotes: 310,
    downvotes: 4,
    shares: 75,
    submittedBy: 'User_CyberSafe',
    createdAt: '2024-07-26T12:00:00Z',
  },
  {
    id: 9,
    title: "'Scam Recovery Service' Tried to Scam Me Again",
    description: "After losing money in a crypto scam, I was desperate. I found a company online that guaranteed they could recover my funds for a $500 'legal retainer'. I paid, and they just kept asking for more money for 'processing' and 'taxes'. They're just another scam preying on victims.",
    scamType: 'Investment',
    tags: ['recovery-scam', 'advance-fee', 'crypto'],
    upvotes: 142,
    downvotes: 5,
    shares: 21,
    submittedBy: 'User_HopefulNoMore',
    createdAt: '2024-07-27T10:30:00Z',
  },
  {
    id: 10,
    title: "Fake 'Free Puppy' Shipping Fee Scam",
    description: "Fell for an ad for a 'free' Golden Retriever puppy. The 'owner' was supposedly moving and couldn't keep it. All I had to do was pay $350 for a special climate-controlled shipping crate. After I paid, they asked for another $200 for 'insurance'. I realized then there was no puppy.",
    scamType: 'Phishing',
    tags: ['pet-scam', 'advance-fee', 'impersonation'],
    upvotes: 195,
    downvotes: 11,
    shares: 40,
    submittedBy: 'User_DogLover88',
    createdAt: '2024-07-28T14:00:00Z',
  }
];

export const MOCK_USERS: User[] = [
  { id: 1, email: 'admin@scamshield.ai', role: 'admin', password: 'adminpass' },
  { id: 2, email: 'user@example.com', role: 'user', password: 'password123' },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalUsers: 1523,
  totalScans: 8745,
  scamDetectionRate: 0.78, // 78%
  scansByType: [
    { name: 'Quick Scan', value: 5432 },
    { name: 'Deep Analysis', value: 1234 },
    { name: 'Email Guardian', value: 2079 },
  ],
  topReportedScams: [
    { name: 'Phishing', value: 120 },
    { name: 'Impersonation', value: 95 },
    { name: 'Job Offer', value: 62 },
    { name: 'Investment', value: 45 },
    { name: 'Tech Support', value: 31 },
  ]
};

export const RECOVERY_RESOURCES: RegionalResources = {
  US: [
    {
      categoryName: "Financial Fraud",
      icon: 'CreditCard',
      resources: [
        {
          organization: 'Federal Trade Commission (FTC)',
          description: 'The primary US agency for consumer protection. Report fraud, identity theft, and bad business practices.',
          contacts: [
            { type: 'website', value: 'https://www.reportfraud.ftc.gov/', label: 'Report Online' },
            { type: 'phone', value: '1-877-382-4357', label: 'Call Helpline' },
          ]
        },
        {
            organization: 'Your Bank or Credit Card Issuer',
            description: 'Call the number on the back of your card immediately to report unauthorized charges and freeze your account.',
            contacts: [
              { type: 'phone', value: '', label: 'Check Your Card for Number' },
            ]
          },
      ]
    },
    {
      categoryName: "Identity Theft",
      icon: 'UserCircle',
      resources: [
        {
          organization: 'IdentityTheft.gov',
          description: 'The US government\'s official one-stop resource to help you report and recover from identity theft.',
          contacts: [
            { type: 'website', value: 'https://www.identitytheft.gov/', label: 'Start Recovery Plan' },
          ]
        },
      ]
    },
    {
      categoryName: "Cybercrime Reporting",
      icon: 'BuildingLibrary',
      resources: [
        {
          organization: 'FBI Internet Crime Complaint Center (IC3)',
          description: 'File a report with the FBI for any type of online scam or cybercrime.',
          contacts: [
            { type: 'website', value: 'https://www.ic3.gov/', label: 'File a Complaint' },
          ]
        },
      ]
    },
    {
      categoryName: "Support & Guidance",
      icon: 'Lifebuoy',
      resources: [
        {
          organization: '988 Suicide & Crisis Lifeline',
          description: 'If you are in distress, this service provides free and confidential support 24/7.',
          contacts: [
            { type: 'phone', value: '988', label: 'Call or Text 988' },
            { type: 'website', value: 'https://988lifeline.org/', label: 'Visit Website' },
          ]
        },
      ]
    }
  ],
  UK: [
    {
        categoryName: "Financial Fraud",
        icon: 'CreditCard',
        resources: [
          {
            organization: 'Action Fraud',
            description: 'The UK\'s national reporting centre for fraud and cybercrime.',
            contacts: [
              { type: 'website', value: 'https://www.actionfraud.police.uk/reporting-fraud-and-cyber-crime', label: 'Report Online' },
              { type: 'phone', value: '0300 123 2040', label: 'Call to Report' },
            ]
          },
          {
            organization: 'Your Bank or Building Society',
            description: 'Call the fraud department number on your bank\'s website or the back of your card to report issues.',
            contacts: [
              { type: 'phone', value: '', label: 'Check Your Card for Number' },
            ]
          },
        ]
      },
      {
        categoryName: "Cybercrime Reporting",
        icon: 'BuildingLibrary',
        resources: [
          {
            organization: 'National Cyber Security Centre (NCSC)',
            description: 'Report suspicious emails, texts, and websites to the NCSC.',
            contacts: [
              { type: 'website', value: 'https://www.ncsc.gov.uk/collection/phishing-scams/report-scam-phishing', label: 'Report a Scam' },
            ]
          },
        ]
      },
      {
        categoryName: "Support & Guidance",
        icon: 'Lifebuoy',
        resources: [
          {
            organization: 'Citizens Advice',
            description: 'Offers free, confidential and impartial advice on a wide range of issues, including scams.',
            contacts: [
              { type: 'website', value: 'https://www.citizensadvice.org.uk/consumer/scams/get-help-with-scams/', label: 'Get Help' },
            ]
          },
          {
            organization: 'Samaritans',
            description: 'If you are in distress, this service provides free and confidential support 24/7.',
            contacts: [
              { type: 'phone', value: '116 123', label: 'Call for Free' },
              { type: 'website', value: 'https://www.samaritans.org/', label: 'Visit Website' },
            ]
          },
        ]
      }
  ],
  IN: [
    {
      categoryName: "Cybercrime Reporting",
      icon: 'BuildingLibrary',
      resources: [
        {
          organization: 'National Cyber Crime Reporting Portal',
          description: 'The official Government of India portal to report all types of cybercrime, including online scams.',
          contacts: [
            { type: 'website', value: 'https://www.cybercrime.gov.in/', label: 'Report Online' },
            { type: 'phone', value: '1930', label: 'Call Helpline' },
          ]
        },
      ]
    },
    {
      categoryName: "Financial Fraud",
      icon: 'CreditCard',
      resources: [
        {
          organization: 'Reserve Bank of India (RBI)',
          description: 'File complaints related to banking, digital payments, and other financial services through the RBI.',
          contacts: [
            { type: 'website', value: 'https://sachet.rbi.org.in/', label: 'File a Complaint' },
          ]
        },
        {
          organization: 'Your Bank',
          description: 'Immediately contact your bank\'s customer service or fraud department to report unauthorized transactions.',
          contacts: [
            { type: 'phone', value: '', label: 'Check Your Card/Website' },
          ]
        },
      ]
    },
    {
      categoryName: "Support & Guidance",
      icon: 'Lifebuoy',
      resources: [
        {
          organization: 'KIRAN Mental Health Helpline',
          description: 'A 24/7 national helpline offering support for depression, anxiety, and stress. Operated by the Ministry of Social Justice and Empowerment.',
          contacts: [
            { type: 'phone', value: '1800-599-0019', label: 'Call Helpline' },
          ]
        },
      ]
    }
  ],
  International: [
    {
        categoryName: "Cross-Border Complaints",
        icon: 'Flag',
        resources: [
          {
            organization: 'econsumer.gov',
            description: 'A portal for consumers to report complaints about online and related transactions with foreign companies.',
            contacts: [
              { type: 'website', value: 'https://www.econsumer.gov/', label: 'File a Complaint' },
            ]
          },
        ]
      },
      {
        categoryName: "Law Enforcement",
        icon: 'BuildingLibrary',
        resources: [
          {
            organization: 'INTERPOL',
            description: 'Report international scams to your national police, who can then liaise with INTERPOL.',
            contacts: [
              { type: 'website', value: 'https://www.interpol.int/How-we-work/Police-services/Financial-crime-and-anti-corruption', label: 'Learn More' },
            ]
          },
        ]
      },
  ]
};

export const PLATFORM_REPORTING_GUIDES: ReportingGuide[] = [
  {
    platform: 'Facebook',
    domainKeywords: ['facebook.com', 'fb.com', 'fb.watch'],
    reportingUrl: 'https://www.facebook.com/help/428478523862899',
    instructions: [
      'Find the post, photo, or video you want to report.',
      'Click the "..." icon.',
      'Select "Find support or report".',
      'Choose the option that best describes the issue, such as "Nudity" or "Harassment".',
    ],
  },
  {
    platform: 'Instagram',
    domainKeywords: ['instagram.com', 'instagr.am'],
    reportingUrl: 'https://help.instagram.com/527344547392157',
    instructions: [
      'Tap the "..." above the post.',
      'Tap "Report".',
      'Select "It\'s inappropriate".',
      'Choose a more specific reason like "Nudity or sexual activity".',
    ],
  },
  {
    platform: 'X / Twitter',
    domainKeywords: ['twitter.com', 'x.com'],
    reportingUrl: 'https://help.twitter.com/en/forms/safety-and-sensitive-content/report-a-violation',
    instructions: [
      'Click the "..." icon on the Tweet.',
      'Select "Report Tweet".',
      'Choose the category that fits, such as "It displays sensitive media".',
      'Follow the on-screen prompts to complete the report.',
    ],
  },
  {
    platform: 'TikTok',
    domainKeywords: ['tiktok.com'],
    reportingUrl: 'https://support.tiktok.com/en/safety-hc/report-a-problem/report-a-video',
    instructions: [
      'Tap and hold on the video you wish to report.',
      'Tap "Report".',
      'Select a reason for the report, such as "Nudity and sexual activities".',
      'Follow the additional prompts to submit.',
    ],
  },
  {
    platform: 'YouTube',
    domainKeywords: ['youtube.com', 'youtu.be'],
    reportingUrl: 'https://support.google.com/youtube/answer/2802027',
    instructions: [
      'Below the video player, click the "..." icon.',
      'Click "Report".',
      'Select the reason that best fits the violation, such as "Nudity or sexual content".',
      'Provide any additional details and submit.',
    ],
  },
  {
    platform: 'Reddit',
    domainKeywords: ['reddit.com', 'redd.it'],
    reportingUrl: 'https://www.reddithelp.com/hc/en-us/articles/360043513411-What-do-I-do-if-someone-is-sharing-intimate-or-sexually-suggestive-images-or-videos-of-me-without-my-consent',
    instructions: [
      'Go to the post or comment you want to report.',
      'Click the "..." icon, then select "Report".',
      'Choose "Non-consensual intimate media".',
      'Follow the on-screen prompts to complete your report.'
    ]
  },
  {
    platform: 'Discord',
    domainKeywords: ['discord.com', 'discord.gg'],
    reportingUrl: 'https://support.discord.com/hc/en-us/requests/new?ticket_form_id=360000029731',
    instructions: [
      'Use the official link to go to Discord\'s Trust & Safety request form.',
      'Select "Appeals, Age Update, Other Questions" then "How do I report abuse or harassment?".',
      'Provide the Message Link (right-click the message and select "Copy Message Link").',
      'Fill out the form with as much detail as possible.'
    ]
  },
  {
    platform: 'Telegram',
    domainKeywords: ['telegram.org', 't.me'],
    reportingUrl: 'https://telegram.org/support',
    instructions: [
      'On mobile, tap and hold the message, then tap "Report".',
      'On desktop, right-click the message and select "Report".',
      'Choose the reason for reporting, such as "Pornography" or "Violence".',
      'For direct support, use their support form (link above) and provide details.'
    ]
  },
  {
    platform: 'Twitch',
    domainKeywords: ['twitch.tv'],
    reportingUrl: 'https://help.twitch.tv/s/article/how-to-file-a-user-report',
    instructions: [
      'Click the three vertical dots icon on the user\'s channel page.',
      'Select "Report [Username]".',
      'Choose the most relevant category, like "Hateful Conduct or Harassment".',
      'Provide a detailed description and submit the report.'
    ]
  }
];

export const MENTAL_HEALTH_SUPPORT = {
  name: 'Crisis Text Line',
  description: 'Connect with a real human for free, 24/7 confidential crisis counseling.',
  contact: 'Text HOME to 741741 (US & Canada) or 85258 (UK).',
  website: 'https://www.crisistextline.org/',
};

export const TAKEDOWN_RESOURCES: TakedownResource[] = [
    {
        organization: 'StopNCII.org',
        description: 'A free, global tool that uses hashing technology to stop non-consensual intimate images from being shared on partner platforms like Facebook, Instagram, and TikTok.',
        link: 'https://stopncii.org/',
        linkText: 'Create a Case',
    },
    {
        organization: 'Cyber Civil Rights Initiative',
        description: 'Offers a 24/7 crisis helpline, resources, and legal information for victims of online abuse and non-consensual image sharing.',
        link: 'https://cybercivilrights.org/get-help-now/',
        linkText: 'Get Help Now',
    },
    {
        organization: 'Take It Down (NCMEC)',
        description: 'A service from the National Center for Missing & Exploited Children that helps you remove sexually explicit images or videos of yourself taken when you were under 18.',
        link: 'https://takeitdown.ncmec.org/',
        linkText: 'Start a Case',
    }
];