import aiAnimation from "@/public/animations/ai.json";
import enterpriseAnimation from "@/public/animations/enterprise.json";
import blockchainAnimation from "@/public/animations/blockchain.json";

export const expertiseData = {
  sectionOne: {
    title: "Custom Medical Billing Solutions",
    description:
      "We deliver high-fidelity software solutions for hospitals, clinics, and healthcare practices designed to simplify billing, insurance claims, and patient management. Our solutions are fully compliant with HIPAA and other healthcare regulations, ensuring your data is secure and processes are optimized.",
    points: [
      "End-to-End Medical Billing Automation – Reduce errors and speed up claim approvals.",
      "Practice Management Systems – Streamline appointments, patient records, and billing.",
      "EHR / EMR Integration – Seamless integration with electronic health records.",
      "Revenue Cycle Management – Improve cash flow with optimized billing and collections.",
      "Insurance Claims Processing – Automated claim generation, submission, and tracking.",
      "Patient Portal & Mobile Apps – Enable patients to view bills, pay, and schedule appointments.",
      "Custom Reports & Analytics – Data-driven insights to optimize revenue and operations.",
    ],
  },
  sectionTwo: {
    title: "Collect Smarter, Collect Faster",
    description:
      "Payor changes can be challenging, but Demeta is here to help. Our revenue cycle management solution makes missed collections a thing of the past. Our easy-to-use platform provides total visibility into your performance, enabling you to improve collections and get paid faster with less work.",
    points: [
      "Fee schedule reviews and analysis",
      "Eligibility verification",
      "Assistance with EDI, ERA, and provider enrollment",
      "Electronic and paper claims submission",
      "Account receivables management",
      "Secondary insurance billing",
      "Answering incoming patient calls",
      "Old account receivables recovery",
      "Referral and authorization alert",
      "Charge entry for all specialties",
      "Posting of insurance and patient payments",
      "Extensive insurance follow-up",
    ],

    animation: enterpriseAnimation,
  },
  sectionThree: {
    title: "Sophisticated Medical Billing & RCM Solutions",
    description:
      "Demeta’s medical billing services eliminate revenue leakages and optimize revenue collection by streamlining your entire workflow, from eligibility and check-in to copay collection and back-office management. By working with us, you can expect to see a 5 to 10% increase in collections in the first few months, with 96% of claims getting paid on the first submission.",
    points: [
      "5 to 10% increase in collections in the first 3 months",
      "96% of claims getting paid on first submission",
      "Significant reductions in A/R days and denials",
      "Timely patient statement dispatch",
      "Visibility and transparency of every dollar you earn",
      "Zero ICD-10 disruption",
    ],
    animation: blockchainAnimation,
  },
  sectionFour: {
    title: "Medical Billing Services Made Easy",
    description:
      "Demeta is one of the leading medical revenue cycle companies that offers innovative solutions and services to medical practices, clinics, and hospitals. Our revenue cycle management services are highly regarded for their accuracy, efficiency, and effectiveness in optimizing financial performance.",
    points: [
      "Electronic Medical Record (EMR)",
      "Practice Management (PM)",
      "Patient Portal",
      "Mobile App for Apple and Android",
      "Hosting of patient information, claim management, and payment processing",
      "Vaccine Management System",
    ],
    animation: aiAnimation,
  },
};
