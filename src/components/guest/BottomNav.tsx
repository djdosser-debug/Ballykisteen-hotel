import React from 'react';
import { Home, BookOpen, Compass, Search, HelpCircle } from 'lucide-react';
import { useHotel, ActiveTab } from '../../context/HotelContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useHotel();

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'guide', label: 'Guidebook', icon: BookOpen },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'search', label: 'Search & FAQ', icon: Search },
  ];

  return (
    <nav 
      className="sticky bottom-0 left-0 right-0 z-30 bg-[#14382c]/95 backdrop-blur-md border-t border-white/10 text-white shadow-lg shrink-0"
      aria-label="Guest Guidebook Navigation"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                // Scroll top of the content container smoothly
                const container = document.getElementById('guidebook-scroll-container');
                if (container) {
                  container.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`min-h-[48px] flex flex-col items-center justify-center transition-colors relative ${
                isActive ? 'text-[#c5a059]' : 'text-white/65 hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c5a059]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 transition-all ${isActive ? 'font-semibold text-[#c5a059]' : 'font-medium text-white/70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
