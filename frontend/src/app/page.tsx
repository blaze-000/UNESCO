"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Target, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Youth-Led Innovation",
      description: "Empowering young minds to create media and information literacy solutions",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Impact-Driven",
      description: "Building solutions that address real-world challenges in digital literacy",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Creative Solutions",
      description: "Fostering creativity and innovation in media literacy education",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Youth Leading the Way
              </motion.h1>

              <motion.h2
                className="text-xl sm:text-2xl lg:text-3xl text-gray-700 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Building MIL Solutions for Impact
              </motion.h2>

              <motion.div
                className="w-16 h-1 bg-red-500 mx-auto mb-8"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />

              <motion.p
                className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Join the UNESCO Youth Hackathon 2025 and learn how to create impactful Media and Information Literacy
                solutions that empower communities worldwide.
              </motion.p>

              <motion.p
                className="text-gray-500 mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                A comprehensive course designed for young innovators who want to make a difference through technology
                and media literacy.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <Button
                  asChild
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                  size="lg"
                >
                  <Link href="/all-courses">
                    Start Course
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-8"
          >
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">12</div>
              <div className="text-gray-500 uppercase tracking-wide text-sm">Learning Modules</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">3h</div>
              <div className="text-gray-500 uppercase tracking-wide text-sm">Total Duration</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">1</div>
              <div className="text-gray-500 uppercase tracking-wide text-sm">Certificate</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Join the Hackathon?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Be part of a global community dedicated to advancing media literacy and creating lasting impact
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6 text-red-500">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 mb-4">UNESCO Youth Hackathon 2025 • Building the Future Together</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
