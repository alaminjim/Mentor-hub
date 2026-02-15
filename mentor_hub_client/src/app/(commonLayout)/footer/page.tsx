import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
} from "lucide-react";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  className?: string;
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
}

const Footer = ({
  className,
  tagline = "Empowering Students Through Expert Tutoring",
  menuItems = [
    {
      title: "Quick Links",
      links: [
        { text: "Find a Tutor", url: "#" },
        { text: "Become a Tutor", url: "#" },
        { text: "How It Works", url: "#" },
        { text: "Subjects", url: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "#" },
        { text: "Contact", url: "#" },
        { text: "Careers", url: "#" },
        { text: "Blog", url: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { text: "Help Center", url: "#" },
        { text: "FAQs", url: "#" },
        { text: "Privacy Policy", url: "#" },
        { text: "Terms of Service", url: "#" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} Mentor_Hub. All rights reserved.`,
}: Footer2Props) => {
  const socialLinks = [
    {
      icon: Facebook,
      url: "#",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    { icon: Twitter, url: "#", label: "Twitter", color: "hover:text-sky-500" },
    {
      icon: Instagram,
      url: "#",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
    {
      icon: Linkedin,
      url: "#",
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
  ];

  const contactInfo = [
    { icon: Mail, text: "support@mentorhub.com" },
    { icon: Phone, text: "+880 1234-567890" },
    { icon: MapPin, text: "Dhaka, Bangladesh" },
  ];

  return (
    <footer
      className={cn(
        "w-full bg-gradient-to-br from-gray-50 to-sky-50 border-t border-gray-200 mt-auto",
        className,
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <GraduationCap className="size-6 text-white" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                Mentor_Hub
              </span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-sm leading-relaxed">
              {tagline}
            </p>

            <div className="space-y-3 mb-6">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-gray-600 hover:text-sky-600 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                    <item.icon className="size-4 text-sky-600" />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  className={cn(
                    "w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 transition-all hover:shadow-md hover:-translate-y-0.5",
                    social.color,
                  )}
                >
                  <social.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {menuItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.url}
                      className="text-gray-600 hover:text-sky-600 transition-colors text-sm font-medium inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 h-0.5 bg-sky-600 group-hover:w-4 transition-all duration-300"></span>
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-bold text-gray-900 text-xl mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Subscribe to our newsletter for the latest updates and educational
              tips
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg font-medium hover:from-sky-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">{copyright}</p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-gray-600 hover:text-sky-600 transition-colors text-sm font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-sky-600 transition-colors text-sm font-medium"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-600 hover:text-sky-600 transition-colors text-sm font-medium"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export { Footer };
