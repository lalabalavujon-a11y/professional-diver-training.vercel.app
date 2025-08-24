import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-ocean-50 rounded-2xl p-8 mb-8">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-2/3 mb-6 lg:mb-0">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Professional Diving Education Platform
          </h2>
          <p className="text-lg text-slate-600 mb-6 max-w-2xl">
            Master diving physiology, decompression theory, and advanced techniques through comprehensive tracks designed by industry experts.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold"
              data-testid="button-start-learning"
            >
              Start Learning
            </Button>
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                className="border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-lg font-semibold"
                data-testid="button-view-progress"
              >
                View Progress
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/3">
          <img 
            src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
            alt="Professional diver underwater" 
            className="rounded-xl shadow-lg w-full h-auto"
            data-testid="img-hero"
          />
        </div>
      </div>
    </section>
  );
}
