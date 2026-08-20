import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'parent' | 'alert' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  title: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  title,
  className = '',
  ...props
}) => {
  const baseStyle = 'flex-row items-center justify-center rounded-2xl active:opacity-90';

  let variantStyle = 'bg-[#2a14b4] border border-transparent';
  let textStyle = 'text-white font-black';

  if (variant === 'secondary') {
    variantStyle = 'bg-[#eff4ff] border border-transparent';
    textStyle = 'text-[#2a14b4] font-black';
  } else if (variant === 'parent') {
    variantStyle = 'bg-[#d97706] border-2 border-[#b45309]';
    textStyle = 'text-white font-black';
  } else if (variant === 'alert') {
    variantStyle = 'bg-[#ba1a1a] border border-transparent';
    textStyle = 'text-white font-black';
  } else if (variant === 'outline') {
    variantStyle = 'bg-transparent border border-[#dee9fc]';
    textStyle = 'text-[#464554] font-bold';
  }

  let sizeStyle = 'px-4 py-3';
  let textSizeStyle = 'text-xs';

  if (size === 'sm') {
    sizeStyle = 'px-3 py-1.5 rounded-xl';
    textSizeStyle = 'text-[10px]';
  } else if (size === 'lg') {
    sizeStyle = 'px-6 py-4.5 rounded-3xl';
    textSizeStyle = 'text-sm md:text-base';
  }

  const combinedClass = `${baseStyle} ${variantStyle} ${sizeStyle} ${className}`;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={combinedClass}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'outline' ? '#2a14b4' : '#ffffff'}
        />
      ) : (
        <Text className={`${textStyle} ${textSizeStyle} text-center`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
