declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }
  
  export const Send: FC<LucideProps>;
  export const Ban: FC<LucideProps>;
  export const Flag: FC<LucideProps>;
  export const HeartCrack: FC<LucideProps>;
  export const Heart: FC<LucideProps>;
  export const UserRound: FC<LucideProps>;
  export const Eye: FC<LucideProps>;
  export const MessageSquare: FC<LucideProps>;
  export const ThumbsUp: FC<LucideProps>;
  export const History: FC<LucideProps>;
  export const AlertTriangle: FC<LucideProps>;
  
  // Icônes manquantes
  export const LayoutDashboard: FC<LucideProps>;
  export const User: FC<LucideProps>;
  export const Bell: FC<LucideProps>;
  export const HeartIcon: FC<LucideProps>;
  export const Menu: FC<LucideProps>;
  export const X: FC<LucideProps>;
  export const CheckCircle: FC<LucideProps>;
  export const AlertCircle: FC<LucideProps>;
  export const Info: FC<LucideProps>;
  export const ChevronLeft: FC<LucideProps>;
  export const ChevronRight: FC<LucideProps>;
  export const XIcon: FC<LucideProps>;
  export const ArrowLeft: FC<LucideProps>;
  export const MapPin: FC<LucideProps>;
  export const SlidersHorizontal: FC<LucideProps>;
  export const Search: FC<LucideProps>;
  export const Mail: FC<LucideProps>;
  export const EyeOff: FC<LucideProps>;
  export const Lock: FC<LucideProps>;
  export const MessageCircle: FC<LucideProps>;
  export const Check: FC<LucideProps>;
  export const Edit3: FC<LucideProps>;
  export const Camera: FC<LucideProps>;
  export const Star: FC<LucideProps>;
  export const Plus: FC<LucideProps>;
  export const Minus: FC<LucideProps>;
  export const Key: FC<LucideProps>;
  export const UserCircle: FC<LucideProps>;
  export const Users: FC<LucideProps>;
  export const Loader2: FC<LucideProps>;
  export const Shield: FC<LucideProps>;
  export const Calendar: FC<LucideProps>;
  export const Upload: FC<LucideProps>;
  // Ajoutez d'autres icônes au besoin
}
