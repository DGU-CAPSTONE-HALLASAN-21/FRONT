import { motion } from 'motion/react';
import { BarChart3, FileText, TrendingUp, DollarSign } from 'lucide-react';

interface FilterChipsProps {
  activeFilters: string[];
  onToggleFilter: (filterId: string) => void;
}

export function FilterChips({ activeFilters, onToggleFilter }: FilterChipsProps) {
  const filters = [
    { id: 'analyze', label: '인재 추천', icon: BarChart3, color: '#a855f7' },
    { id: 'report', label: '사내 프로그램 관리', icon: FileText, color: '#06b6d4' },
    { id: 'visualize', label: '복리후생 관리', icon: TrendingUp, color: '#ec4899' },
    { id: 'export', label: '급여 계산', icon: DollarSign, color: '#10b981' },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter, index) => {
        const Icon = filter.icon;
        const isActive = activeFilters.includes(filter.id);
        
        return (
          <motion.button
            key={filter.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            onClick={() => onToggleFilter(filter.id)}
            className={`
              px-3 py-1.5 rounded-full flex items-center gap-2
              transition-all duration-300 text-xs
              ${isActive ? 'shadow-lg' : 'shadow-sm'}
            `}
            style={{
              background: isActive 
                ? filter.color
                : 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isActive ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.6)'}`,
              boxShadow: isActive 
                ? `0 4px 16px 0 ${filter.color}40` 
                : '0 2px 8px 0 rgba(31, 38, 135, 0.08)',
            }}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
            <span className={`${isActive ? 'text-white' : 'text-gray-700'}`}>
              {filter.label}
            </span>
            
            {/* Active Indicator */}
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-1.5 h-1.5 rounded-full bg-white"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
