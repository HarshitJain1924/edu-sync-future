import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-learning.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />
      
      {/* Animated circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full shadow-soft">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">AI-Powered Learning Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Learn Together.{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Smarter.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Connect with students and teachers in real-time. Collaborate seamlessly with AI-powered 
              tools that make learning more engaging and effective.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => navigate("/signup")}
                className="group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/dashboard")}
              >
                Explore Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Expert Teachers</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-hard">
              <img 
                src={heroImage} 
                alt="AI-Powered Collaborative Learning" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent rounded-2xl shadow-glow animate-bounce" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-2xl shadow-glow animate-bounce delay-300" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
