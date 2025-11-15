import { Icons } from '@/components/icons';
import { User } from '@/contexts/AppProvider';

interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
  permission: string;
}

const navItems: NavItem[] = [];


interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: User | null;
}

export { navItems };
export type { NavItem, UserAvatarProfileProps };
