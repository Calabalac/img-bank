
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Search, 
  Share2, 
  BarChart3, 
  Smartphone, 
  Shield,
  Globe,
  Bot,
  Palette,
  Users,
  Settings,
  Cloud
} from 'lucide-react';

export const Roadmap = () => {
  const roadmapItems = [
    {
      category: "Performance & Infrastructure",
      items: [
        {
          title: "CDN Integration",
          description: "Implement global CDN for faster image delivery worldwide",
          priority: "High",
          progress: 20,
          icon: Globe,
          estimatedTime: "2-3 weeks"
        },
        {
          title: "Image Optimization",
          description: "Automatic image compression and format conversion (WebP, AVIF)",
          priority: "High", 
          progress: 10,
          icon: Zap,
          estimatedTime: "1-2 weeks"
        },
        {
          title: "Bulk Operations",
          description: "Batch upload, delete, and move operations for multiple images",
          priority: "Medium",
          progress: 30,
          icon: Settings,
          estimatedTime: "1 week"
        }
      ]
    },
    {
      category: "User Experience",
      items: [
        {
          title: "Advanced Search",
          description: "AI-powered image search with tags, colors, and content recognition",
          priority: "High",
          progress: 15,
          icon: Search,
          estimatedTime: "3-4 weeks"
        },
        {
          title: "Mobile App",
          description: "Native mobile applications for iOS and Android",
          priority: "Medium",
          progress: 5,
          icon: Smartphone,
          estimatedTime: "8-12 weeks"
        },
        {
          title: "Advanced Editor",
          description: "Built-in image editor with filters, cropping, and basic effects",
          priority: "Medium",
          progress: 25,
          icon: Palette,
          estimatedTime: "4-6 weeks"
        }
      ]
    },
    {
      category: "Collaboration & Sharing",
      items: [
        {
          title: "Team Workspaces",
          description: "Shared workspaces with role-based permissions and collaboration tools",
          priority: "High",
          progress: 40,
          icon: Users,
          estimatedTime: "2-3 weeks"
        },
        {
          title: "Public Galleries",
          description: "Create and share public image galleries with custom branding",
          priority: "Medium",
          progress: 60,
          icon: Share2,
          estimatedTime: "1-2 weeks"
        },
        {
          title: "API & Webhooks",
          description: "RESTful API and webhooks for third-party integrations",
          priority: "Medium",
          progress: 35,
          icon: Bot,
          estimatedTime: "3-4 weeks"
        }
      ]
    },
    {
      category: "Analytics & Insights",
      items: [
        {
          title: "Advanced Analytics",
          description: "Detailed usage analytics, popular images, and user behavior insights",
          priority: "Medium",
          progress: 50,
          icon: BarChart3,
          estimatedTime: "2-3 weeks"
        },
        {
          title: "Storage Analytics",
          description: "Storage usage tracking, duplicate detection, and optimization suggestions",
          priority: "Low",
          progress: 20,
          icon: Cloud,
          estimatedTime: "1-2 weeks"
        }
      ]
    },
    {
      category: "Security & Compliance",
      items: [
        {
          title: "Advanced Security",
          description: "Two-factor authentication, audit logs, and advanced access controls",
          priority: "High",
          progress: 30,
          icon: Shield,
          estimatedTime: "2-3 weeks"
        },
        {
          title: "GDPR Compliance",
          description: "Data export, deletion tools, and privacy compliance features",
          priority: "Medium",
          progress: 15,
          icon: Shield,
          estimatedTime: "3-4 weeks"
        }
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Development Roadmap</h2>
        <p className="text-muted-foreground">
          Planned features and improvements for ImageHost platform. Items are prioritized based on user feedback and business impact.
        </p>
      </div>

      {roadmapItems.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {category.category}
          </h3>
          
          <div className="grid gap-4">
            {category.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <Card key={itemIndex} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Roadmap Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {roadmapItems.flatMap(c => c.items).filter(i => i.priority === 'High').length}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {roadmapItems.flatMap(c => c.items).filter(i => i.priority === 'Medium').length}
              </div>
              <div className="text-sm text-muted-foreground">Medium Priority</div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {roadmapItems.flatMap(c => c.items).filter(i => i.priority === 'Low').length}
              </div>
              <div className="text-sm text-muted-foreground">Low Priority</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
