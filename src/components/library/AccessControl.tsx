
import { Lock, Unlock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AccessControlProps {
  accessType: 'public' | 'private' | 'shared';
  onAccessChange: (accessType: 'public' | 'private' | 'shared') => void;
  size?: 'sm' | 'default';
}

export const AccessControl = ({ accessType, onAccessChange, size = 'default' }: AccessControlProps) => {
  const getIcon = () => {
    switch (accessType) {
      case 'public':
        return <Unlock className={size === 'sm' ? "h-3 w-3" : "h-4 w-4"} />;
      case 'shared':
        return <Users className={size === 'sm' ? "h-3 w-3" : "h-4 w-4"} />;
      default:
        return <Lock className={size === 'sm' ? "h-3 w-3" : "h-4 w-4"} />;
    }
  };

  const getLabel = () => {
    switch (accessType) {
      case 'public':
        return 'Публичный';
      case 'shared':
        return 'Для друзей';
      default:
        return 'Приватный';
    }
  };

  if (size === 'sm') {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          const next = accessType === 'private' ? 'public' : accessType === 'public' ? 'shared' : 'private';
          onAccessChange(next);
        }}
        className="h-6 w-6 p-0 backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
        title={getLabel()}
      >
        {getIcon()}
      </Button>
    );
  }

  return (
    <Select value={accessType} onValueChange={onAccessChange}>
      <SelectTrigger className="w-32 h-8 bg-white/5 border-white/20 text-white text-xs">
        <div className="flex items-center gap-1">
          {getIcon()}
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="private">
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3" />
            Приватный
          </div>
        </SelectItem>
        <SelectItem value="public">
          <div className="flex items-center gap-2">
            <Unlock className="h-3 w-3" />
            Публичный
          </div>
        </SelectItem>
        <SelectItem value="shared">
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3" />
            Для друзей
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
