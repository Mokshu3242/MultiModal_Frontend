import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Github, Linkedin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-5 md:px-8 md:py-6 max-w-7xl mx-auto w-full">
        <div className="text-white text-2xl font-bold flex items-center gap-3">
          <svg
            className="w-8 h-8 text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            MultiGPT
          </span>
        </div>
        <div className="flex gap-3 md:gap-4">
          <Link to="/login">
            <Button
              variant="outline"
              className="text-gray-300 border-gray-600 hover:border-gray-500 bg-gray-800 hover:bg-gray-700 hover:text-white px-4 py-2 md:px-5 md:py-2 transition-all"
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-2 md:px-6 md:py-2 transition-all shadow-lg hover:shadow-indigo-500/20">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              All-in-One
            </span>{" "}
            AI Assistant
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            MultiGPT revolutionizes how you work with AI - processing text,
            documents, media, and more across multiple languages with
            enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-4 md:px-10 md:py-4 text-base md:text-lg font-medium rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="/demo" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="text-gray-300 border-gray-600 hover:border-gray-500 bg-gray-800 hover:bg-gray-700 hover:text-white px-8 py-4 md:px-10 md:py-4 text-base md:text-lg font-medium rounded-lg transition-all w-full sm:w-auto"
              >
                Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 px-6 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Enterprise-Grade AI Features
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Comprehensive AI solutions for individuals and businesses
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Multi-Language AI",
                description:
                  "Native support for English, Hindi, Marathi with real-time translation",
                icon: (
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                ),
              },
              {
                title: "Secure Self-Hosted OTP",
                description:
                  "Private OTP service with your own SMTP for maximum security",
                icon: (
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
              },
              {
                title: "YouTube Intelligence",
                description:
                  "Analyze transcripts, summarize videos, and extract key insights",
                icon: (
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                ),
              },
              {
                title: "Advanced Image Processing",
                description:
                  "Object detection, OCR, description generation, and analysis",
                icon: (
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                ),
              },
              {
                title: "Audio Intelligence",
                description:
                  "Transcription, voice cloning, sentiment analysis, and more",
                icon: (
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                ),
              },
              {
                title: "Document Processing",
                description:
                  "PDF, Word, Excel analysis with semantic search and Q&A",
                icon: (
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-850 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-700 hover:border-indigo-500/50"
              >
                <div className="text-indigo-400 mb-5 group-hover:scale-110 transition-transform inline-flex p-3 rounded-lg bg-gray-800">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto space-y-20 md:space-y-24">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Specialized Capabilities
            </h2>
            <p className="text-lg text-gray-400">
              Advanced tools for professional workflows
            </p>
          </div>

          {/* Structured Data Processing Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Description */}
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-white">
                Structured Data Processing
              </h3>
              <ul className="space-y-4 text-gray-400">
                {[
                  "Table extraction and analysis from documents",
                  "CSV/Excel data visualization and insights",
                  "Automatic chart generation from tabular data",
                  "Data cleaning and transformation tools",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-indigo-400 mt-1">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature Table */}
            <div className="bg-gray-850  border-gray-700 rounded-xl shadow-lg overflow-hidden w-full">
              <table className="min-w-full text-left text-sm divide-y divide-gray-700">
                <thead className="bg-gray-800 text-indigo-300 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-white">Feature</th>
                    <th className="px-6 py-4 text-right text-white">
                      Supported
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {[
                    { feature: "PDF Table Extraction", supported: "✓" },
                    { feature: "Excel Analysis", supported: "✓" },
                    { feature: "CSV Processing", supported: "✓" },
                    { feature: "Data Visualization", supported: "✓" },
                    { feature: "API Integration", supported: "✓" },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="text-gray-300 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">{row.feature}</td>
                      <td className="px-6 py-4 text-right text-indigo-400 font-bold">
                        {row.supported}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 1:1 Communication Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Chat Card */}
            <div className="bg-gray-850 text-gray-200 p-6 rounded-xl shadow-xl space-y-4 border border-gray-700">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center bg-indigo-500/10 rounded-full">
                  <svg
                    className="w-6 h-6 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    1:1 Communication
                  </h4>
                  <p className="text-sm text-gray-500">
                    Private, secure messaging
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    AI
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg max-w-xs">
                    <p className="text-sm">How can I assist you today?</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-indigo-500/10 p-3 rounded-lg max-w-xs">
                    <p className="text-sm">Can you summarize this document?</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    U
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6 order-first md:order-last">
              <h3 className="text-2xl md:text-3xl font-semibold text-white">
                Secure 1:1 Communication
              </h3>
              <ul className="space-y-4 text-gray-400">
                {[
                  "End-to-end encrypted conversations",
                  "Document sharing with AI analysis",
                  "Conversation history with search",
                  "Multi-device synchronization",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-indigo-400 mt-1">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Branding and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xl font-bold text-white">MultiGPT</span>
            </div>
            <p className="text-sm max-w-md">
              The most powerful AI platform for professionals and businesses.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex md:justify-end items-center gap-6">
            <a
              href="https://github.com/Mokshu3242"
              target="_blank"
              aria-label="GitHub"
              className="hover:text-indigo-400 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/mokshad-sankhe-b26b00291/"
              target="_blank"
              aria-label="LinkedIn"
              className="hover:text-indigo-400 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-gray-800 text-sm text-center">
          <p>© {new Date().getFullYear()} MultiGPT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
