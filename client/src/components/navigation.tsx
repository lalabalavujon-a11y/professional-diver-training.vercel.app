import { Link, useLocation } from "wouter";
import { LayoutDashboard, BookOpen, BarChart3 } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" data-testid="link-home">
              <a className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">Diver Well Training</h1>
              </a>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/" data-testid="link-tracks">
                <a className={`font-medium transition-colors ${
                  location === "/" 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                  Tracks
                </a>
              </Link>
              <Link href="/dashboard" data-testid="link-dashboard">
                <a className={`font-medium transition-colors ${
                  location === "/dashboard" 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                  Dashboard
                </a>
              </Link>
              <Link href="/crm" data-testid="link-crm">
                <a className={`font-medium transition-colors ${
                  location === "/crm" 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                  CRM
                </a>
              </Link>
              <Link href="/analytics" data-testid="link-analytics">
                <a className={`font-medium transition-colors ${
                  location === "/analytics" 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                  Analytics
                </a>
              </Link>
              <Link href="/admin" data-testid="link-admin">
                <a className={`font-medium transition-colors ${
                  location.startsWith("/admin") 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                  Admin
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.open('https://chatgpt.com/g/g-6897d42d3ba48191b48883a4839c09bf-diver-well-commercial-diver-ai-consultant', '_blank')}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              data-testid="button-ai-consultant"
              title="Diver Well AI Consultant"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              <span className="hidden md:inline text-sm font-medium">AI Consultant</span>
            </button>
            <button 
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              data-testid="button-notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5V7a4 4 0 11-8 0V17"/>
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium text-sm">JD</span>
              </div>
              <span className="text-sm font-medium text-slate-700">John Diver</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
