
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Link, Zap, Shield, Globe, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import FileUploader from '@/components/upload/FileUploader';
import UrlUploader from '@/components/upload/UrlUploader';

const UploadPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized algorithms for instant file processing"
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your files are protected with enterprise-grade encryption"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Get shareable links immediately after upload"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                Authenticated Upload
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Upload Center
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              Upload images from your device or import via direct URL. 
              Fast, secure, professional.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-slate-900 dark:text-slate-100">
                Choose Upload Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="file" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-6">
                  <TabsTrigger 
                    value="file" 
                    className="py-3 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all flex items-center justify-center gap-2"
                  >
                    <UploadCloud className="w-5 h-5" />
                    From Device
                  </TabsTrigger>
                  <TabsTrigger 
                    value="url" 
                    className="py-3 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all flex items-center justify-center gap-2"
                  >
                    <Link className="w-5 h-5" />
                    From URL
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="file" className="mt-6">
                  <FileUploader />
                </TabsContent>
                
                <TabsContent value="url" className="mt-6">
                  <UrlUploader />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Supported formats: JPG, PNG, GIF, WebP, SVG • Maximum size: 50MB
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
