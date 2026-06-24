import React from 'react';
import { GraduationCap, CreditCard } from 'lucide-react';
import { useTheme } from '../App';

interface BrandingLogoProps {
  className?: string;
  showText?: boolean;
}

export default function BrandingLogo({ className = "h-10", showText = true }: BrandingLogoProps) {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* The "Bridge" / "Shield" / "Cap" SVG Hybrid for Scholars Help Desk */}
        <div className={`relative flex items-center justify-center p-2 rounded-none border-2 ${theme === 'dark' ? 'bg-black border-accent' : 'bg-white border-wholesome-primary'}`}>
          <div className="flex items-baseline gap-0.5 font-serif font-black text-xl tracking-tighter">
            <span className="relative">
              S
              <GraduationCap className={`absolute -top-3 -left-1 w-3 h-3 -rotate-12 ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`} />
            </span>
            <span>H</span>
            <span className="relative text-accent">
              D
              <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 opacity-40" />
            </span>
          </div>
          {/* Bridge Decorative Line */}
          <div className={`absolute -bottom-1 left-0 w-full h-[3px] scale-x-110 ${theme === 'dark' ? 'bg-accent' : 'bg-wholesome-primary'}`} />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`text-[12px] font-serif font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-text-main' : 'text-black'}`}>Scholars Help Desk</span>
          <span className={`text-[8px] font-black uppercase tracking-[3px] ${theme === 'dark' ? 'text-accent' : 'text-wholesome-primary'}`}>Registry Portal</span>
        </div>
      )}
    </div>
  );
}
