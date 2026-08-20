import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, Users, Sparkles, Activity, User, Pill, Mic } from 'lucide-react-native';
import { ActiveTab, ScreenView } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  currentScreen: ScreenView;
  onTabChange: (tab: ActiveTab) => void;
  onOpenQuickActions: () => void;
  onOpenAskAI: () => void;
}

export const BottomNavBar: React.FC<NavigationProps> = ({
  activeTab,
  currentScreen,
  onTabChange,
  onOpenQuickActions: _onOpenQuickActions,
  onOpenAskAI
}) => {
  if (currentScreen === 'onboarding') return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 z-40 bg-white border-t border-[#dee9fc] flex-row justify-around items-end py-2 px-3 shadow-lg">
      {/* Tab 1: Home */}
      <TouchableOpacity
        onPress={() => onTabChange('home')}
        className="items-center justify-center py-2.5 w-14"
      >
        <View
          className={`px-2.5 py-1 rounded-full items-center justify-center ${
            activeTab === 'home' ? 'bg-[#2a14b4]/10' : ''
          }`}
        >
          <Home size={22} color={activeTab === 'home' ? '#2a14b4' : '#708090'} />
        </View>
        <Text
          className={`text-[10px] font-black uppercase mt-1 ${
            activeTab === 'home' ? 'text-[#2a14b4]' : 'text-[#708090]'
          }`}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Tab 2: Parents */}
      <TouchableOpacity
        onPress={() => onTabChange('parents')}
        className="items-center justify-center py-2.5 w-14"
      >
        <View
          className={`px-2.5 py-1 rounded-full items-center justify-center ${
            activeTab === 'parents' ? 'bg-[#2a14b4]/10' : ''
          }`}
        >
          <Users size={22} color={activeTab === 'parents' ? '#2a14b4' : '#708090'} />
        </View>
        <Text
          className={`text-[10px] font-black uppercase mt-1 ${
            activeTab === 'parents' ? 'text-[#2a14b4]' : 'text-[#708090]'
          }`}
        >
          Parents
        </Text>
      </TouchableOpacity>

      {/* Tab 3: Ask AI (Center Action Button) */}
      <TouchableOpacity onPress={onOpenAskAI} className="items-center justify-center w-16 -top-3.5">
        <View className="w-14 h-14 rounded-full bg-[#2a14b4] items-center justify-center shadow-lg border-4 border-white active:scale-95">
          <Sparkles size={26} color="#ffffff" />
        </View>
        <Text className="text-[10px] font-black uppercase text-[#2a14b4] mt-0.5">Ask</Text>
      </TouchableOpacity>

      {/* Tab 4: Care */}
      <TouchableOpacity
        onPress={() => onTabChange('care')}
        className="items-center justify-center py-2.5 w-14"
      >
        <View
          className={`px-2.5 py-1 rounded-full items-center justify-center ${
            activeTab === 'care' ? 'bg-[#2a14b4]/10' : ''
          }`}
        >
          <Activity size={22} color={activeTab === 'care' ? '#2a14b4' : '#708090'} />
        </View>
        <Text
          className={`text-[10px] font-black uppercase mt-1 ${
            activeTab === 'care' ? 'text-[#2a14b4]' : 'text-[#708090]'
          }`}
        >
          Care
        </Text>
      </TouchableOpacity>

      {/* Tab 5: Profile */}
      <TouchableOpacity
        onPress={() => onTabChange('profile')}
        className="items-center justify-center py-2.5 w-14"
      >
        <View
          className={`px-2.5 py-1 rounded-full items-center justify-center ${
            activeTab === 'profile' ? 'bg-[#2a14b4]/10' : ''
          }`}
        >
          <User size={22} color={activeTab === 'profile' ? '#2a14b4' : '#708090'} />
        </View>
        <Text
          className={`text-[10px] font-black uppercase mt-1 ${
            activeTab === 'profile' ? 'text-[#2a14b4]' : 'text-[#708090]'
          }`}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

interface ParentNavigationProps {
  activeTab: 'home' | 'medicines' | 'ask' | 'profile';
  onTabChange: (tab: 'home' | 'medicines' | 'ask' | 'profile') => void;
}

export const ParentBottomNavBar: React.FC<ParentNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className="absolute bottom-0 left-0 right-0 z-40 bg-[#fffbeb] border-t border-[#fde68a] flex-row justify-around items-center py-3 px-3 shadow-lg">
      <TouchableOpacity
        onPress={() => onTabChange('home')}
        className="items-center justify-center py-2.5 w-16"
      >
        <Home size={28} color={activeTab === 'home' ? '#d97706' : '#78350f'} />
        <Text
          className={`text-xs font-black mt-1 ${activeTab === 'home' ? 'text-[#d97706]' : 'text-[#78350f]'}`}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onTabChange('medicines')}
        className="items-center justify-center py-2.5 w-16"
      >
        <Pill size={28} color={activeTab === 'medicines' ? '#d97706' : '#78350f'} />
        <Text
          className={`text-xs font-black mt-1 ${activeTab === 'medicines' ? 'text-[#d97706]' : 'text-[#78350f]'}`}
        >
          Medicines
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onTabChange('ask')}
        className="items-center justify-center py-2.5 w-16"
      >
        <Mic size={28} color={activeTab === 'ask' ? '#3b82f6' : '#78350f'} />
        <Text
          className={`text-xs font-black mt-1 ${activeTab === 'ask' ? 'text-[#3b82f6]' : 'text-[#78350f]'}`}
        >
          Ask AI
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onTabChange('profile')}
        className="items-center justify-center py-2.5 w-16"
      >
        <User size={28} color={activeTab === 'profile' ? '#d97706' : '#78350f'} />
        <Text
          className={`text-xs font-black mt-1 ${activeTab === 'profile' ? 'text-[#d97706]' : 'text-[#78350f]'}`}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};
