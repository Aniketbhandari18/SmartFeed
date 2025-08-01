import * as motion from "motion/react-client";
import Link from "next/link";
import {
  Brain,
  BarChart3,
  Zap,
  CheckCircle,
  ArrowRight,
  ClipboardList,
  Search,
  Bell,
} from "lucide-react";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: "Smart Feedback Categorization",
      description:
        "Automatically classify feedback into categories like complaints, praise, and more using AI.",
    },
    {
      icon: Zap,
      title: "Instant Sentiment & Classification",
      description:
        "Get real-time sentiment analysis and intent detection the moment feedback is submitted.",
    },
    {
      icon: ClipboardList,
      title: "Actionable Task Generation",
      description:
        "Convert feedback into internal tasks to streamline resolution and follow-ups.",
    },
    {
      icon: BarChart3,
      title: "Weekly Insight Reports",
      description:
        "Receive automated weekly summaries with breakdowns of key feedback categories.",
    },
    {
      icon: Search,
      title: "Smart Similar Feedback Finder",
      description:
        "Discover related feedback to uncover patterns and address recurring issues efficiently.",
    },
    {
      icon: Bell,
      title: "Anomaly Detection Alerts",
      description:
        "Get notified via email when there's a sudden spike in complaints or negative feedback.",
    },
  ];

  const benefits = [
    "Collect meaningful customer feedback effortlessly",
    "Gain AI-powered insights to prioritize actions",
    "Make smarter product decisions backed by real feedback trends and data",
    "Get weekly summaries that highlight what matters most",
    "Detect anomalies like sudden complaint spikes with auto-alerts",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-200 via-gray-100 bg-gray-200 text-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="pt-20 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-gray-700 mb-6"
          >
            AI-Powered <span className="text-gray-700">Feedback Hub</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 23 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-6"
          >
            Collect, categorize, and analyze valuable feedback with the power of
            AI. Get instant insights to improve experiences, processes, and
            decision-making.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 13 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{
              delay: 0.5,
              duration: 0.3,
              scale: { duration: 0.2 },
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <SignedIn>
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 bg-gray-700 text-white rounded-xl transition-all duration-200 transform shadow-sm"
              >
                <Button variant="grey" size="xl">
                  Go to Dashboard
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignUpButton>
                <Button variant="grey" size="xl">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <div className="pt-12 pb-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Powerful Features for Teams and Organizations
              </h2>
              <p className="text-xl text-gray-600 max-w-[480px] mx-auto">
                Collect, organize, and analyze feedback with real-time AI
                processing
              </p>
            </div>
          </motion.section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-border transition-shadow duration-300 bg-gray-50"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-gray-700" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-10 bg-gray-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Why Choose Feedback Hub?
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Instantly categorize and track customer feedback with AI-driven
                insights to make smarter product decisions.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="text-gray-500 shrink-0" size={20} />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
