import { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Switch } from 'react-native';
import { AppContext } from '../../src/store/AppContext';
import { ParentBottomNavBar } from '../../src/components/Navigation';
import { DeviceFrame } from '../../src/components/DeviceFrame';
import { SimulatorControls } from '../../src/components/SimulatorControls';
import { useRouter } from 'expo-router';
import {
  User,
  PhoneCall,
  Globe,
  KeyRound,
  Users,
  Stethoscope,
  HeartHandshake,
  Shield,
  X
} from 'lucide-react-native';

export default function ParentProfileRoute() {
  const context = useContext(AppContext);
  const router = useRouter();
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  if (!context) return null;

  const profileOptions = [
    {
      title: 'My information',
      description: 'Ramesh Sharma · Age 68 · Chennai, India',
      icon: User,
      color: '#d97706',
      bgColor: '#fef3c7'
    },
    {
      title: 'My doctors',
      description: 'Dr. Sharma · Cardiology · Apollo Hospital',
      icon: Stethoscope,
      color: '#059669',
      bgColor: '#d1fae5'
    },
    {
      title: 'My family',
      description: 'Anjali (London) · Rahul (Dubai) · Lakshmi (Chennai)',
      icon: Users,
      color: '#2a14b4',
      bgColor: '#eff4ff'
    },
    {
      title: 'Privacy settings',
      description: context.consentApproved
        ? 'Active consent sharing enabled'
        : 'Access paused (Telemetry blocked)',
      icon: KeyRound,
      color: '#7c3aed',
      bgColor: '#f5f3ff'
    },
    {
      title: 'Language',
      description: 'English (US) · Tamil (தமிழ்)',
      icon: Globe,
      color: '#0891b2',
      bgColor: '#ecfeff'
    },
    {
      title: 'Help & support',
      description: 'Call Anjali or message caregiver Priya',
      icon: PhoneCall,
      color: '#ba1a1a',
      bgColor: '#fee2e2'
    }
  ];

  return (
    <DeviceFrame>
      <View className="flex-1 relative bg-[#fffbeb]">
        {/* Header */}
        <View className="bg-[#d97706] pt-6 pb-5 px-6 border-b-4 border-[#b45309] space-y-1">
          <Text className="text-2xl font-black text-white uppercase tracking-wider">
            My profile
          </Text>
          <Text className="text-xs font-bold text-[#fef3c7] uppercase tracking-widest">
            Ramesh's Settings Console
          </Text>
        </View>

        <ScrollView className="flex-1 p-6 space-y-5">
          {/* Options List */}
          <View className="bg-white border-4 border-amber-300 rounded-[32px] p-4.5 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {profileOptions.map((opt, idx) => {
              const IconComponent = opt.icon;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    if (opt.title.includes('Privacy')) {
                      setShowPrivacyModal(true);
                    } else {
                      context.showToast(`Opening ${opt.title}...`);
                    }
                  }}
                  className="py-4.5 flex-row items-center gap-4 active:scale-98"
                >
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center shrink-0"
                    style={{ backgroundColor: opt.bgColor }}
                  >
                    <IconComponent size={20} color={opt.color} />
                  </View>
                  <View className="flex-grow">
                    <Text className="text-base font-black text-slate-800 leading-tight">
                      {opt.title}
                    </Text>
                    <Text className="text-xs text-slate-400 font-semibold mt-0.5 leading-snug">
                      {opt.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Simple Swapper CTA */}
          <View className="bg-white border-2 border-amber-200 rounded-[32px] p-5 space-y-3.5 shadow-xs">
            <View className="flex-row items-center gap-2">
              <HeartHandshake size={20} color="#2a14b4" />
              <Text className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Switch Views
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                context.setAppMode('coordinator');
                context.showToast('Switched view to Anjali (Coordinator Mode)');
                router.replace('/(coordinator)');
              }}
              className="w-full bg-[#2a14b4] py-3.5 rounded-xl items-center justify-center active:scale-95 shadow-xs"
            >
              <Text className="text-white text-xs font-black uppercase">
                Switch to Anjali's View
              </Text>
            </TouchableOpacity>
          </View>

          <View className="h-28" />
        </ScrollView>

        <ParentBottomNavBar
          activeTab="profile"
          onTabChange={(tab) => {
            if (tab === 'home') router.push('/(parent)');
            else if (tab === 'medicines') router.push('/(parent)/medicines');
            else if (tab === 'ask') router.push('/(parent)/ask');
          }}
        />
      </View>

      {/* Explicit Privacy & Consent Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[32px] max-h-[85%] p-6 space-y-5 shadow-2xl">
            {/* Header */}
            <View className="flex-row justify-between items-center pb-2 border-b border-slate-100">
              <View className="flex-row items-center gap-2">
                <Shield size={20} color="#7c3aed" />
                <Text className="text-lg font-black text-[#121c2a]">Privacy & Family Access</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowPrivacyModal(false)}
                className="p-1.5 bg-slate-100 rounded-full"
              >
                <X size={16} color="#464554" />
              </TouchableOpacity>
            </View>

            <ScrollView className="space-y-4">
              {/* Permissions Explanation */}
              <View className="bg-slate-50 border border-slate-150 p-4 rounded-3xl space-y-2">
                <Text className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Simple permissions explanation
                </Text>
                <Text className="text-xs text-slate-600 font-bold leading-relaxed">
                  Sharing lets Anjali look out for your health from London, and allows Priya to
                  check off your daily medication logs in Chennai. We encrypt all documents and
                  telemetry. You are always in control of who sees what.
                </Text>
              </View>

              {/* Explicit Toggle */}
              <View className="border border-violet-100 bg-[#f5f3ff] rounded-3xl p-5 flex-row justify-between items-center shadow-xs">
                <View className="flex-1 pr-4 space-y-1">
                  <Text className="text-sm font-black text-violet-950">
                    Explicit consent status
                  </Text>
                  <Text className="text-[11px] text-violet-750 font-bold leading-snug">
                    I consent to sharing my daily vitals and check-in logs with my Care circle
                  </Text>
                </View>
                <Switch
                  value={context.consentApproved}
                  onValueChange={(val) => {
                    context.setConsentApproved(val);
                    context.showToast(
                      val
                        ? 'Sharing permissions granted.'
                        : 'Sharing paused. Telemetry sync is blocked.'
                    );
                  }}
                  trackColor={{ false: '#cbd5e1', true: '#7c3aed' }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Access Levels Matrix */}
              <View className="space-y-3 pt-2">
                <Text className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Active Access list
                </Text>

                {/* Anjali */}
                <View className="bg-white border border-slate-100 rounded-2xl p-4 flex-row justify-between items-center shadow-xs">
                  <View className="space-y-0.5">
                    <Text className="text-xs font-black text-slate-800">Anjali (Daughter)</Text>
                    <Text className="text-[10px] text-slate-400 font-bold">
                      Primary Coordinator · London
                    </Text>
                  </View>
                  <View className="bg-[#2a14b4]/10 px-3 py-1 rounded-full">
                    <Text className="text-[10px] font-black text-[#2a14b4] uppercase">
                      Full access
                    </Text>
                  </View>
                </View>

                {/* Rahul */}
                <View className="bg-white border border-slate-100 rounded-2xl p-4 flex-row justify-between items-center shadow-xs">
                  <View className="space-y-0.5">
                    <Text className="text-xs font-black text-slate-800">Rahul (Son)</Text>
                    <Text className="text-[10px] text-slate-400 font-bold">
                      Sibling Coordinator · Dubai
                    </Text>
                  </View>
                  <View className="bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                    <Text className="text-[10px] font-black text-teal-800 uppercase">
                      Health summary
                    </Text>
                  </View>
                </View>

                {/* Priya */}
                <View className="bg-white border border-slate-100 rounded-2xl p-4 flex-row justify-between items-center shadow-xs">
                  <View className="space-y-0.5">
                    <Text className="text-xs font-black text-slate-800">Priya (Caregiver)</Text>
                    <Text className="text-[10px] text-slate-400 font-bold">
                      Care Companion · Bengaluru
                    </Text>
                  </View>
                  <View className="bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                    <Text className="text-[10px] font-black text-amber-800 uppercase">
                      Care + Meds
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setShowPrivacyModal(false)}
                className="w-full bg-[#7c3aed] py-4 rounded-xl items-center justify-center mt-3 active:scale-95 shadow-md"
              >
                <Text className="text-white text-xs font-black uppercase">Close permissions</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
