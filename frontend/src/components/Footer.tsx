"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <p className="flex items-center gap-2 text-gray-600 text-[16px] font-medium">
            Made with
            <span className="text-red-500 animate-pulse text-2xl leading-none">♥</span>
            <span className="font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">by Team Beyond
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}