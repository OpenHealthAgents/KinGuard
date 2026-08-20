import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { X, Heart, MessageSquare } from 'lucide-react-native';
import { Person } from '../types';

interface CheckInModalProps {
  isOpen: boolean;
  person: Person;
  onClose: () => void;
  onSendCheckIn: (msg: string) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  person,
  onClose,
  onSendCheckIn
}) => {
  const options = [
    'Everything is going well here, Anjali!',
    'Had a healthy lunch with Suresh sir.',
    'Chennai weather is hot, staying indoors in AC.',
    'Confirming that evening medicines are taken.'
  ];

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-[32px] p-6 space-y-5">
          {/* Header */}
          <View className="flex-row justify-between items-center pb-2 border-b border-slate-100">
            <View className="flex-row items-center gap-2">
              <Heart size={18} color="#be185d" fill="#be185d" />
              <Text className="text-base font-black text-slate-800">
                Check in with {person.name.split(' ')[0]}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1.5 bg-slate-100 rounded-full">
              <X size={16} color="#464554" />
            </TouchableOpacity>
          </View>

          {/* Quick choices */}
          <View className="space-y-2.5">
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  onSendCheckIn(opt);
                  onClose();
                }}
                className="w-full p-4 bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#eff4ff] rounded-2xl flex-row items-center gap-3 active:scale-98"
              >
                <MessageSquare size={14} color="#4338ca" />
                <Text className="text-xs font-semibold text-slate-700 flex-1 leading-normal">
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};
