
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Camera, 
  Shield, 
  Users, 
  Zap, 
  Globe,
  Database,
  Code,
  Smartphone,
  Cloud,
  Lock,
  Gauge
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      name: "Authentication System",
      description: "Secure user registration and login with email verification",
      progress: 100,
      status: "completed"
    },
    {
      name: "Image Upload & Storage",
      description: "Direct file upload and URL import with cloud storage",
      progress: 100,
      status: "completed"
    },
    {
      name: "Public Gallery",
      description: "Browse and download images without registration",
      progress: 100,
      status: "completed"
    },
    {
      name: "User Library",
      description: "Personal image management with folder organization",
      progress: 95,
      status: "completed"
    },
    {
      name: "Admin Panel",
      description: "User management and system administration",
      progress: 90,
      status: "completed"
    },
    {
      name: "Dark/Light Theme",
      description: "Responsive theme switching for better UX",
      progress: 100,
      status: "completed"
    },
    {
      name: "Analytics Dashboard",
      description: "Usage statistics and performance metrics",
      progress: 75,
      status: "in-progress"
    },
    {
      name: "API Integration",
      description: "RESTful API for third-party integrations",
      progress: 40,
      status: "planned"
    },
    {
      name: "CDN Integration",
      description: "Global content delivery network for faster access",
      progress: 30,
      status: "planned"
    },
    {
      name: "Advanced Search",
      description: "AI-powered image search and tagging",
      progress: 20,
      status: "planned"
    }
  ];

  const overallProgress = Math.round(features.reduce((sum, feature) => sum + feature.progress, 0) / features.length);

  const techStack = [
    { name: "React 18", category: "Frontend", icon: Code },
    { name: "TypeScript", category: "Language", icon: Code },
    { name: "Tailwind CSS", category: "Styling", icon: Smartphone },
    { name: "Supabase", category: "Backend", icon: Database },
    { name: "Vite", category: "Build Tool", icon: Zap },
    { name: "Shadcn/UI", category: "Components", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <Badge className="mb-6 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            <Camera className="w-4 h-4 mr-2" />
            About ImageHost
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Professional Image Hosting Platform
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl">
            ImageHost is a modern, enterprise-grade image hosting solution designed for teams 
            and organizations that need reliable, scalable image management.
          </p>
        </div>

        {/* Project Overview */}
        <Card className="mb-12 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Development Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Overall Project Completion</span>
                <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Platform Description */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Mission</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  To provide a reliable, secure, and scalable image hosting solution that 
                  empowers teams to manage their visual assets efficiently.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Instant image uploads with drag & drop</li>
                  <li>• URL-based image importing</li>
                  <li>• Folder-based organization system</li>
                  <li>• Public sharing capabilities</li>
                  <li>• Admin dashboard for user management</li>
                  <li>• Real-time analytics and monitoring</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                Security & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold">Global CDN</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Worldwide delivery</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Lock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold">SSL Encryption</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">End-to-end security</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Gauge className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold">99.9% Uptime</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Reliable service</div>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <Cloud className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="font-semibold">Auto Scaling</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Handle any load</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <Card className="mb-12 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {techStack.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium">{tech.name}</div>
                      <div className="text-sm text-slate-500">{tech.category}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Feature Status */}
        <Card className="mb-12 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Feature Development Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">{feature.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        feature.status === 'completed' ? 'default' :
                        feature.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {feature.progress}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={feature.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => navigate('/auth')} size="lg" className="bg-blue-600 hover:bg-blue-700">
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
