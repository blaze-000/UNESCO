"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Star,
  MessageSquare,
  ShieldAlert,
  Video,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";

export default function HomePage() {
  const timelineRef = useRef(null);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true, amount: 0.2 },
  };

  const images = [
    "/images/audio-1-1-1.png",
    "/images/audio-2-1-1.png",
    "/images/audio-3-1-1.png",
    "/images/audio-4-1-1.png",
    "/images/audio-5-1-1.png",
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white">
        <div className="relative flex flex-col lg:flex-row w-full max-w-7xl items-center justify-between gap-6 lg:gap-12">
          {/* Image Stack */}
          <motion.div
            className="relative  mb-16 w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px]  transition-all duration-300 lg:w-[360px] lg:h-[360px] flex-shrink-0 order-2 lg:order-1"
            initial="rest"
            whileHover="hover"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            {images.map((src, i) => (
              <motion.div
                key={i}
                className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden shadow-sm border border-gray-100 "
                variants={{
                  rest: { x: i * 15, y: i * 15, scale: 1 },
                  hover: { x: i * 200, y: 0, scale: 1 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                  delay: i * 0.05,
                }}
              >
                <Image
                  src={src}
                  alt={`Hero ${i}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Hero Text */}
          {!isImageHovered && (
            <div className="flex-1 max-w-xl text-center lg:text-left order-1 lg:order-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
                Youth Leading the Way
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
                Join the UNESCO Youth Hackathon 2025 and build Media & Information
                Literacy solutions that impact communities worldwide.
              </p>
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
                size="lg"
              >
                <Link href="/all-courses">
                  Start Course
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA for Luma Chatbot */}
      <section className="py-16 md:py-20 bg-red-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-4 md:px-6"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            Meet Luma
          </h2>
          <p className="text-base md:text-lg mb-6 md:mb-8 leading-relaxed opacity-90">
            Our AI-powered chatbot helps you spot and understand deceptive ads —
            from fake reviews to AI-generated scams. Stay safe, stay informed.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-red-600 font-semibold px-6 md:px-8 py-4 md:py-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50"
          >
            <Link href="/chats">
              Try Luma Now
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Timeline Section (Replaced with Event Timeline design) */}
      <motion.section
        ref={timelineRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full pb-12 md:pb-20 bg-gray-50 pt-16 md:pt-20"
      >
        <div className="">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              Evolution of Deceptive Marketing
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base text-center text-gray-600 max-w-3xl mx-auto mb-12"
          >
            From spam emails to AI-powered deepfakes — here’s how deceptive
            tactics evolved.
          </motion.div>

          {/* Desktop Timeline Visual */}
          <motion.section
            {...fadeInUp}
            className="hidden xl:flex w-full relative bg-gray-50 overflow-hidden pt-50 pb-50"
          >
            {/* central horizontal line (full width) */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-300 z-0" />

            {/* Timeline items */}
            <div className="flex justify-center gap-4 w-full z-10 max-w-7xl mx-auto px-6">
              {[
                { year: "2010s", label: "Fake Reviews", icon: Star },
                { year: "2015", label: "Clickbait Ads", icon: MessageSquare },
                { year: "2018", label: "Social Media Bots", icon: Bot },
                {
                  year: "2021",
                  label: "Misinformation Campaigns",
                  icon: ShieldAlert,
                },
                { year: "2024+", label: "AI Deepfakes", icon: Video },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative flex justify-center flex-1"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true, amount: 0.6 }}
                >
                  {/* Card */}
                  <div
                    className={`absolute ${
                      index % 2 === 0 ? "top-[-160px]" : "top-[40px]"
                    } w-80 pt-6 px-6 pb-8 bg-white shadow-md border border-gray-200 rounded-xl`}
                  >
                    <div className="flex items-start gap-3">
                      <item.icon className="w-10 h-10 text-red-600" />
                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-medium text-red-600">
                          {item.year}
                        </p>
                        <h3 className="text-md font-semibold text-gray-900">
                          {item.label}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Circles + connecting line */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-1">
                    <div className="w-4 h-4  bg-white rounded-full border-4 border-red-600 z-10" />
                    <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-red-600 z-0" />
                    <div className="w-4 h-4  bg-white rounded-full border-4 border-red-600 z-10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Mobile Timeline Visual */}
          <motion.section
            {...fadeInUp}
            className="xl:hidden w-full relative bg-gray-50 overflow-hidden py-6"
          >
            {/* Timeline items */}
            <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
              {/* Vertical timeline line - positioned relative to container */}
              <div className="absolute left-10 md:left-16 top-0 bottom-0 w-0.5 bg-gray-300 z-0" />
              {[
                { year: "2010s", label: "Fake Reviews", icon: Star },
                { year: "2015", label: "Clickbait Ads", icon: MessageSquare },
                { year: "2018", label: "Social Media Bots", icon: Bot },
                {
                  year: "2021",
                  label: "Misinformation Campaigns",
                  icon: ShieldAlert,
                },
                { year: "2024+", label: "AI Deepfakes", icon: Video },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative flex items-start mb-8 last:mb-0"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true, amount: 0.6 }}
                >
                  {/* Two Timeline dots */}
                  <div className="absolute left-6 sm:left-8 md:left-10 top-2 w-4 h-4 bg-white rounded-full border-4 border-red-600 z-10 transform -translate-x-1/2" />
                  <div className="absolute left-6 sm:left-8 md:left-10 top-16 w-4 h-4 bg-white rounded-full border-4 border-red-600 z-10 transform -translate-x-1/2" />

                  {/* Connecting line (except for last item) */}
                  {index < 5 && (
                    <div className="absolute left-6 sm:left-8 md:left-10 top-2 w-0.5 h-16 bg-red-600 z-0 transform -translate-x-1/2" />
                  )}

                  {/* Card */}
                  <div className="ml-12 sm:ml-14 md:ml-16 flex-1 pt-4 px-4 pb-6 bg-white shadow-md border border-gray-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <item.icon className="w-8 h-8 text-red-600 flex-shrink-0" />
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-medium text-red-600">
                          {item.year}
                        </p>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {item.label}
                        </h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </motion.section>
    </div>
  );
}