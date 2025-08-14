import { Heart, Github, Twitter, Linkedin, Mail, Eye } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Demo", href: "/calibration" }
    ],
    support: [
      { name: "Documentation", href: "https://github.com/akshad-exe/Blink-Speech/blob/main/docs/README.md" },
      { name: "Help Center", href: "#help" },
      { name: "Contact Us", href: "#contact" },
      { name: "Troubleshooting", href: "#troubleshooting" }
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" }
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "Accessibility", href: "#accessibility" }
    ]
  };

  const socialLinks = [
    { name: "GitHub", icon: <Github className="w-5 h-5" />, href: "https://github.com/atharhive/Blink-Speech" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, href: "#" },
    { name: "Email", icon: <Mail className="w-5 h-5" />, href: "mailto:contact@blinkspeech.com" }
  ];

  return (
    <footer className="bg-foreground text-foreground">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-white">Blink Speech</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Transforming eye movements into spoken words. Making communication accessible to everyone, 
              everywhere. Privacy-first, open-source, and designed for real-world impact.
            </p>
            


            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>



        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 Blink Speech. All rights reserved.</span>
              <span>•</span>
              <span>Made with <Heart className="w-4 h-4 inline text-red-400" /> for accessibility</span>
            </div>
            
            <div className="flex gap-6 text-sm">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 