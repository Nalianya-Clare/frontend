import { useState } from "react";
import NavHeader from "@/components/NavHeader";
import HeroSection from "@/components/HeroSection";
import QuizInterface from "@/components/QuizInterface";
import Leaderboard from "@/components/Leaderboard";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState("home");

  const renderContent = () => {
    switch (currentView) {
      case "quiz":
        return (
          <div className="container mx-auto px-6 py-8">
            <QuizInterface />
          </div>
        );
      case "leaderboard":
        return (
          <div className="container mx-auto px-6 py-8">
            <Leaderboard />
          </div>
        );
      case "admin":
        return (
          <div className="container mx-auto px-6 py-8">
            <AdminDashboard />
          </div>
        );
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      {renderContent()}
      
      {/* Demo Navigation */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2 z-50">
        <button
          onClick={() => setCurrentView("home")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentView === "home" 
              ? "bg-primary text-primary-foreground" 
              : "bg-card text-card-foreground hover:bg-primary/20"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setCurrentView("quiz")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentView === "quiz" 
              ? "bg-primary text-primary-foreground" 
              : "bg-card text-card-foreground hover:bg-primary/20"
          }`}
        >
          Quiz
        </button>
        <button
          onClick={() => setCurrentView("leaderboard")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentView === "leaderboard" 
              ? "bg-primary text-primary-foreground" 
              : "bg-card text-card-foreground hover:bg-primary/20"
          }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setCurrentView("admin")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentView === "admin" 
              ? "bg-primary text-primary-foreground" 
              : "bg-card text-card-foreground hover:bg-primary/20"
          }`}
        >
          Admin
        </button>
      </div>
    </div>
  );
};

export default Index;
