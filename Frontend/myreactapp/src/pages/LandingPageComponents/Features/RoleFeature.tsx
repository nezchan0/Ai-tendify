import React from 'react';
import { Check } from 'lucide-react';

interface RoleFeatureProps {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'purple';
}

const RoleFeature: React.FC<RoleFeatureProps> = ({ title, description, features, icon, color }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-950/30',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/10',
      checkBg: 'bg-blue-500/10',
      checkText: 'text-blue-500'
    },
    green: {
      bg: 'bg-green-950/30',
      border: 'border-green-500/20',
      iconBg: 'bg-green-500/10',
      checkBg: 'bg-green-500/10',
      checkText: 'text-green-500'
    },
    amber: {
      bg: 'bg-amber-950/30',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/10',
      checkBg: 'bg-amber-500/10',
      checkText: 'text-amber-500'
    },
    purple: {
      bg: 'bg-purple-950/30',
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-500/10',
      checkBg: 'bg-purple-500/10',
      checkText: 'text-purple-500'
    }
  };

  return (
    <div className={`${colorClasses[color].bg} rounded-xl p-6 border ${colorClasses[color].border}`}>
      <div className="flex items-start mb-4">
        <div className={`${colorClasses[color].iconBg} p-3 rounded-lg mr-4 shrink-0`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
      
      <ul className="space-y-3 mt-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <div className={`${colorClasses[color].checkBg} p-1 rounded-full mr-3`}>
              <Check className={`h-4 w-4 ${colorClasses[color].checkText}`} />
            </div>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoleFeature;