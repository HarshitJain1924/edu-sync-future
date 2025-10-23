import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-hero rounded-lg shadow-medium">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">EduSync</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered collaborative learning platform connecting students and teachers worldwide.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Demo</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 EduSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
