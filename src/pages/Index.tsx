
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Upload, 
  Shield, 
  Zap, 
  Globe, 
  Users,
  ArrowRight,
  CheckCircle,
  Database,
  Gauge,
  Cloud
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Upload,
      title: "Instant Upload",
      description: "Upload images from your device or import via direct URL in seconds"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Your files are protected with modern encryption standards"
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Share images worldwide with lightning-fast delivery"
    },
    {
      icon: Database,
      title: "Smart Organization",
      description: "Organize your images with folders and intelligent tagging"
    }
  ];

  const stats = [
    { label: "Images Hosted", value: "1M+", icon: Upload },
    { label: "Active Users", value: "25K+", icon: Users },
    { label: "Uptime", value: "99.9%", icon: Gauge },
    { label: "Storage Used", value: "500GB", icon: Cloud }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-8 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-sm px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Professional Image Hosting Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-slate-100 mb-8 leading-tight tracking-tight">
              Host, organize, and{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                share images
              </span>{" "}
              at scale
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade image hosting with instant uploads, global CDN delivery, 
              and powerful organization tools. Built for teams that demand reliability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/auth">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/about">
                <Button variant="outline" size="lg" className="border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-4 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                99.9% Uptime SLA
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Enterprise Security
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Global CDN
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
              Built for modern teams
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Everything you need to manage, organize, and share images professionally
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-200 group">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Ready to get started?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                Join thousands of teams who trust ImageHost with their critical image assets
              </p>
              
              <Link to="/auth">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-lg">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
                No credit card required • Full features for 14 days
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
