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
  // Ajoutez d'autres icônes au besoin
}
