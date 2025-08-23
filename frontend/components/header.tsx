import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky  top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-bold text-lg text-gray-900">
              UNESCO Youth Hackathon
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-900 font-medium">
              Home
            </Link>
            <Link
              href="/course"
              className="text-gray-600 hover:text-red-500 transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/chats"
              className="text-gray-600 hover:text-red-500 transition-colors"
            >
              Chats
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
