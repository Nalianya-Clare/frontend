import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Target, Users, Trophy, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/cyber-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary text-xs font-mono animate-matrix-rain"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          >
            {Array.from({ length: 50 }, (_, j) => (
              <div key={j} className="block">
                {String.fromCharCode(33 + Math.random() * 94)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-primary">
                <Shield className="h-4 w-4" />
                <span>Next-Gen Cybersecurity Training</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Master
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Cybersecurity
                </span>
                Through Gamified Learning
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl">
                Join thousands of security professionals in hands-on challenges. 
                Learn phishing detection, OSINT techniques, and network security 
                through interactive Kahoot-style competitions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="xl" variant="cyber" className="group">
                <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Start Challenge
              </Button>
              <Button size="xl" variant="neon">
                <Trophy className="mr-2 h-5 w-5" />
                View Leaderboard
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1M+</div>
                <div className="text-sm text-muted-foreground">Challenges Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-6">
            <Card className="p-6 hover:shadow-glow-primary transition-all duration-300 border-primary/20">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Interactive Challenges</h3>
                    <p className="text-muted-foreground">
                      Real-world scenarios in phishing, social engineering, and threat detection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-glow-secondary transition-all duration-300 border-secondary/20">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-secondary/10">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Team Competitions</h3>
                    <p className="text-muted-foreground">
                      Compete with colleagues and friends in real-time security challenges.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-glow-accent transition-all duration-300 border-accent/20">
              <CardContent className="p-0">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Adaptive Learning</h3>
                    <p className="text-muted-foreground">
                      Personalized difficulty progression based on your performance and goals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;