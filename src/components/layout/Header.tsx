
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { Camera, Menu, X } from 'lucide-react';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Camera className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">ImageHub</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/gallery')}
          >
            Галерея
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/about')}
          >
            О проекте
          </Button>
          {user && (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/library')}
            >
              Библиотека
            </Button>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
              >
                Выйти
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              size="sm"
            >
              Войти
            </Button>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Button 
              variant="ghost" 
              className="justify-start"
              onClick={() => {
                navigate('/gallery');
                setIsMenuOpen(false);
              }}
            >
              Галерея
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start"
              onClick={() => {
                navigate('/about');
                setIsMenuOpen(false);
              }}
            >
              О проекте
            </Button>
            {user && (
              <Button 
                variant="ghost" 
                className="justify-start"
                onClick={() => {
                  navigate('/library');
                  setIsMenuOpen(false);
                }}
              >
                Библиотека
              </Button>
            )}
            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground px-3">
                  {user.email}
                </span>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Выйти
                </Button>
              </div>
            ) : (
              <Button 
                className="justify-start"
                onClick={() => {
                  navigate('/auth');
                  setIsMenuOpen(false);
                }}
              >
                Войти
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
