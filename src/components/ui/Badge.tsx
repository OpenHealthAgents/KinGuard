import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface BadgeProps extends ViewProps {
  variant?: 'success' | 'alert' | 'warning' | 'sync' | 'info' | 'default';
  label: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  label,
  className = '',
  ...props
}) => {
  const baseStyle = 'px-2 py-0.5 rounded-full self-start';

  let variantStyle = 'bg-[#f1f3f9] border border-[#dee9fc]';
  let textStyle = 'text-slate-500 font-black text-[8px] uppercase tracking-wider';

  if (variant === 'success') {
    variantStyle = 'bg-[#d2f4ef] border border-transparent';
    textStyle = 'text-[#006a61] font-black text-[8px] uppercase tracking-wider';
  } else if (variant === 'alert') {
    variantStyle = 'bg-[#ffdad6] border border-transparent';
    textStyle = 'text-[#ba1a1a] font-black text-[8px] uppercase tracking-wider';
  } else if (variant === 'warning') {
    variantStyle = 'bg-[#ffe09e] border border-transparent';
    textStyle = 'text-[#8a5200] font-black text-[8px] uppercase tracking-wider';
  } else if (variant === 'sync') {
    variantStyle = 'bg-[#86f2e4]/15 border border-[#86f2e4]/30';
    textStyle = 'text-[#006a61] font-black text-[8px] uppercase tracking-wider';
  } else if (variant === 'info') {
    variantStyle = 'bg-[#eff4ff] border border-transparent';
    textStyle = 'text-[#2a14b4] font-black text-[8px] uppercase tracking-wider';
  }

  return (
    <View className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      <Text className={textStyle}>{label}</Text>
    </View>
  );
};
