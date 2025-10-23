import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, Video, BarChart3, MessageSquare, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Assistance",
    description: "Get instant help with AI tutors that explain concepts, generate quizzes, and summarize notes.",
    gradient: "from-primary to-primary/70",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description: "Study together with classmates in virtual rooms with shared whiteboards and chat.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Video,
    title: "Live Sessions",
    description: "Join video classes with teachers, record sessions, and review anytime.",
    gradient: "from-accent to-secondary",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your progress with detailed insights and personalized learning recommendations.",
    gradient: "from-primary to-accent",
  },
  {
    icon: MessageSquare,
    title: "Smart Chat",
    description: "Ask questions and get instant answers from AI or connect with peers and teachers.",
    gradient: "from-secondary to-primary",
  },
  {
    icon: Zap,
    title: "Quick Tools",
    description: "Access flashcards, mind maps, and study planners - all powered by AI.",
    gradient: "from-accent to-primary",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Excel
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed to make learning collaborative, engaging, and effective.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-hard transition-all duration-300 border-border/50 hover:border-accent/50"
            >
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-medium group-hover:shadow-glow transition-all`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
