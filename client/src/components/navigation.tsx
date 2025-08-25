import { Link, useLocation } from "wouter";
import { LayoutDashboard, BookOpen, BarChart3 } from "lucide-react";
import diverWellLogo from "@assets/DIVER_WELL_TRAINING-500x500-rbg-preview_1756088331820.png";
import UserProfileDropdown from "@/components/user-profile-dropdown";
import DualAIAssistant from "@/components/dual-ai-assistant";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" data-testid="link-home">
              <a className="flex items-center space-x-3">
                <img 
                  src={diverWellLogo} 
                  alt="Professional Diver - Diver Well Training" 
                  className="w-10 h-10 rounded-lg"
                />
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Professional Diver</h1>
                  <p className="text-xs text-slate-500">Diver Well Training</p>
                </div>
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
              <Link href="/markdown-editor" data-testid="link-markdown-editor">
                <a className={`font-medium transition-colors ${
                  location === "/markdown-editor" 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                  Editor
                </a>
              </Link>
              <Link href="/learning-path" data-testid="link-learning-path">
                <a className={`font-medium transition-colors ${
                  location === "/learning-path" 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                  AI Learning Path
                </a>
              </Link>
              <Link href="/operations" data-testid="link-operations">
                <a className={`font-medium transition-colors ${
                  location === "/operations" 
                    ? "text-slate-900" 
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                  Operations
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DualAIAssistant />
            <button 
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              data-testid="button-notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5V7a4 4 0 11-8 0V17"/>
              </svg>
            </button>
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
