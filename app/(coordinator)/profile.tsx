import { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AppContext } from '../../src/store/AppContext';
import { BottomNavBar } from '../../src/components/Navigation';
import { DeviceFrame } from '../../src/components/DeviceFrame';
import { SimulatorControls } from '../../src/components/SimulatorControls';
import { useRouter } from 'expo-router';
import { User, Shield, Smartphone, HeartHandshake, Users } from 'lucide-react-native';

export default function CoordinatorProfileRoute() {
  const context = useContext(AppContext);
  const router = useRouter();

  if (!context) return null;

  return (
    <DeviceFrame>
      <View className="flex-1 relative bg-[#fdfbf7]">
        {/* Header */}
        <View className="px-5 py-4 border-b border-[#e7e5e4] bg-[#fdfbf7]">
          <Text className="text-2xl font-black tracking-tight text-[#171717]">My Settings</Text>
          <Text className="text-xs text-[#708090] mt-0.5">
            Configure sync intervals and user personas
          </Text>
        </View>

        <ScrollView className="flex-1 px-5 pt-4 space-y-4">
          {/* User Profile Card */}
          <View className="p-4 rounded-3xl border border-[#e7e5e4] bg-white flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-full bg-[#2a14b4]/10 items-center justify-center">
              <User size={24} color="#2a14b4" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-black text-[#171717]">Anjali Sharma</Text>
              <Text className="text-xs text-[#708090]">London, United Kingdom (BST)</Text>
            </View>
          </View>

          {/* Switch Persona Button */}
          <View className="p-5 rounded-3xl border border-[#ffe09e] bg-[#fffbeb] space-y-3">
            <View className="flex-row items-center gap-2">
              <HeartHandshake size={20} color="#d97706" />
              <Text className="text-sm font-black text-[#5c3e03]">Prototype Persona Switcher</Text>
            </View>
            <Text className="text-xs text-[#78350f] leading-relaxed">
              Test the two-sided product experiences. Switch to Parent Mode to see Dad Ramesh's
              large high-contrast checklist in Chennai.
            </Text>
            <TouchableOpacity
              onPress={() => {
                context.setAppMode('parent');
                context.showToast('Switched persona to Ramesh (Parent Mode)');
                router.replace('/(parent)');
              }}
              activeOpacity={0.8}
              className="w-full bg-[#d97706] py-3 rounded-2xl items-center justify-center border-2 border-[#b45309]"
            >
              <Text className="text-xs font-black text-white">Switch to Parent Mode</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Options */}
          <View className="border border-[#e7e5e4] bg-white rounded-3xl divide-y divide-[#e7e5e4] overflow-hidden">
            <TouchableOpacity
              onPress={() => router.push('/family')}
              className="p-4 flex-row items-center gap-3 active:bg-slate-50"
            >
              <Users size={16} color="#2a14b4" />
              <View className="flex-1">
                <Text className="text-xs font-black text-[#171717]">Family Coordination</Text>
                <Text className="text-[10px] text-[#708090]">
                  Map responsibilities & family care assignments
                </Text>
              </View>
            </TouchableOpacity>

            <View className="p-4 flex-row items-center gap-3">
              <Shield size={16} color="#708090" />
              <View className="flex-1">
                <Text className="text-xs font-black text-[#171717]">
                  Clinical Ingestion Trust Settings
                </Text>
                <Text className="text-[10px] text-[#708090]">
                  Fuzzy logic limits: Spikes flagging configured
                </Text>
              </View>
            </View>

            <View className="p-4 flex-row items-center gap-3">
              <Smartphone size={16} color="#708090" />
              <View className="flex-1">
                <Text className="text-xs font-black text-[#171717]">Connected Devices</Text>
                <Text className="text-[10px] text-[#708090]">
                  Dexcom G7, Omron 7000, Apple Watch
                </Text>
              </View>
            </View>
          </View>

          <View className="h-24" />
        </ScrollView>

        <BottomNavBar
          activeTab="profile"
          currentScreen="health_dashboard"
          onTabChange={(tab) => {
            if (tab === 'home') router.push('/(coordinator)');
            else if (tab === 'parents') router.push('/parents');
            else if (tab === 'ask') context.setAskAIOpen(true);
            else if (tab === 'care') router.push('/care');
          }}
          onOpenQuickActions={() => context.setQuickActionsOpen(true)}
          onOpenAskAI={() => context.setAskAIOpen(true)}
        />
      </View>
      <SimulatorControls
        onTriggerNotification={context.handleTriggerSimulation}
        onRefreshData={context.handleWearableSyncRefresh}
        isSyncing={context.isSyncing}
        currentLoopStep={context.currentLoopStep}
        onAdvanceLoop={context.handleAdvanceLoop}
        onResetLoop={context.handleResetLoop}
      />
    </DeviceFrame>
  );
}
