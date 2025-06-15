
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Server, 
  Globe, 
  Database, 
  Settings, 
  Copy,
  AlertTriangle,
  CheckCircle,
  Code
} from 'lucide-react';

export const MigrationGuide = () => {
  const migrationSteps = [
    {
      title: "1. Export Current Data",
      icon: Database,
      description: "Backup your current database and storage",
      steps: [
        "Export Supabase data using pg_dump",
        "Download all stored images from storage buckets",
        "Export user authentication data",
        "Save environment variables and configuration"
      ]
    },
    {
      title: "2. Set Up New Hosting",
      icon: Server,
      description: "Configure your new hosting environment",
      steps: [
        "Create new Supabase project",
        "Set up hosting provider (Vercel, Netlify, etc.)",
        "Configure custom domain DNS settings",
        "Set up SSL certificates"
      ]
    },
    {
      title: "3. Configure Supabase",
      icon: Settings,
      description: "Update Supabase settings for new domain",
      steps: [
        "Update Site URL in Authentication settings",
        "Add redirect URLs for your new domain",
        "Configure CORS settings",
        "Update RLS policies if needed"
      ]
    },
    {
      title: "4. Deploy Application",
      icon: Globe,
      description: "Deploy and test your application",
      steps: [
        "Update environment variables with new URLs",
        "Deploy application to new hosting",
        "Test authentication flows",
        "Verify image upload and storage functionality"
      ]
    }
  ];

  const envVariables = {
    "VITE_SUPABASE_URL": "https://your-project-ref.supabase.co",
    "VITE_SUPABASE_ANON_KEY": "your-anon-key-here"
  };

  const supabaseSettings = [
    {
      setting: "Site URL",
      value: "https://yourdomain.com",
      location: "Authentication > Settings"
    },
    {
      setting: "Redirect URLs",
      value: "https://yourdomain.com/**",
      location: "Authentication > URL Configuration"
    },
    {
      setting: "CORS Origins",
      value: "https://yourdomain.com",
      location: "API > CORS"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Migration & Deployment Guide</h2>
        <p className="text-muted-foreground">
          Complete guide for migrating your ImageHost installation to a new domain or hosting provider.
        </p>
      </div>

      {/* Warning Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Always create backups before starting migration. Test the migration in a staging environment first.
        </AlertDescription>
      </Alert>

      {/* Migration Steps */}
      {migrationSteps.map((step, index) => {
        const Icon = step.icon;
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                {step.title}
              </CardTitle>
              <p className="text-muted-foreground">{step.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {step.steps.map((stepItem, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{stepItem}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Environment Variables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Update these environment variables in your hosting provider:
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 space-y-2">
            {Object.entries(envVariables).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <code className="text-sm">{key}</code>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-muted-foreground">{value}</code>
                  <Copy className="h-3 w-3 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supabase Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Update these settings in your Supabase dashboard:
            </p>
            <div className="space-y-3">
              {supabaseSettings.map((setting, index) => (
                <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{setting.setting}</div>
                      <div className="text-sm text-muted-foreground">{setting.location}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {setting.value}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Post-Migration Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Test user registration and login</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Verify image upload functionality</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Check folder creation and management</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Test public image sharing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Verify admin panel functionality</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Test email notifications</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
