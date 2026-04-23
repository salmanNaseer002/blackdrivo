"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Bookmark } from "lucide-react";

// --- 0. TYPE DEFINITIONS ---

// Define the structure for a single blog post
interface Post {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  image: string;
  longContent: string[];
}

// Define the structure for the simplified trending posts list
interface TrendingPost {
  id: number;
  title: string;
  category: string;
}

// Define the props for components
interface PostComponentProps {
  post: Post;
  setViewingPostId: React.Dispatch<React.SetStateAction<number | null>>;
}

interface PaginationProps {
  postsPerPage: number;
  totalPosts: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

interface SidebarProps {
  setViewingPostId: React.Dispatch<React.SetStateAction<number | null>>;
}

// --- 1. SAMPLE DATA GENERATION (40 ARTICLES) ---

// Helper function for unique, descriptive image seeds - Correctly typed
const getImageUrl = (seed: string) =>
  `https://picsum.photos/seed/${seed}/800/400`;

// --- POSTS Data (The 40 Articles) ---
const allPosts: Post[] = [
  // --- CORE & FEATURED POSTS (IDs 1-4) ---
  {
    id: 1,
    title:
      "Mastering Prior Authorization: Strategies to Reduce Turnaround Time by 50%",
    excerpt:
      "Prior authorization is the biggest administrative hurdle. Learn our 3-step strategy to automate the process, drastically cutting approval times and reducing staff burnout.",
    category: "RCM Optimization",
    date: "Nov 1, 2025",
    author: "Demeta Team",
    image: getImageUrl("prior-authorization-strategy"),
    longContent: [
      "The burdensome nature of prior authorization is estimated to cost the US healthcare system billions annually. Our research shows that over 60% of PA requests are still handled manually, leading to an average turnaround time of 5-7 business days for complex cases.",
      "Our first strategy involves implementing AI-driven rule engines that cross-reference CPT codes against payer policy libraries in real-time. This ensures that only medically necessary and correctly coded requests are submitted, reducing denial rates from the source.",
      "Secondly, leverage dedicated PA portals and electronic health record integration (EHRi). While many practices use EHRs, few fully utilize the integrated PA submission features. This minimizes manual data entry, which is the leading cause of initial rejection.",
      "The final step is establishing an internal 'PA Audit Loop.' Analyze your top 10 denied procedures every quarter. Meet with the clinical team to adjust documentation templates specifically to meet payer requirements for those high-volume, high-denial services. This is a continuous improvement cycle, not a one-time fix.",
    ],
  },
  {
    id: 2,
    title:
      "HIPAA Security Rule Deep Dive: Mandatory Breach Reporting Timelines for 2026",
    excerpt:
      "The Office for Civil Rights (OCR) is tightening enforcement. We detail the mandatory breach reporting deadlines and the required forensic documentation to keep your organization compliant.",
    category: "Compliance & Security",
    date: "Oct 28, 2025",
    author: "Compliance Expert",
    image: getImageUrl("hipaa-breach-timeline"),
    longContent: [
      "The cornerstone of HIPAA compliance remains the Security Rule, which mandates the protection of electronic Protected Health Information (ePHI). A critical update for 2026 focuses on the 'discovery date' of a breach, pushing for faster internal documentation.",
      "For breaches affecting less than 500 individuals, reports must be submitted annually to the OCR within 60 days after the close of the calendar year. However, for breaches affecting 500 or more individuals, notification must be sent to the OCR, the affected media, and the individuals within 60 days of discovery.",
      "Forensic documentation is now key. You must detail the nature of the unsecured PHI, the persons unauthorized to use it, whether the PHI was actually acquired or viewed, and the extent to which the risk to PHI has been mitigated. Lack of this detailed evidence can trigger immediate penalties.",
      "A proactive security posture, including end-to-end encryption and multi-factor authentication for all remote access, is the only way to genuinely protect your data and minimize your risk exposure.",
    ],
  },
  {
    id: 3,
    title:
      "Understanding Modifier 25: Separately Identifiable E/M Services on the Same Day",
    excerpt:
      "Incorrect application of Modifier 25 is a top cause of claim denial. We break down the clinical documentation requirements for billing an E/M service with a procedure on the same day.",
    category: "Medical Coding",
    date: "Oct 20, 2025",
    author: "Certified Coder",
    image: getImageUrl("modifier-25-coding"),
    longContent: [
      "Modifier 25 indicates that a physician performed a significant, separately identifiable Evaluation and Management (E/M) service on the same day as a minor procedure. The E/M service must be distinct from the decision to perform the procedure itself.",
      "The key to correct usage lies in the documentation. The medical record must clearly show two separate reasons for the visit: one justifying the E/M service (e.g., a new complaint or complication) and a second, distinct reason justifying the procedure.",
      "For example, if a patient comes in for a routine annual physical (preventive visit) and, during that visit, presents a new, unrelated rash that requires separate workup and prescribing, the visit for the rash could be billed with the E/M code and Modifier 25.",
      "If the E/M service is only to determine the need for the procedure (e.g., examining a wart before removing it), Modifier 25 is not appropriate, and its use will likely result in a denial or an audit flag for potential unbundling.",
    ],
  },
  {
    id: 4,
    title: "The Shift to Value-Based Care: Financial Models for 2026",
    excerpt:
      "Fee-for-service is dying. We explore the financial models—APMs, ACOs, and Bundled Payments—that practices must adopt to ensure sustainable revenue in the new healthcare economy.",
    category: "Industry News",
    date: "Oct 15, 2025",
    author: "Industry Analyst",
    image: getImageUrl("value-based-care-models"),
    longContent: [
      "Value-Based Care (VBC) links provider reimbursement to clinical outcomes, patient satisfaction, and efficiency, replacing the volume-driven fee-for-service model. The transition is accelerating due to CMS initiatives and pressure from major private payers.",
      "Accountable Care Organizations (ACOs) are groups of providers who coordinate care for a defined population of patients. If they keep costs down and meet quality metrics, they share in the savings. This requires sophisticated data analytics and integrated care management.",
      "Alternative Payment Models (APMs) include episode-of-care payments (bundled payments) where a single payment covers all services related to a specific condition or procedure. This shifts risk from the payer to the provider, demanding strict cost control and care coordination.",
      "To succeed in VBC, practices must invest in patient engagement tools, remote monitoring, and advanced analytics to track quality metrics and identify high-risk, high-cost patients before serious complications arise.",
    ],
  },
  // --- ADDITIONAL 36 BLOG POSTS (IDs 5-40) ---
  {
    id: 5,
    title:
      "7 Critical KPIs for RCM Audits: Benchmarking Your Practice's Financial Health",
    excerpt:
      "Identify your weak points. We detail the seven key performance indicators auditors focus on, including Clean Claim Rate, Denial Rate, and Days in Accounts Receivable.",
    category: "RCM Optimization",
    date: "Oct 1, 2025",
    author: "Data Scientist",
    image: getImageUrl("rcm-kpis-dashboard"),
    longContent: [
      "Days in Accounts Receivable (A/R) measures the average time it takes to get paid. For an efficient practice, this number should be below 30 days. High A/R indicates bottlenecks in claim submission or denial follow-up.",
      "The Clean Claim Rate (CCR) is the percentage of claims paid upon first submission. A CCR below 95% signals systemic front-end errors in eligibility verification or charge capture that need immediate attention.",
      "Denial Rate is the total volume of denied claims as a percentage of gross charges. Best-in-class practices maintain a denial rate below 5%. Any rate higher than 10% necessitates a full RCM workflow audit.",
      "Other critical KPIs include collection velocity, adjustment reason codes, and payment posting lag. Monitoring these metrics allows you to proactively fix revenue leaks instead of reacting to cash flow crises.",
    ],
  },
  {
    id: 6,
    title: "EHR Optimization: Converting Clinical Data into Clean Claims",
    excerpt:
      "Your EHR is more than a note-taking tool. Learn how to optimize templates, leverage smart documentation, and ensure clinical data seamlessly translates into accurate billing codes.",
    category: "EHR/EMR Insights",
    date: "Sep 25, 2025",
    author: "EHR Consultant",
    image: getImageUrl("ehr-optimization-flow"),
    longContent: [
      "The disconnect between clinical documentation and the billing department is a major source of under-coding and denials. Providers often document excellent clinical care but fail to meet the specific requirements of the CPT or ICD-10 codes.",
      "Optimizing your EHR starts with custom templates that embed compliance checks. For instance, requiring fields for 'medical necessity justification' or 'time spent face-to-face' for high-level E/M services ensures coders have the required proof.",
      "Use EHR functionalities for smart documentation, such as automated charge capture based on dictated or selected procedures. This prevents services from being missed—a significant source of revenue leakage.",
      "Regular audits where coders meet with clinicians to review charts can bridge the knowledge gap, turning your EHR into a true revenue engine instead of just a digital file cabinet.",
    ],
  },
  {
    id: 7,
    title:
      "No Surprises Act Compliance: A Practical Guide to Good Faith Estimates",
    excerpt:
      "The No Surprises Act requires new protocols for billing. We detail who needs a Good Faith Estimate (GFE), when it must be provided, and the penalties for non-compliance.",
    category: "Compliance & Security",
    date: "Sep 18, 2025",
    author: "Regulatory Advisor",
    image: getImageUrl("no-surprises-act-guide"),
    longContent: [
      "The No Surprises Act (NSA) aims to protect patients from unexpected balance billing. The core requirement for providers is the Good Faith Estimate (GFE), which details the expected charges for services.",
      "A GFE must be provided to uninsured or self-pay patients when scheduling a service or when the patient requests one. It must include itemized estimates for all anticipated items and services, including facility fees and supplies.",
      "For a scheduled service, the GFE must be provided within 3 business days of scheduling (if scheduled 10 business days out) or within 1 business day (if scheduled 3 business days out). Failure to provide a GFE can result in penalties.",
      "The GFE process requires coordination between front-desk staff, coders, and the billing department. Leveraging automated estimating tools integrated with your RCM system is essential for maintaining compliance and accuracy.",
    ],
  },
  {
    id: 8,
    title:
      "Telehealth Billing 2026: New Place of Service (POS) Codes and Modifiers",
    excerpt:
      "Telehealth remains critical, but billing rules are constantly changing. We outline the latest Place of Service codes and the appropriate modifiers to ensure clean reimbursement from Medicare and private payers.",
    category: "Medical Billing",
    date: "Sep 10, 2025",
    author: "Billing Specialist",
    image: getImageUrl("telehealth-coding-update"),
    longContent: [
      "Billing for telehealth is complex because you must indicate where the patient was located (the originating site) and where the provider was located (the distant site), and what services were provided.",
      "For most services rendered via telehealth, CMS requires Place of Service (POS) code 10 (Telehealth Provided in Patient's Home) or 02 (Telehealth Provided Other than Patient's Home). This signals the payer to reimburse at the facility rate.",
      "The most common modifier used is '95,' indicating that the service was provided synchronously via a telecommunications system. Some payers may require additional modifiers, such as 'GT,' so always check payer-specific policy.",
      "Crucially, always ensure your clinical documentation explicitly states the service was provided via telehealth, the method used (audio/video), and a medical necessity justification for the remote encounter.",
    ],
  },
  {
    id: 9,
    title:
      "Denial Management Triage: A Structured Approach to Reclaiming Revenue",
    excerpt:
      "Stop treating all denials the same way. Implement a triage system based on denial reason, dollar amount, and appeal success rate to prioritize follow-up and maximize revenue recovery.",
    category: "RCM Optimization",
    date: "Aug 29, 2025",
    author: "RCM Strategist",
    image: getImageUrl("denial-management-triage"),
    longContent: [
      "Denial Management is the most labor-intensive part of the revenue cycle. An effective triage system prioritizes which denials to work first, maximizing staff productivity and return on investment.",
      "First, categorize denials by type: 'Hard Denials' (e.g., non-covered services) that are rarely overturned, and 'Soft Denials' (e.g., incorrect codes, missing info) that are easily fixed and resubmitted.",
      "Prioritize soft denials first, as they have the highest probability of quick turnaround. Next, prioritize hard denials based on dollar amount and historical appeal success rate. This stops staff from spending hours on low-value claims.",
      "Use RCM software to identify root causes. If 30% of your denials are for 'no prior authorization,' the fix is a process change at the front desk, not spending time on individual appeals.",
    ],
  },
  {
    id: 10,
    title:
      "Credentialing and Enrollment: A Proactive Approach to Avoiding Billing Gaps",
    excerpt:
      "Credentialing delays can halt your cash flow for months. We outline a proactive 90-day plan for new providers, ensuring seamless enrollment and immediate billing capabilities.",
    category: "Medical Billing",
    date: "Aug 15, 2025",
    author: "Credentialing Expert",
    image: getImageUrl("credentialing-enrollment-plan"),
    longContent: [
      "Provider credentialing is the process of verifying a practitioner's qualifications, while enrollment is the process of getting that provider added to a payer's network so they can be reimbursed for services.",
      "The biggest pitfall is the lack of a standardized workflow. Start the CAQH and payer enrollment applications 90 days before the provider's start date. Do not wait for the provider to arrive.",
      "Track every application with a detailed status log, including submission date, estimated approval date, and contact person at the payer. Follow up weekly, as passive waiting is the primary cause of delay.",
      "Ensure all billing staff are aware of the 'start date' of the provider's enrollment with each payer. Billing claims under a non-credentialed provider will result in immediate, non-recoverable denials.",
    ],
  },
  {
    id: 11,
    title:
      "Audit-Proof Documentation: What RAC Auditors Look for in E/M Charts",
    excerpt:
      "Recovery Audit Contractors (RACs) target high-level E/M codes. Learn the specific documentation elements—MDM, Time, and History—that must be present to withstand an audit.",
    category: "Compliance & Security",
    date: "Aug 8, 2025",
    author: "RAC Specialist",
    image: getImageUrl("rac-audit-documentation"),
    longContent: [
      "RAC auditors primarily focus on services deemed 'medically unnecessary' or improperly coded, with high-level Evaluation and Management (E/M) codes (99214, 99215) being major targets.",
      "For Medical Decision Making (MDM)-based coding, you must clearly document the number and complexity of problems addressed, the amount and complexity of data reviewed (e.g., labs, images, external records), and the risk of complications.",
      "For Time-based coding, the chart must explicitly state the total time spent by the provider on the date of the encounter and explicitly state that more than 50% of the time was spent on counseling or care coordination.",
      "Avoid cloning or copy-pasting documentation. Auditors look for unique, encounter-specific details that justify the complexity of the visit. Vague or repetitive notes are grounds for repayment demands.",
    ],
  },
  {
    id: 12,
    title:
      "Patient Financial Experience: Strategies to Boost Patient Collections by 30%",
    excerpt:
      "Patient financial responsibility is skyrocketing. Implement price transparency tools and consumer-friendly payment options to collect balances faster and reduce bad debt write-offs.",
    category: "RCM Optimization",
    date: "Jul 29, 2025",
    author: "Financial Services Lead",
    image: getImageUrl("patient-collections-strategy"),
    longContent: [
      "High-deductible health plans have shifted the payment burden to patients, who now account for a significant portion of a practice's revenue. Treating patients like consumers in the financial process is no longer optional.",
      "Provide upfront cost estimates (based on eligibility and benefits verification) before the service is rendered. Patients are far more likely to pay when they understand their obligation beforehand.",
      "Offer multiple, convenient payment options: online portals, text-to-pay, secure email links, and automated payment plans. Make paying a bill as easy as ordering takeout.",
      "Train staff on financial counseling. Instead of merely demanding payment, staff should be empathetic, clearly explain the bill, and discuss payment plans. This improves satisfaction and collection rates.",
    ],
  },
  {
    id: 13,
    title: "HCPCS Level II Coding: The Essential Guide to DME and Supplies",
    excerpt:
      "HCPCS Level II is crucial for Durable Medical Equipment, prosthetics, and supplies. We explain the structure, modifiers, and common pitfalls to ensure proper reimbursement.",
    category: "Medical Coding",
    date: "Jul 20, 2025",
    author: "DME Coder",
    image: getImageUrl("hcpcs-dme-coding"),
    longContent: [
      "HCPCS Level II codes are alphanumeric codes used to report services, supplies, drugs, and equipment not covered by CPT Level I codes. They are essential for accurate billing of non-physician services.",
      "The structure involves a letter followed by four digits. The letter indicates the type of service or equipment (e.g., E codes for durable medical equipment).",
      "Correct use of modifiers, such as those indicating rental vs. purchase or functional status, is critical. A missing or incorrect HCPCS modifier will result in an immediate denial for the entire supply claim.",
      "Stay current with quarterly updates. HCPCS codes change frequently, and submitting an obsolete code is a common, avoidable denial reason.",
    ],
  },
  {
    id: 14,
    title:
      "ICD-10-CM Specificity: Preventing Denials with Laterality and Combination Codes",
    excerpt:
      "Vague diagnosis codes are major audit triggers. Learn to leverage combination codes and document laterality correctly for maximum specificity and clean claim submission.",
    category: "Medical Coding",
    date: "Jul 15, 2025",
    author: "Coding Educator",
    image: getImageUrl("icd-10-specificity-chart"),
    longContent: [
      "ICD-10-CM requires a high degree of specificity to accurately describe a patient's condition. Coders must use the most precise code available, often requiring 6 or 7 characters.",
      "Laterality refers to coding for the left, right, or bilateral side of the body. Failing to specify laterality when required (e.g., knee injury) will result in a claim rejection because the code is incomplete.",
      "Combination codes allow a coder to report two diagnoses or a diagnosis with an associated secondary condition or complication using a single code. Using a combination code where available is generally more efficient and accurate.",
      "Always rely on the provider's detailed clinical documentation. If the documentation does not specify the acuity or laterality, the coder must query the provider to select the correct, most specific code.",
    ],
  },
  {
    id: 15,
    title: "AI in RCM: Automating Payment Posting and Reconciliation",
    excerpt:
      "AI is moving beyond chatbots. We explore how intelligent automation can process Electronic Remittance Advices (ERAs) and patient payments, reducing manual labor and posting errors.",
    category: "RCM Optimization",
    date: "Jul 1, 2025",
    author: "Tech Innovator",
    image: getImageUrl("ai-payment-posting"),
    longContent: [
      "Payment posting is a high-volume, repetitive task prone to human error, especially when dealing with complex denials and adjustments. AI and Robotic Process Automation (RPA) are transforming this back-end process.",
      "AI-powered solutions can analyze unstructured data from paper remits or poorly formatted ERAs, automatically matching payments to patient accounts, charge lines, and correctly applying adjustments/write-offs.",
      "Automation leads to same-day payment posting, drastically improving the accuracy of Accounts Receivable (A/R) reports and providing the finance department with immediate cash flow visibility.",
      "This frees up human staff to focus on high-value tasks, like denial appeals and collections, rather than tedious data entry.",
    ],
  },
  {
    id: 16,
    title:
      "Mitigating Cybersecurity Risks in Billing: A HIPAA-Compliant Checklist",
    excerpt:
      "The threat landscape for ePHI is growing. Use our checklist to secure your RCM systems, cloud storage, and vendor interfaces against ransomware and data breaches.",
    category: "Compliance & Security",
    date: "Jun 20, 2025",
    author: "Cybersecurity Analyst",
    image: getImageUrl("billing-cybersecurity-checklist"),
    longContent: [
      "Medical billing systems are prime targets for cyberattacks because they contain both patient PHI and financial information. A single ransomware attack can paralyze operations and trigger massive HIPAA fines.",
      "Mandatory checklist items include implementing end-to-end encryption for all data both in transit and at rest, and enforcing strict access controls based on the principle of 'least privilege.'",
      "Require multi-factor authentication (MFA) for all employee and vendor access to RCM and EHR systems. MFA is the single most effective defense against unauthorized access.",
      "Vetting your vendors is crucial. Your Business Associate Agreements (BAAs) must explicitly define the vendor's responsibility for securing ePHI and their breach notification protocols.",
    ],
  },
  {
    id: 17,
    title:
      "Strategies for Effective Collections: Medicaid and Low-Income Patients",
    excerpt:
      "Collecting from vulnerable populations requires empathy and specialized policies. We discuss payment plan best practices, financial hardship applications, and ethical collections strategies.",
    category: "Medical Billing",
    date: "Jun 15, 2025",
    author: "Financial Counselor",
    image: getImageUrl("low-income-collections"),
    longContent: [
      "For Medicaid and low-income patients, aggressive collection tactics are both unethical and unproductive. A compassionate approach focusing on assistance is far more effective.",
      "Establish clear, written policies for financial hardship. Offer a streamlined application process for income verification, which can lead to charity care or steep discounts on self-pay balances.",
      "Implement zero-interest payment plans with minimal monthly installments. Make these plans automatic and easy to set up via the patient portal to minimize friction.",
      "Train staff to be patient financial advocates, connecting individuals with state programs or community resources. This builds trust and often leads to higher collection yields over time.",
    ],
  },
  {
    id: 18,
    title:
      "Revenue Integrity: Closing the Gap Between Services Rendered and Billed",
    excerpt:
      "Revenue integrity ensures all chargeable services are actually billed. Use charge capture reconciliation and system audits to eliminate leakage from missed procedures or supply usage.",
    category: "RCM Optimization",
    date: "Jun 1, 2025",
    author: "Revenue Auditor",
    image: getImageUrl("revenue-integrity-audit"),
    longContent: [
      "Revenue integrity is the process of ensuring that every service provided, supply used, and diagnosis recorded is accurately documented, coded, and billed. The goal is to maximize earned revenue while maintaining compliance.",
      "Charge capture reconciliation is a daily process of comparing clinical documentation (e.g., operative reports, nurse's notes) with the charges that were actually posted to the patient's account.",
      "Missed charges often occur in high-volume, ancillary departments like labs and radiology, or for low-cost supplies used during minor procedures. Automated systems can flag documentation without an associated charge code.",
      "Regularly audit the Charge Description Master (CDM) to ensure codes and pricing are accurate and current, preventing claims from being under-billed due to outdated system settings.",
    ],
  },
  {
    id: 19,
    title:
      "The Evolving Role of the Medical Coder: From Data Entry to Clinical Analyst",
    excerpt:
      "Modern coding requires more than just code assignment. We discuss how coders are becoming essential clinical analysts, improving documentation quality and participating in compliance initiatives.",
    category: "Industry News",
    date: "May 25, 2025",
    author: "Coding Analyst",
    image: getImageUrl("modern-medical-coder"),
    longContent: [
      "The complexity of ICD-10 and CPT coding, combined with the shift to value-based care, has dramatically changed the coder's role. They are now essential communication links between clinicians and the financial team.",
      "Modern coders must understand clinical concepts well enough to query providers effectively. A coder's query often ensures the correct E/M level is billed, preventing thousands in lost revenue or potential audits.",
      "Coders are moving from reactive coding to proactive auditing, identifying patterns of under-documentation or non-compliance before claims leave the office.",
      "Technology adoption, including Natural Language Processing (NLP) tools, is freeing up coders from routine tasks, allowing them to focus on complex, high-risk cases that require expert human judgment.",
    ],
  },
  {
    id: 20,
    title:
      "Avoiding Unbundling: Correct Use of the National Correct Coding Initiative (NCCI)",
    excerpt:
      "NCCI edits prevent improper payment for services that are normally bundled. Learn how to apply NCCI edits and when a modifier (like 59 or XU) is appropriate to bypass them.",
    category: "Medical Coding",
    date: "May 18, 2025",
    author: "NCCI Specialist",
    image: getImageUrl("ncci-edit-table"),
    longContent: [
      "The National Correct Coding Initiative (NCCI) was created by CMS to promote national correct coding methodologies and prevent improper coding leading to inappropriate payment.",
      "NCCI edits consist of two types: Procedure-to-Procedure (PTP) edits, which prevent inappropriate payment when two procedures are reported together, and Medically Unlikely Edits (MUEs), which prevent units of service errors.",
      "Unbundling occurs when a component service is billed separately from a comprehensive service of which it is inherently a part. This is illegal and leads to massive fines.",
      "When two codes trigger an NCCI edit but are clinically appropriate to be billed separately (e.g., performed at different sites or times), a modifier like '59' or the X-modifiers must be used to bypass the edit. Misuse of these modifiers is a primary audit target.",
    ],
  },
  {
    id: 21,
    title:
      "Patient Access: Eligibility Verification Best Practices to Stop Denials",
    excerpt:
      "The front end is where most denials begin. Implement a robust 2-step eligibility verification process—before scheduling and again before the encounter—to minimize front-end rejections.",
    category: "RCM Optimization",
    date: "May 1, 2025",
    author: "Front Office Consultant",
    image: getImageUrl("eligibility-verification-process"),
    longContent: [
      "Up to 40% of all claim denials can be traced back to errors in the patient access or front-end stage of the RCM. A simple typo in the insurance ID or a lapse in coverage can halt payment weeks later.",
      "The best practice is a two-step verification: initial verification during scheduling (to identify if the service is covered and if a referral/PA is needed) and final verification on the day of the encounter (to catch last-minute coverage changes).",
      "Always verify eligibility and benefits, including co-pay, deductible status, and financial responsibility. Use automated tools for real-time checks to ensure accuracy.",
      "A proactive front desk staff that collects the estimated patient responsibility at the time of service significantly reduces bad debt and improves cash flow.",
    ],
  },
  {
    id: 22,
    title:
      "Managed Care Contracting: What Your Practice Needs to Negotiate Better Rates",
    excerpt:
      "Negotiating with Managed Care Organizations (MCOs) can be intimidating. We provide key data points, essential contract language, and strategies to secure better fee-for-service rates.",
    category: "Industry News",
    date: "Apr 20, 2025",
    author: "Contract Negotiator",
    image: getImageUrl("managed-care-negotiation"),
    longContent: [
      "Many practices accept contract terms without negotiation, leaving significant revenue on the table. Successful negotiation requires preparation, data, and confidence.",
      "Key data to leverage includes your practice's historical Clean Claim Rate (CCR), Days in A/R (showing your efficiency), and benchmark data on what competitors in your geographic area are being paid for high-volume procedures.",
      "Essential contract language to negotiate includes the timely payment clause (forcing the MCO to pay within a specific timeframe), clear denial appeal protocols, and an unambiguous definition of 'medical necessity.'",
      "Do not accept the MCO's initial offer. Be prepared to walk away from low-paying contracts if the payer volume does not compensate for the low rate.",
    ],
  },
  {
    id: 23,
    title: "MIPS 2026 Reporting: Maximizing Your Quality and Cost Scores",
    excerpt:
      "The Merit-based Incentive Payment System (MIPS) is shifting focus. Understand the new weight distribution for Quality and Cost categories to maximize your Medicare reimbursement adjustment.",
    category: "Compliance & Security",
    date: "Apr 15, 2025",
    author: "MIPS Consultant",
    image: getImageUrl("mips-scoring-weight"),
    longContent: [
      "The MIPS program consolidates several previous Medicare quality programs into one payment adjustment mechanism. Successful reporting is vital to avoiding future penalties.",
      "The two highest-weighted categories are typically Quality and Cost. To maximize your Quality score, select a small number of measures (e.g., 6) where your practice has high performance and excellent documentation.",
      "The Cost category is calculated by CMS based on your claims data. You cannot report for it, but you can influence it by ensuring efficient resource use and avoiding unnecessary services.",
      "The Promoting Interoperability (PI) category requires the use of certified EHR technology and meeting specific health information exchange measures. Consistent, accurate data is the foundation of MIPS success.",
    ],
  },
  {
    id: 24,
    title: "Charge Capture Automation: How to Stop Missing Billable Services",
    excerpt:
      "Missing billable charges is pure revenue loss. We detail how automated charge capture systems prevent leakage by integrating documentation with billing codes.",
    category: "RCM Optimization",
    date: "Apr 1, 2025",
    author: "Billing Technology Expert",
    image: getImageUrl("charge-capture-automation"),
    longContent: [
      "Manual charge capture processes—where staff review notes and manually enter codes—are highly prone to error and missed charges. This is a primary target for RCM optimization.",
      "Automated systems use rules-based logic to suggest CPT codes based on the provider's structured clinical documentation in the EHR. This ensures a charge is captured for every billable service.",
      "Specific areas of high leakage include supplies, injectables (HCPCS J-codes), and minor in-office procedures that are easily overlooked during manual data entry.",
      "Implementing real-time reconciliation tools that flag documentation without an associated charge for review can effectively close the revenue gap.",
    ],
  },
  {
    id: 25,
    title: "ICD-10-CM Coding for Chronic Condition Management (CCM)",
    excerpt:
      "Accurate coding is crucial for reimbursement of Chronic Condition Management services. We review the specific codes and documentation requirements for CCM billing.",
    category: "Medical Coding",
    date: "Mar 25, 2025",
    author: "CCM Specialist",
    image: getImageUrl("icd-10-chronic-codes"),
    longContent: [
      "CCM services are separately billable by CMS and many private payers, focusing on non-face-to-face services for patients with multiple chronic conditions.",
      "To qualify, the patient must have at least two chronic conditions expected to last at least 12 months, which place the patient at significant risk of death, acute exacerbation, or decline.",
      "Correct ICD-10 coding must reflect the two or more chronic conditions that justify the service. The documentation must clearly outline the care plan and the time spent managing the patient's conditions.",
      "Ensure the complexity of the conditions justifies the billing. Vague documentation will lead to denial upon audit, as auditors confirm medical necessity for the monthly management fee.",
    ],
  },
  {
    id: 26,
    title: "The Ultimate Guide to Medicare Appeals Process: 5 Levels of Review",
    excerpt:
      "Don't give up on Medicare denials. We walk through the five official levels of the Medicare appeals process, from redetermination to judicial review.",
    category: "Medical Billing",
    date: "Mar 18, 2025",
    author: "Medicare Specialist",
    image: getImageUrl("medicare-appeal-process"),
    longContent: [
      "The Medicare appeals process is structured and mandatory for providers to recover denied claims. Knowing the five levels is essential for effective A/R management.",
      "Level 1: Redetermination by a Medicare Administrative Contractor (MAC). This is the first step and is often successful if the error is simple, like a coding mistake.",
      "Level 2: Reconsideration by a Qualified Independent Contractor (QIC). The QIC reviews the MAC's decision. This requires a formal request with supporting documentation.",
      "Level 3: Hearing before an Administrative Law Judge (ALJ). This is a formal hearing, often conducted via video, and may require legal representation for large dollar amounts.",
      "Level 4 & 5: Review by the Medicare Appeals Council and Judicial Review in Federal District Court. These are the final, highest-level appeals for claims that involve major financial or policy issues.",
    ],
  },
  {
    id: 27,
    title: "Revenue Cycle Staffing: Outsourcing vs. In-House Teams",
    excerpt:
      "Deciding between an in-house billing team and outsourcing RCM is a strategic decision. We weigh the pros, cons, costs, and compliance implications of both models.",
    category: "Industry News",
    date: "Mar 1, 2025",
    author: "Practice Management Advisor",
    image: getImageUrl("rcm-outsourcing-comparison"),
    longContent: [
      "The decision to outsource RCM is driven by high denial rates, staff turnover, and the increasing complexity of coding and compliance. Outsourcing provides immediate access to specialists.",
      "In-house teams offer greater direct control over daily processes and better communication with clinicians, but they require significant investment in training, technology, and compliance infrastructure.",
      "Outsourcing often reduces administrative costs, increases the Clean Claim Rate, and shifts compliance risk to the vendor (via the BAA). However, it requires a loss of direct control and careful vendor management.",
      "A hybrid model, where complex tasks like denial management are outsourced while patient collections remain in-house, can provide the best balance of efficiency and patient relations.",
    ],
  },
  {
    id: 28,
    title: "Mastering ICD-10-CM Chapter 21: External Causes of Morbidity",
    excerpt:
      "V and Y codes are essential for injury reporting. We explain how to use external cause codes to provide complete documentation for accidents, poisonings, and adverse effects.",
    category: "Medical Coding",
    date: "Feb 25, 2025",
    author: "Code Analyst",
    image: getImageUrl("icd-10-v-y-codes"),
    longContent: [
      "External cause codes (ICD-10-CM Chapter 21, codes V00-Y99) are used to report the circumstances surrounding an injury or illness, not the injury itself. They are supplemental and used with an injury code.",
      "These codes provide crucial data for public health and insurance companies by detailing the cause of the injury (e.g., fall, motor vehicle accident), the intent (accidental, intentional), and the place of occurrence.",
      "For many payers, particularly workers' compensation, these codes are mandatory for clean claim submission. Missing external cause codes can lead to immediate denials for claims involving trauma.",
      "Ensure you document the patient's status (e.g., civilian, military), the activity at the time of the event, and the location, using the most specific external cause code available.",
    ],
  },
  {
    id: 29,
    title: "Optimizing Practice Workflow with RCM Analytics and Dashboards",
    excerpt:
      "You can't manage what you don't measure. Use RCM dashboards to visualize your data, identify bottlenecks, and drive performance improvements across patient access and billing.",
    category: "EHR/EMR Insights",
    date: "Feb 15, 2025",
    author: "Data Strategist",
    image: getImageUrl("rcm-analytics-dashboard"),
    longContent: [
      "RCM analytics involves using performance data to identify system inefficiencies, process breakdowns, and areas of revenue leakage. Dashboards provide real-time visibility into these metrics.",
      "A strong RCM dashboard should highlight key performance indicators (KPIs) like Clean Claim Rate, Net Collection Rate, and Denial Trend Analysis, allowing managers to see what is working and what is failing.",
      "By segmenting denial trends by payer, procedure, and provider, you can pinpoint the root cause of the problem—for instance, a specific payer rejecting all claims with a certain E/M code.",
      "Using this data to drive staff training and workflow changes is the fastest path to improving your net revenue and overall practice financial health.",
    ],
  },
  {
    id: 30,
    title: "Preventive Medicine vs. Problem-Oriented E/M: The Coding Confusion",
    excerpt:
      "Billing a sick visit alongside a wellness exam (modifier 25 scenario) is challenging. We clarify the documentation needed to separate preventive care from medically necessary E/M services.",
    category: "Medical Coding",
    date: "Feb 1, 2025",
    author: "E/M Specialist",
    image: getImageUrl("preventive-vs-sick-coding"),
    longContent: [
      "Preventive services (e.g., annual physicals, CPT codes 99381-99397) are billed differently than problem-oriented E/M services (e.g., sick visit). The confusion arises when both occur on the same day.",
      "When a patient presents for a preventive exam and a new or chronic problem is addressed, the provider can bill the preventive code and a separate E/M code (with Modifier 25) for the sick visit.",
      "Crucial: The documentation must clearly support that the time and effort spent on the sick visit was substantial, separately identifiable, and not just the minimal work required to decide if a problem exists.",
      "Auditors will deny the second E/M service if the problem addressed is not significant or if the documentation for it is inseparable from the documentation for the preventive exam.",
    ],
  },
  {
    id: 31,
    title: "Risk Adjustment and HCC Coding: Preparing for Capitation Models",
    excerpt:
      "Hierarchical Condition Categories (HCCs) are vital for capitation and risk-based contracts. Learn how accurate HCC coding drives higher reimbursement for high-risk patient populations.",
    category: "Industry News",
    date: "Jan 25, 2025",
    author: "Risk Adjustment Consultant",
    image: getImageUrl("hcc-coding-model"),
    longContent: [
      "Risk Adjustment models, primarily driven by Hierarchical Condition Categories (HCCs), are used by Medicare Advantage and VBC contracts to determine a patient's expected healthcare costs.",
      "The more severe and chronic the patient's diagnoses (as documented and coded), the higher the calculated risk score (Risk Adjustment Factor, or RAF), leading to higher monthly capitated payments to the provider.",
      "To accurately capture the HCC, the provider must document the condition at least once annually, ensuring the ICD-10 code is supported by the phrase 'monitored, evaluated, assessed, or treated' (MEAT).",
      "Failing to document and code all active chronic conditions (e.g., diabetes, COPD, heart failure) results in a low RAF score and significant underpayment for managing these complex patients.",
    ],
  },
  {
    id: 32,
    title:
      "Patient Financial Counseling: Improving Upfront Collections and Experience",
    excerpt:
      "Financial conversations can be awkward but necessary. Train your front-end staff to provide compassionate financial counseling, increasing collections at the time of service.",
    category: "Medical Billing",
    date: "Jan 15, 2025",
    author: "Patient Engagement Expert",
    image: getImageUrl("financial-counseling-script"),
    longContent: [
      "The front-end staff must be trained not just on check-in but on financial communication. This requires empathy, transparency, and product knowledge (knowing different payment options).",
      "Financial counseling involves verifying benefits, providing an accurate estimate of the patient's responsibility, and collecting co-pays and deductibles *before* the service is rendered.",
      "Staff should use a non-confrontational script, focusing on helping the patient understand their plan, not demanding payment. Phrases like 'Your co-pay today is $X, how would you like to pay?' work best.",
      "Providing easy-to-read, itemized estimates (Good Faith Estimates) ensures transparency, which is key to a positive patient financial experience and higher collection success.",
    ],
  },
  {
    id: 33,
    title: "The Impact of Payer Mix on Practice Profitability and Strategy",
    excerpt:
      "Your mix of Medicare, Medicaid, and Commercial payers dictates your cash flow and management strategy. Analyze your payer mix to optimize scheduling and staffing.",
    category: "RCM Optimization",
    date: "Jan 1, 2025",
    author: "Practice Financial Planner",
    image: getImageUrl("payer-mix-pie-chart"),
    longContent: [
      "Payer mix is the distribution of a practice's revenue across different insurance types (e.g., 40% Medicare, 30% Commercial, 30% Medicaid). This mix is the single biggest factor affecting revenue predictability.",
      "Commercial payers generally offer the highest reimbursement but have complex prior authorization rules. Medicare offers stable reimbursement but strict compliance rules. Medicaid has the lowest rates and slowest payment cycles.",
      "If your practice is highly reliant on low-reimbursing payers (like Medicaid), you must achieve ultra-high efficiency in claims processing and have a near-perfect Clean Claim Rate to maintain profitability.",
      "Use payer mix data to inform scheduling: prioritize commercial patients for high-value procedures and focus on high-volume efficiency for Medicare/Medicaid encounters.",
    ],
  },
  {
    id: 34,
    title: "ICD-10-CM Coding for Surgical Complications and Postoperative Care",
    excerpt:
      "Coding complications of care requires careful documentation. We clarify the difference between routine follow-up and a true complication requiring an additional code.",
    category: "Medical Coding",
    date: "Dec 20, 2024",
    author: "Surgical Coder",
    image: getImageUrl("surgical-complication-coding"),
    longContent: [
      "Postoperative care is usually bundled into the global surgical package. Billing for services during the post-op period is only allowed if the service is unrelated to the original surgery or if it addresses a true complication.",
      "If the patient returns for a routine follow-up, the visit is covered by the global period. If they return with a new problem or a genuine, documented complication of the surgery (e.g., wound infection), that service may be billable.",
      "Coding a complication requires the use of T80-T88 codes (Complications of medical and surgical care) and the use of the appropriate E/M code with a modifier (e.g., 24, 78, or 79) to signify the service's relationship to the global period.",
      "Clear documentation is non-negotiable. The physician's note must explicitly state the problem is a complication and is not part of the expected recovery process.",
    ],
  },
  {
    id: 35,
    title: "E/M Services for Telemedicine: Applying the New Time and MDM Rules",
    excerpt:
      "The 2021 E/M changes simplify coding but require new documentation habits for virtual visits. We cover how to apply the new MDM and time definitions to telehealth.",
    category: "Medical Coding",
    date: "Dec 10, 2024",
    author: "E/M Educator",
    image: getImageUrl("telemedicine-em-rules"),
    longContent: [
      "The E/M changes focus on Medical Decision Making (MDM) or Total Time, removing the strict requirements for history and exam elements. This applies to office-based services, including telehealth E/M.",
      "For time-based coding in telehealth, the provider must document the total time spent on the encounter on the day of the service, including time spent reviewing records, communicating, and counseling.",
      "For MDM-based coding, the provider must document the complexity of the patient's problems, the data reviewed, and the risk of complications from treatment, regardless of whether the visit was in-person or virtual.",
      "Always ensure the documentation supports the MDM level billed. For example, a high-level E/M based on MDM must show significant data review or high-risk decision-making.",
    ],
  },
  {
    id: 36,
    title: "How to Conduct a Proactive Self-Audit to Prevent Compliance Fines",
    excerpt:
      "Self-audits are your best defense against external compliance reviews. Implement a quarterly self-audit focusing on high-risk areas like upcoding and modifier usage.",
    category: "Compliance & Security",
    date: "Dec 1, 2024",
    author: "Compliance Officer",
    image: getImageUrl("compliance-self-audit"),
    longContent: [
      "A proactive self-audit identifies and corrects billing and coding errors before an external auditor (like CMS or a private payer) finds them, potentially saving your practice from massive fines and repayment demands.",
      "Focus your audit on high-risk areas: E/M codes (to check for upcoding), use of Modifier 25 and 59, and procedure codes that have a high frequency of denial for your practice.",
      "Select 10-15 charts per provider quarterly. Compare the clinical documentation against the submitted CPT and ICD-10 codes. Check that the billed service is medically necessary and fully supported by the note.",
      "Document the audit process, the errors found, and the corrective actions taken (e.g., staff training, system changes). This demonstrates 'good faith' and due diligence to regulators.",
    ],
  },
  {
    id: 37,
    title:
      "Medical Billing for Independent Diagnostic Testing Facilities (IDTFs)",
    excerpt:
      "IDTF billing has unique Medicare certification and claim submission rules. We break down the compliance requirements and the specific POS codes required for reimbursement.",
    category: "Medical Billing",
    date: "Nov 20, 2024",
    author: "IDTF Consultant",
    image: getImageUrl("idtf-billing-rules"),
    longContent: [
      "Independent Diagnostic Testing Facilities (IDTFs) are non-physician organizations that provide diagnostic tests. Medicare requires a specific, rigorous certification process for an IDTF to bill for services.",
      "A primary requirement is that the IDTF must have a supervising physician, but all services are billed under the IDTF's enrollment number, not the individual physician's.",
      "Billing requires specific Place of Service (POS) codes (e.g., POS 11 for office, POS 17 for mobile units) and often requires the referring physician's NPI number on the claim form.",
      "IDTFs are a major target for fraud, waste, and abuse (FWA) audits. Maintaining pristine documentation, especially for medical necessity and physician supervision, is non-negotiable.",
    ],
  },
  {
    id: 38,
    title: "The Role of Artificial Intelligence in Predictive Denial Analytics",
    excerpt:
      "AI is moving beyond simple claim scrubbing. Predictive analytics models can forecast which claims are likely to be denied before submission, allowing for real-time correction.",
    category: "RCM Optimization",
    date: "Nov 10, 2024",
    author: "AI/ML Expert",
    image: getImageUrl("ai-predictive-denials"),
    longContent: [
      "Traditional claim scrubbing checks against static rules. Predictive denial analytics uses machine learning (ML) to analyze millions of historical claims, identifying complex, non-obvious patterns that lead to denials.",
      "The ML model learns from your unique payer mix and denial history. For example, it might predict that claims for a specific procedure from a specific doctor for a specific payer on a Monday have a 70% chance of denial.",
      "This insight allows the billing team to flag the claim for human review and correction (e.g., adding missing documentation or changing a non-essential code) *before* it is submitted.",
      "The result is a significant increase in the Clean Claim Rate and a faster, more predictable cash flow, moving RCM from a reactive to a proactive financial function.",
    ],
  },
  {
    id: 39,
    title:
      "Best Practices for Timely Filing Limits (TFL): A State-by-State Overview",
    excerpt:
      "Failing to submit claims before the Payer's Timely Filing Limit (TFL) is a complete revenue loss. We discuss TFL variations and workflow steps to ensure all claims are submitted on time.",
    category: "Medical Billing",
    date: "Nov 5, 2024",
    author: "Compliance Analyst",
    image: getImageUrl("timely-filing-calendar"),
    longContent: [
      "The Timely Filing Limit (TFL) is the maximum period (e.g., 90, 180, or 365 days) a payer allows between the date of service and the claim submission date. Claims filed late are automatically denied and are often non-appealable.",
      "TFLs vary widely by payer and state. Medicare's general TFL is 12 months, but many commercial and Medicaid plans have TFLs as short as 90 days. Knowing each payer's specific TFL is essential.",
      "Implement a daily charge capture and submission workflow. Claims should be submitted to the clearinghouse daily to avoid bottlenecks. Any claims older than 30 days should be flagged for immediate review.",
      "Use aging reports to monitor the oldest claims. Claims reaching 60 days old should be a panic alert, triggering immediate staff review to prevent them from hitting the TFL.",
    ],
  },
  {
    id: 40,
    title:
      "Physician Documentation Pitfalls: Common Errors That Lead to E/M Downcoding",
    excerpt:
      "The physician's note is the only justification for the code. We detail the top five documentation pitfalls that force coders to downcode high-value E/M visits.",
    category: "EHR/EMR Insights",
    date: "Oct 29, 2024",
    author: "Clinical Documentation Specialist",
    image: getImageUrl("physician-downcoding-errors"),
    longContent: [
      "The number one reason for E/M downcoding is insufficient documentation to support the billed level. If the provider notes a high-level service but the documentation only supports a mid-level one, the coder must downcode to avoid compliance risk.",
      "Common pitfalls include: Vague assessment statements that fail to clarify the complexity of problems addressed; lack of explicit notation of the data reviewed (e.g., 'reviewed old chart' vs. 'reviewed prior specialist's notes, X-ray report, and lab results'); and failure to document the risk associated with prescribing a new medication or ordering a high-risk test.",
      "Failure to explicitly document the time spent on the encounter is the second major pitfall for time-based coding. If the note says '35 minutes' but the code requires 40-54 minutes, the coder must downcode.",
      "Training clinicians on the direct link between their documentation and practice revenue is the most powerful tool for improving coding accuracy and reducing unwarranted downcoding.",
    ],
  },
];
// --- END POSTS Data ---

// Locate the featured post (ID 1), ensuring it exists
const featuredPost: Post = allPosts.find((p) => p.id === 1) as Post; // Type assertion since we know it exists

// Trending posts data, explicitly typed to the simpler structure
const trendingPosts: TrendingPost[] = [
  {
    id: 3,
    title:
      "Understanding Modifier 25: Separately Identifiable E/M Services on the Same Day",
    category: "Medical Coding",
  },
  {
    id: 5,
    title:
      "7 Critical KPIs for RCM Audits: Benchmarking Your Practice's Financial Health",
    category: "RCM Optimization",
  },
  {
    id: 8,
    title:
      "Telehealth Billing 2026: New Place of Service (POS) Codes and Modifiers",
    category: "Medical Billing",
  },
];

// --- 2. REUSABLE COMPONENTS ---

/**
 * Renders the expanded content for a single post (Simulated View)
 */
// SinglePostContent: Explicitly define the Post type in props
const SinglePostContent: React.FC<PostComponentProps> = ({
  post,
  setViewingPostId,
}) => (
  <article className="bg-white p-8 md:p-12 rounded-2xl shadow-3xl mt-10">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h2>
    <p className="text-sm text-gray-500 mb-8 border-b pb-4">
      {post.author} • {post.date} • Category:{" "}
      <span className="text-emerald-600 font-semibold">{post.category}</span>
    </p>

    <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
      {/* Type assertion needed for fill prop when using Image */}
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 800px"
      />
    </div>

    <div className="prose prose-lg max-w-none">
      {post.longContent &&
        post.longContent.map((paragraph, i) => (
          <p key={i} className="text-gray-700 mb-6 leading-relaxed">
            {paragraph}
          </p>
        ))}
    </div>

    <div className="text-center mt-12">
      <button
        onClick={() => setViewingPostId(null)}
        className="px-8 py-3 text-lg font-semibold border-2 border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 transition duration-200"
      >
        ← Back to All Articles
      </button>
    </div>
  </article>
);

// Featured Post Card
// FeaturedPostCard: Explicitly define the Post type in props
const FeaturedPostCard: React.FC<PostComponentProps> = ({
  post,
  setViewingPostId,
}) => (
  <Link
    href="#main-post-content"
    // Event type is implicitly inferred, but explicitly set here for clarity
    onClick={(e) => {
      e.preventDefault(); // Prevents default link navigation if Link component used
      setViewingPostId(post.id);
    }}
    className="block mb-16 group"
  >
    <div className="relative overflow-hidden rounded-2xl shadow-3xl transition duration-500 ease-in-out transform hover:scale-[1.01] hover:shadow-4xl">
      <div className="relative w-full h-[450px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover w-full h-full"
          priority
          sizes="(max-width: 1200px) 100vw, 1280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
      </div>

      <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
        <span className="inline-block px-4 py-1 text-sm font-semibold uppercase tracking-wider rounded-full bg-emerald-600/90 text-white mb-3">
          {post.category}
        </span>
        <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight group-hover:text-emerald-200 transition duration-150">
          {post.title}
        </h2>
        <p className="text-gray-200 mt-3 text-lg max-w-3xl">{post.excerpt}</p>
        <p className="text-sm mt-4 font-medium text-emerald-300">
          {post.author} • {post.date}
        </p>
      </div>
    </div>
  </Link>
);

// Standard Post Item
// PostListItem: Explicitly define the Post type in props
const PostListItem: React.FC<PostComponentProps> = ({
  post,
  setViewingPostId,
}) => (
  <article className="flex flex-col md:flex-row border-b border-gray-200 pb-10 mb-10 last:border-b-0 last:pb-0 last:mb-0">
    <div className="md:w-2/3 md:pr-10">
      <span className="text-sm font-semibold uppercase text-emerald-600 tracking-wider">
        {post.category}
      </span>
      <Link
        href="#main-post-content"
        onClick={(e) => {
          e.preventDefault();
          setViewingPostId(post.id);
        }}
        className="block mt-2 mb-2 group"
      >
        <h3 className="text-2xl font-bold text-gray-900 transition-colors duration-150 group-hover:text-emerald-700">
          {post.title}
        </h3>
      </Link>
      <p className="text-gray-600 mb-4 text-base leading-relaxed">
        {post.excerpt}
      </p>
      <p className="text-sm text-gray-500">
        By {post.author} on {post.date}
      </p>
    </div>
    <div className="md:w-1/3 relative h-48 mt-6 md:mt-0 md:h-auto">
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="object-cover rounded-xl shadow-md"
        sizes="(max-width: 768px) 100vw, 300px"
      />
    </div>
  </article>
);

// Pagination Component
const Pagination: React.FC<PaginationProps> = ({
  postsPerPage,
  totalPosts,
  paginate,
  currentPage,
}) => {
  const pageNumbers: number[] = [];
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const prevPage = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  return (
    <nav className="mt-16">
      <ul className="flex justify-center items-center space-x-2">
        <li>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`p-3 rounded-full transition duration-150 ${
              currentPage === 1
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </li>

        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-lg text-lg font-semibold transition duration-150 ${
                number === currentPage
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {number}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`p-3 rounded-full transition duration-150 ${
              currentPage === totalPages
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Sidebar (Cleaned up, only Trending Now remains)
const Sidebar: React.FC<SidebarProps> = ({ setViewingPostId }) => {
  // Helper to get the actual post data for the sidebar list
  const getTrendingPost = (id: number): Post => {
    // Find the post, and use type assertion because we know these IDs exist
    return allPosts.find((p) => p.id === id) as Post;
  };

  return (
    <aside className="space-y-10">
      {/* Trending Articles Widget - Enhanced Design */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-emerald-600">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-2">
          🔥 Trending Now
        </h3>
        <ul className="space-y-6">
          {trendingPosts.map((post, index) => {
            const actualPost: Post = getTrendingPost(post.id);
            return (
              <li
                key={post.id}
                className="flex items-start border-b pb-4 last:border-b-0 last:pb-0"
              >
                <span className="text-3xl font-extrabold text-emerald-600 mr-4 opacity-80 leading-none">
                  {index + 1}
                </span>
                <Link
                  href="#main-post-content"
                  onClick={(e) => {
                    e.preventDefault();
                    setViewingPostId(actualPost.id);
                  }}
                  className="text-gray-800 hover:text-emerald-600 font-medium text-lg leading-snug transition-colors duration-150"
                >
                  {actualPost.title}
                  <p className="text-xs text-gray-500 mt-1 uppercase">
                    {actualPost.category}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

// --- 3. MAIN BLOG PAGE COMPONENT ---
export default function DemetaBlogPage() {
  // viewingPostId can be null or a number
  const [viewingPostId, setViewingPostId] = React.useState<number | null>(null);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const postsPerPage: number = 10;

  // currentPost can be undefined if not found, hence Post | undefined
  const currentPost: Post | undefined = allPosts.find(
    (post) => post.id === viewingPostId
  );

  // Logic for displaying current posts based on pagination
  const allPostsExceptFeatured: Post[] = allPosts.filter(
    (p) => p.id !== featuredPost.id
  );
  const indexOfLastPost: number = currentPage * postsPerPage;
  const indexOfFirstPost: number = indexOfLastPost - postsPerPage;
  const currentPosts: Post[] = allPostsExceptFeatured.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  // Change page handler for pagination
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Smooth scroll logic, checking if element exists
    const mainContent = document.getElementById("main-post-content");
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  };

  // If a post is being viewed, render the SinglePostContent
  if (viewingPostId !== null && currentPost) {
    return (
      <div
        id="main-post-content"
        className="bg-gray-50 min-h-screen pt-16 pb-20"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* currentPost is guaranteed to be a Post object here due to the check */}
          <SinglePostContent
            post={currentPost}
            setViewingPostId={setViewingPostId}
          />
        </div>
      </div>
    );
  }

  // Otherwise, render the main article list view (Index)
  return (
    <div id="top-of-page" className="bg-white min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <header className="mb-20 pt-10 border-b pb-8">
          <h1 className="text-6xl font-extrabold text-gray-900 text-center mb-5">
            RCM & Compliance <span className="text-emerald-600">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-4xl mx-auto">
            Deep dive into expert analysis on Medical Billing, Revenue Cycle
            Management, and complex Healthcare Compliance topics.
          </p>
        </header>

        {/* Featured Post Hero Section */}
        <FeaturedPostCard
          post={featuredPost}
          setViewingPostId={setViewingPostId}
        />

        {/* Main Content Grid: Post Feed + Sidebar */}
        <div
          id="main-post-content"
          className="grid grid-cols-1 lg:grid-cols-3 gap-16"
        >
          {/* Main Post Feed (Paginated) */}
          <main className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 pb-2">
              Latest Articles (Page {currentPage})
            </h2>
            <div className="space-y-12">
              {currentPosts.map((post: Post) => (
                <PostListItem
                  key={post.id}
                  post={post}
                  setViewingPostId={setViewingPostId}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={allPostsExceptFeatured.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </main>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar setViewingPostId={setViewingPostId} />
          </div>
        </div>
      </div>
    </div>
  );
}
