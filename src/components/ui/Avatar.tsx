import React from 'react';
import { View, Image, Text, ViewProps } from 'react-native';

interface AvatarProps extends ViewProps {
  url?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'idle' | 'none';
}

export const Avatar: React.FC<AvatarProps> = ({
  url,
  initials = 'KG',
  size = 'md',
  status = 'none',
  className = '',
  ...props
}) => {
  let sizeClass = 'w-10 h-10';
  let textSizeClass = 'text-xs';
  let statusDotSize = 'w-2.5 h-2.5';

  if (size === 'sm') {
    sizeClass = 'w-8 h-8';
    textSizeClass = 'text-[9px]';
    statusDotSize = 'w-2 h-2';
  } else if (size === 'lg') {
    sizeClass = 'w-16 h-16';
    textSizeClass = 'text-base';
    statusDotSize = 'w-3.5 h-3.5';
  }

  return (
    <View className={`relative shrink-0 ${sizeClass} ${className}`} {...props}>
      {url ? (
        <Image
          source={{ uri: url }}
          className={`w-full h-full rounded-full object-cover border border-[#dee9fc]`}
        />
      ) : (
        <View className="w-full h-full rounded-full bg-[#eff4ff] items-center justify-center border border-[#dee9fc]">
          <Text className={`font-black text-[#2a14b4] ${textSizeClass}`}>{initials}</Text>
        </View>
      )}

      {status !== 'none' && (
        <View
          className={`absolute bottom-0 right-0 rounded-full border border-white ${
            status === 'online' ? 'bg-[#006a61]' : 'bg-[#d97706]'
          } ${statusDotSize}`}
        />
      )}
    </View>
  );
};
