import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { CheckCircle, AlertTriangle, Flame } from "lucide-react";

export default function Dashboard() {
  const { data: userProgress, isLoading } = useQuery({
    queryKey: ["/api/users/current/progress"],
  });

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900" data-testid="text-dashboard-title">
                    Your Learning Dashboard
                  </h2>
                  <p className="text-sm text-slate-500">Track your progress and continue your diving education</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Overall Progress</div>
                    <div className="text-lg font-semibold text-slate-900" data-testid="text-overall-progress">45%</div>
                  </div>
                  <div className="w-16 h-16 relative">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E7EB" strokeWidth="8"/>
                      <circle 
                        cx="32" cy="32" r="28" fill="none" stroke="#0066CC" strokeWidth="8" 
                        strokeDasharray="175.929" strokeDashoffset="96.76" strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold text-slate-700">45%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary-600 font-semibold">Lessons Completed</p>
                      <p className="text-3xl font-bold text-primary-900" data-testid="text-lessons-completed">8</p>
                      <p className="text-sm text-primary-700">of 12 total</p>
                    </div>
                    <div className="p-3 bg-primary-200 rounded-full">
                      <CheckCircle className="w-6 h-6 text-primary-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-ocean-50 to-ocean-100 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-ocean-600 font-semibold">Quiz Average</p>
                      <p className="text-3xl font-bold text-ocean-900" data-testid="text-quiz-average">87%</p>
                      <p className="text-sm text-ocean-700">across 5 quizzes</p>
                    </div>
                    <div className="p-3 bg-ocean-200 rounded-full">
                      <svg className="w-6 h-6 text-ocean-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 font-semibold">Study Streak</p>
                      <p className="text-3xl font-bold text-yellow-900" data-testid="text-study-streak">12</p>
                      <p className="text-sm text-yellow-700">days active</p>
                    </div>
                    <div className="p-3 bg-yellow-200 rounded-full">
                      <Flame className="w-6 h-6 text-yellow-700" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Progress */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Continue Learning</h3>
                <div className="bg-gradient-to-r from-primary-50 to-ocean-50 rounded-lg p-6 border border-primary-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-900" data-testid="text-current-track">Physiology Basics</h4>
                      <p className="text-sm text-slate-600">Next: Circulatory System</p>
                    </div>
                    <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors" data-testid="button-continue">
                      Continue
                    </button>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">3 of 5 lessons completed</p>
                </div>
              </div>

              {/* Recent Quiz Results */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Recent Quiz Results</h3>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm" data-testid="button-view-all">
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" data-testid="quiz-result-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Respiratory System Quiz</h4>
                        <p className="text-sm text-slate-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-green-600">90%</span>
                      <p className="text-sm text-slate-500">1st attempt</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" data-testid="quiz-result-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Gas Laws Fundamentals</h4>
                        <p className="text-sm text-slate-500">5 days ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-yellow-600">72%</span>
                      <p className="text-sm text-slate-500">2nd attempt</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" data-testid="quiz-result-3">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">Pressure Effects Quiz</h4>
                        <p className="text-sm text-slate-500">1 week ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-green-600">95%</span>
                      <p className="text-sm text-slate-500">1st attempt</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
