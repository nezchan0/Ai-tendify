import React from 'react';


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'indigo' | 'green' | 'amber' | 'red' | 'blue' | 'purple';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-500',
      hover: 'group-hover:bg-indigo-500 group-hover:text-white'
    },
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-500',
      hover: 'group-hover:bg-green-500 group-hover:text-white'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-500',
      hover: 'group-hover:bg-amber-500 group-hover:text-white'
    },
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-500',
      hover: 'group-hover:bg-red-500 group-hover:text-white'
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-500',
      hover: 'group-hover:bg-blue-500 group-hover:text-white'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-500',
      hover: 'group-hover:bg-purple-500 group-hover:text-white'
    }
  };

  return (
    <div className="group bg-[#1A1A1A] border border-white/5 rounded-xl p-6 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10">
      <div className={`${colorClasses[color].bg} ${colorClasses[color].border} w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300 ${colorClasses[color].hover}`}>
        <div className={`${colorClasses[color].text} group-hover:text-white transition-colors duration-300`}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default FeatureCard;