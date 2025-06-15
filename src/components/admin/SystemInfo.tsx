
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Globe, 
  Server, 
  HardDrive, 
  Users, 
  Image,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const SystemInfo = () => {
  // Mock data - in real app, fetch from API
  const systemStats = {
    storage: {
      used: 2.4, // GB
      total: 500, // GB (Supabase free tier limit)
      percentage: (2.4 / 500) * 100
    },
    users: {
      total: 156,
      active: 89,
      newThisMonth: 12
    },
    images: {
      total: 2847,
      uploadedToday: 23,
      publicImages: 1254
    },
    performance: {
      uptime: 99.9,
      avgResponseTime: 145, // ms
      lastDowntime: '2024-01-15'
    }
  };

  const supabaseInfo = {
    region: 'US East (Virginia)',
    version: 'PostgreSQL 15.1',
    plan: 'Free Tier',
    limits: {
      storage: '500 MB',
      bandwidth: '2 GB',
      dbSize: '500 MB',
      authUsers: 'Unlimited'
    }
  };

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Used Storage</span>
            <span className="font-bold">{systemStats.storage.used} GB / {systemStats.storage.total} GB</span>
          </div>
          <Progress value={systemStats.storage.percentage} className="h-3" />
          <div className="text-sm text-muted-foreground">
            {systemStats.storage.percentage.toFixed(1)}% of Supabase storage limit used
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.users.total}</div>
            <div className="text-sm text-muted-foreground">
              {systemStats.users.active} active, +{systemStats.users.newThisMonth} this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.images.total}</div>
            <div className="text-sm text-muted-foreground">
              +{systemStats.images.uploadedToday} today, {systemStats.images.publicImages} public
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.performance.uptime}%</div>
            <div className="text-sm text-muted-foreground">
              {systemStats.performance.avgResponseTime}ms avg response
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supabase Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Instance Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Region:</span>
                  <span>{supabaseInfo.region}</span>
                </div>
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span>{supabaseInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <Badge variant="secondary">{supabaseInfo.plan}</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Service Limits</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span>{supabaseInfo.limits.storage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bandwidth:</span>
                  <span>{supabaseInfo.limits.bandwidth}</span>
                </div>
                <div className="flex justify-between">
                  <span>Database Size:</span>
                  <span>{supabaseInfo.limits.dbSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auth Users:</span>
                  <span>{supabaseInfo.limits.authUsers}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Database: Online</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Storage: Available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Authentication: Active</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Storage Usage: Monitor</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">API: Responsive</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">CDN: Operational</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
