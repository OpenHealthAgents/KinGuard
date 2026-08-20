import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClass?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerClass = '',
  className = '',
  ...props
}) => {
  return (
    <View className={`w-full space-y-1 ${containerClass}`}>
      {label && (
        <Text className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor="#94a3b8"
        className={`w-full bg-[#f8f9ff] text-slate-800 text-xs px-4 py-3 rounded-2xl border ${
          error ? 'border-[#ba1a1a]' : 'border-[#dee9fc]'
        } focus:border-[#2a14b4] ${className}`}
        {...props}
      />
      {error && (
        <Text className="text-[8px] font-black text-[#ba1a1a] uppercase mt-0.5">{error}</Text>
      )}
    </View>
  );
};
