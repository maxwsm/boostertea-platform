const TeaLoader = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-12 h-16',
    md: 'w-16 h-20',
    lg: 'w-24 h-32'
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Cup body */}
      <div className="absolute bottom-0 w-full h-[75%] bg-[#1A1A1A] rounded-b-lg rounded-t-sm border-2 border-[#8B7355]/50 overflow-hidden">
        {/* Tea liquid */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#8B7355] to-[#9FD356]/70 tea-loader-liquid"
        />
        {/* Shine */}
        <div className="absolute inset-y-0 left-1 w-1 bg-gradient-to-b from-white/10 to-transparent rounded-full" />
      </div>
      
      {/* Cup handle */}
      <div className="absolute right-[-8px] top-[25%] w-3 h-[40%] border-2 border-[#8B7355]/50 rounded-r-full bg-transparent" />
      
      {/* Steam */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
        <div 
          className="w-2 h-4 bg-gradient-to-t from-[#F5F0E8]/30 to-transparent rounded-full tea-loader-steam"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="w-2 h-5 bg-gradient-to-t from-[#F5F0E8]/30 to-transparent rounded-full tea-loader-steam"
          style={{ animationDelay: '0.3s' }}
        />
        <div 
          className="w-2 h-4 bg-gradient-to-t from-[#F5F0E8]/30 to-transparent rounded-full tea-loader-steam"
          style={{ animationDelay: '0.6s' }}
        />
      </div>
    </div>
  );
};

export default TeaLoader;
