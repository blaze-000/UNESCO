"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/course", label: "Courses" },
    { href: "/chats", label: "Chats" },
  ];

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-bold text-lg text-gray-900">
              UNESCO Youth Hackathon
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-medium transition-all duration-200 pb-1
    ${isActive ? "text-red-600" : "text-gray-600 hover:text-red-500"}
    after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full
    after:scale-x-0 hover:after:scale-x-100 after:origin-left
    after:bg-red-500 after:transition-transform after:duration-200`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
