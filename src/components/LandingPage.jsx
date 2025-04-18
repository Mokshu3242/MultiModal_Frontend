import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-indigo-800 flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="text-white text-2xl font-bold flex items-center gap-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          MultiGPT
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button 
              variant="outline" 
              className="text-white border-white bg-transparent hover:bg-white/20 hover:text-white px-6 py-2 transition-colors"
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-2 transition-colors">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your <span className="text-indigo-200">All-in-One</span> AI Assistant
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            MultiGPT revolutionizes how you work with AI - processing text, documents, media, and more across multiple languages with enterprise-grade security.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-4 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition-all">
                Get Started Free
              </Button>
            </Link>
            <Link to="/demo">
              <Button 
                variant="outline" 
                className="text-white border-white bg-transparent hover:bg-white/20 hover:text-white px-8 py-4 text-lg font-medium rounded-lg transition-all"
              >
                Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Enterprise-Grade AI Features</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Comprehensive AI solutions for individuals and businesses
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Multi-Language AI",
                description: "Native support for English, Hindi, Marathi with real-time translation",
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                )
              },
              {
                title: "Secure Self-Hosted OTP",
                description: "Private OTP service with your own SMTP for maximum security",
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              },
              {
                title: "YouTube Intelligence",
                description: "Analyze transcripts, summarize videos, and extract key insights",
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Advanced Image Processing",
                description: "Object detection, OCR, description generation, and analysis",
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Audio Intelligence",
                description: "Transcription, voice cloning, sentiment analysis, and more",
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )
              },
              {
                title: "Document Processing",
                description: "PDF, Word, Excel analysis with semantic search and Q&A",
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group border border-gray-100"
              >
                <div className="text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Features Section */}
      <div className="py-20 px-4 bg-gray-50 bg-blue-400 text-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Specialized Capabilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Structured Data Processing</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-1 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Table extraction and analysis from documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-1 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>CSV/Excel data visualization and insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-1 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Automatic chart generation from tabular data</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 ">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-900 uppercase tracking-wider">Feature</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white-900 uppercase tracking-wider">Supported</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { feature: 'PDF Table Extraction', supported: '✓' },
                      { feature: 'Excel Analysis', supported: '✓' },
                      { feature: 'CSV Processing', supported: '✓' },
                      { feature: 'Data Visualization', supported: '✓' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{row.feature}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">{row.supported}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-20 ">
            <div className="order-2 md:order-1">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">1:1 Communication</h4>
                    <p className="text-gray-500">Private, secure messaging</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-sm">AI</span>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg max-w-xs">
                      <p className="text-sm text-gray-800">How can I assist you today?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                      <p className="text-sm text-gray-800">Can you summarize this document?</p>
                    </div>
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm">U</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Secure 1:1 Communication</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-1 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>End-to-end encrypted conversations</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-1 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Document sharing with AI analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-1 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Conversation history with search</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 justify-center text-center">
          © {new Date().getFullYear()} MultiGPT. All rights reserved.
      </footer>
    </div>
  );
}