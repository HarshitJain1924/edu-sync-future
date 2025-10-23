import { Button } from "@/components/ui/button";
import { Brain, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-hero rounded-lg shadow-medium group-hover:shadow-glow transition-all">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              EduSync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <div className="flex items-center gap-3 ml-4">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button variant="hero" onClick={() => navigate("/signup")}>
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <Link
              to="/"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="#features"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="#about"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" onClick={() => navigate("/login")} className="w-full">
                Login
              </Button>
              <Button variant="hero" onClick={() => navigate("/signup")} className="w-full">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
