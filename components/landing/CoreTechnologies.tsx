// "use client";

// import React, { useState } from "react";
// import { technologiesData } from "./technologiesData";

// export const CoreTechnologies: React.FC = () => {
//   const [activeTab, setActiveTab] = useState(technologiesData[0].title);

//   const activeCategory = technologiesData.find(
//     (cat) => cat.title === activeTab
//   );

//   return (
//     <section className="w-full py-16 bg-white text-center">
//       <div className="max-w-6xl mx-auto px-4">
//         <h2 className="text-3xl sm:text-4xl lg:text-6xl md:text-5xl font-extrabold mb-6 text-gray-900">
//           OUR CORE SERVICES
//         </h2>
//         <p className="text-lg md:text-xl text-black mb-12 leading-relaxed">
//           We work under various modern technologies for effective, scalable, and
//           future-proof software <br></br>development.
//         </p>

//         {/* Tabs */}
//         <div className="flex flex-wrap justify-center gap-6 mb-12 border-b border-gray-200 pb-4">
//           {technologiesData.map((tab) => (
//             <button
//               key={tab.title}
//               onClick={() => setActiveTab(tab.title)}
//               className={`relative pb-2 font-medium transition-colors duration-200 ${
//                 activeTab === tab.title
//                   ? "text-green-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-green-600"
//                   : "text-gray-500 hover:text-green-800"
//               }`}
//             >
//               {tab.title}
//             </button>
//           ))}
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
//           {activeCategory?.items.map((tech) => (
//             <div
//               key={tech.name}
//               className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm transition p-6 cursor-pointer"
//             >
//               <img
//                 src={tech.icon}
//                 alt={tech.name}
//                 className="h-10 w-10 object-contain mb-3"
//               />
//               <span className="text-sm font-medium text-gray-800">
//                 {tech.name}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

"use client";

import React, { useState } from "react";
import {
  Send,
  CreditCard,
  XCircle,
  Target,
  Mail,
  TrendingDown,
  Scale,
  Users,
  Gavel,
  ClipboardList,
  ShieldCheck,
  Zap,
  BarChart3,
  Syringe,
  Scan,
  HeartPulse,
  Package,
  Brain,
  Clock4,
  Database,
  DollarSign,
  FileText,
  Settings,
  AreaChart,
} from "lucide-react";

// --- Icon Mapping and Data Structures ---

// Map string keys to Lucide React components
const IconMap = {
  Send,
  CreditCard,
  XCircle,
  Target,
  Mail,
  TrendingDown,
  Scale,
  Users,
  Gavel,
  ClipboardList,
  ShieldCheck,
  Zap,
  BarChart3,
  Syringe,
  Scan,
  HeartPulse,
  Package,
  Brain,
  Clock4,
  Database,
  DollarSign,
  FileText,
  Settings,
  AreaChart,
};

// Interface for a single service item
export interface ServiceItem {
  name: string;
  icon: keyof typeof IconMap;
}

// Interface for a service category (tab)
export interface ServiceCategory {
  title: string;
  description: string;
  items: ServiceItem[];
}

// Comprehensive data for medical billing services
export const billingServicesData: ServiceCategory[] = [
  {
    title: "Revenue Cycle Management (RCM)",
    description:
      "End-to-end financial management to maximize cash flow and minimize revenue leakage.",
    items: [
      { name: "Claims Submission & Scrubbing", icon: "Send" },
      { name: "Payment & ERA Posting", icon: "CreditCard" },
      { name: "Denial Management & Appeals", icon: "XCircle" },
      { name: "Accounts Receivable (A/R) Follow-Up", icon: "Target" },
      { name: "Underpayment & Contract Analysis", icon: "TrendingDown" },
      { name: "Clean Claim Rate Optimization", icon: "BarChart3" },
      { name: "A/R Day Reduction", icon: "Clock4" },
      { name: "Patient Statement Management", icon: "Mail" },
      { name: "Collections & Bad Debt Management", icon: "Scale" },
    ],
  },
  {
    title: "Practice & Compliance Support",
    description:
      "Administrative and regulatory support services to ensure continuous operation and adherence to standards.",
    items: [
      { name: "Credentialing & Payer Enrollment", icon: "Users" },
      { name: "Auditing & Compliance Checks", icon: "Gavel" },
      { name: "Fee Schedule Review & Negotiation", icon: "ClipboardList" },
      { name: "HIPAA Security & Training", icon: "ShieldCheck" },
      { name: "EHR/PMS System Integration", icon: "Zap" },
      { name: "Custom Financial Reporting", icon: "AreaChart" },
      { name: "Front Office Staff Training", icon: "Settings" },
      { name: "Document Management", icon: "FileText" },
      { name: "Data Hosting & Security", icon: "Database" },
    ],
  },
  {
    title: "Specialty & Value-Added Services",
    description:
      "Targeted billing expertise and advanced services for specific medical practice needs.",
    items: [
      { name: "Cardiology Billing", icon: "HeartPulse" },
      { name: "Radiology/Imaging Billing", icon: "Scan" },
      { name: "Anesthesia Billing", icon: "Syringe" },
      { name: "Durable Medical Equipment (DME) Billing", icon: "Package" },
      { name: "Mental & Behavioral Health Billing", icon: "Brain" },
      { name: "Urgent Care Billing", icon: "Clock4" },
      { name: "Charge Capture Optimization", icon: "DollarSign" },
      { name: "ICD-10/CPT Coding Review", icon: "FileText" },
      { name: "Telehealth Billing", icon: "Zap" },
    ],
  },
];

// --- Main Component ---

export const CoreTechnologies: React.FC = () => {
  const [activeTab, setActiveTab] = useState(billingServicesData[0].title);

  const activeCategory = billingServicesData.find(
    (cat) => cat.title === activeTab
  );

  return (
    <section className="w-full py-16 bg-gray-50 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-gray-900">
          SOPHISTICATED RCM & MEDICAL BILLING SERVICES
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
          Our integrated solutions cover the full revenue cycle, driving
          efficiency and profitability for your practice.
        </p>

        {/* Tabs for Categories */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 border-b-2 border-green-100 pb-4">
          {billingServicesData.map((tab) => (
            <button
              key={tab.title}
              onClick={() => setActiveTab(tab.title)}
              className={`relative py-3 px-4 sm:px-6 font-semibold text-lg transition-all duration-300 rounded-lg ${
                activeTab === tab.title
                  ? "bg-green-600 text-white shadow-lg shadow-green-200"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Active Category Description */}
        {activeCategory && (
          <p className="text-lg text-gray-700 mb-10 italic max-w-3xl mx-auto">
            {activeCategory.description}
          </p>
        )}

        {/* Service Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {activeCategory?.items.map((service) => {
            const IconComponent = IconMap[service.icon];
            return (
              <div
                key={service.name}
                className="flex flex-col items-center justify-start bg-white border border-gray-100 h-40 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 cursor-pointer transform hover:scale-[1.03]"
              >
                <div className="p-3 mb-3 rounded-full bg-green-50 text-green-600">
                  {IconComponent && <IconComponent className="h-6 w-6" />}
                </div>
                <span className="text-center text-sm font-semibold text-gray-800 leading-tight">
                  {service.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreTechnologies;
