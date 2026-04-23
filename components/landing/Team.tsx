"use client";

import { useRef, useEffect, forwardRef } from "react";
import Image from "next/image";
import { Linkedin, Twitter, Github } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const teamMembers = [
  {
    name: "Alex Johnson",
    position: "CEO & Founder",
    image: "/placeholder.svg",
    bio: "With over 15 years of experience in IT leadership, Alex founded Stack Pinnacle with a vision to transform how businesses leverage technology.",
    social: {
      linkedin: "#",
      twitter: "#",
      github: "#",
    },
  },
  {
    name: "Sarah Williams",
    position: "CTO",
    image: "/placeholder.svg",
    bio: "Sarah leads our technical strategy and innovation, bringing her expertise in cloud architecture and cybersecurity to every client solution.",
    social: {
      linkedin: "#",
      twitter: "#",
      github: "#",
    },
  },
  {
    name: "Michael Chen",
    position: "Lead Developer",
    image: "/placeholder.svg",
    bio: "Michael oversees our development team, ensuring we deliver robust, scalable software solutions that exceed client expectations.",
    social: {
      linkedin: "#",
      twitter: "#",
      github: "#",
    },
  },
  {
    name: "Emily Rodriguez",
    position: "Head of Cybersecurity",
    image: "/placeholder.svg",
    bio: "Emily's expertise in threat detection and security infrastructure helps our clients stay protected in an ever-evolving digital landscape.",
    social: {
      linkedin: "#",
      twitter: "#",
      github: "#",
    },
  },
];

const Team = forwardRef<HTMLElement>((props, ref) => {
  const sectionRef = useRef<HTMLElement>(null);

  // Combine the forwarded ref with our local ref
  const setRefs = (element: HTMLElement | null) => {
    // Update our local ref
    if (sectionRef.current !== element) {
      sectionRef.current = element;
    }

    // Forward the ref
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  useEffect(() => {
    // Don't run during SSR
    if (typeof window === "undefined") return;

    // Create a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      // Make sure component is mounted and ScrollTrigger is available
      const ctx = gsap.context(() => {
        if (sectionRef.current) {
          const teamCards = sectionRef.current.querySelectorAll(".team-card");

          // First ensure they're visible but at starting position
          gsap.set(teamCards, { opacity: 1, y: 50 });

          // Create the animation
          gsap.to(teamCards, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%", // Trigger earlier
              markers: false, // Disable markers
              toggleActions: "play none none reset",
            },
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out",
          });
        }
      }, sectionRef);

      // Clean up context on unmount
      return () => {
        ctx.revert();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <section ref={setRefs} id="team" className="w-full py-12 md:py-24">
      <div className="w-full px-8 md:px-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#5ebc66]/20 px-3 p-1 text-bold text-[#5ebc66]">
              Our Team
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#172737]">
              Meet Our Experts
            </h2>
            <p className="max-w-[900px] text-[#848b94] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our talented team of professionals is dedicated to delivering
              exceptional IT solutions.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="team-card group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md hover:border-[#5ebc66] transform hover:scale-105 duration-300 flex flex-col h-full"
              style={{
                opacity: 1,
              }} /* Ensure cards are visible even without JS */
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={member.image}
                  width={300}
                  height={300}
                  alt={member.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  priority={index < 2} /* Prioritize loading first two images */
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#172737]">
                  {member.name}
                </h3>
                <p className="text-sm text-[#5ebc66] mb-2">{member.position}</p>
                <p className="text-sm text-[#848b94] mb-4 flex-grow">
                  {member.bio}
                </p>
                <div className="flex space-x-3">
                  <a
                    href={member.social.linkedin}
                    className="text-[#848b94] hover:text-[#5ebc66] transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a
                    href={member.social.twitter}
                    className="text-[#848b94] hover:text-[#5ebc66] transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a
                    href={member.social.github}
                    className="text-[#848b94] hover:text-[#5ebc66] transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Team.displayName = "Team";

export default Team;
