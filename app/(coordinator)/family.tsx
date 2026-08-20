import { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AppContext } from '../../src/store/AppContext';
import { BottomNavBar } from '../../src/components/Navigation';
import { DeviceFrame } from '../../src/components/DeviceFrame';
import { SimulatorControls } from '../../src/components/SimulatorControls';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, Pill, Clipboard } from 'lucide-react-native';

export default function FamilyCoordinationRoute() {
  const context = useContext(AppContext);
  const router = useRouter();

  if (!context) return null;

  const familyMembers = [
    {
      name: 'Anjali Sharma',
      location: 'London, UK',
      role: 'Primary coordinator',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBjb58pDYmLPOvRb2C93qIwVmN3Z3qZ__ljM1T9ZSdVoVI9ovH8x3UkvVX2km1jcc-lJDB8XKVXGhKX0bZL8qDi2s9jgC8eOKs1TubpaykQObp6xTg11e7t9fDFBiO9G_knt_Iu91RQ6oYuQGrd_EwUBKvQprl0XXO1mrgZ2LripRVXQ9ztlZOQr21ScUbgnP5iva9lVWOYFTQ4E6180FpDmnFn1lhIDcG8awhKsT88RjoTEgkPxtmV',
      linkId: 'anjali'
    },
    {
      name: 'Rahul Sharma',
      location: 'Dubai, UAE',
      role: 'Sibling',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      linkId: 'rahul'
    },
    {
      name: 'Priya',
      location: 'Bengaluru, India',
      role: 'Caregiver',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      linkId: 'priya'
    }
  ];

  const assignments = [
    {
      task: "Dad's appointment",
      assignee: 'Priya',
      icon: Calendar,
      color: '#ba1a1a',
      bgColor: '#fff1f2'
    },
    {
      task: 'Medication coordination',
      assignee: 'Anjali Sharma',
      icon: Pill,
      color: '#2a14b4',
      bgColor: '#eff4ff'
    },
    {
      task: 'Lab report pickup',
      assignee: 'Rahul Sharma',
      icon: Clipboard,
      color: '#3b82f6',
      bgColor: '#eff6ff'
    }
  ];

  return (
    <DeviceFrame>
      <View className="flex-1 relative bg-[#fbfaf7]">
        {/* Header */}
        <View className="px-6 py-5 border-b border-[#e2dfd9] bg-[#fbfaf7] flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-1 hover:bg-slate-100 rounded-full"
          >
            <ArrowLeft size={20} color="#121c2a" />
          </TouchableOpacity>
          <View>
            <Text className="text-lg font-black text-[#121c2a]">Family Coordination</Text>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Care Task Responsibility Mapping
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 pt-5 space-y-6">
          {/* Members List */}
          <View className="space-y-3">
            <Text className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Care circle network
            </Text>

            <View className="bg-white border border-[#e2dfd9] rounded-3xl p-5 shadow-sm space-y-4">
              {familyMembers.map((member) => (
                <TouchableOpacity
                  key={member.name}
                  onPress={() => router.push(`/caregiver/${member.linkId}`)}
                  className="flex-row items-center justify-between pb-3 last:pb-0 border-b last:border-0 border-slate-50 active:scale-98"
                >
                  <View className="flex-row items-center gap-3">
                    <Image
                      source={{ uri: member.avatar }}
                      className="w-10 h-10 rounded-full border border-slate-100"
                    />
                    <View>
                      <Text className="text-xs font-black text-slate-800">{member.name}</Text>
                      <View className="flex-row items-center gap-1 mt-0.5">
                        <MapPin size={10} color="#708090" />
                        <Text className="text-[10px] text-slate-400 font-bold">
                          {member.location}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="bg-[#eff4ff] px-2.5 py-0.5 rounded-full">
                    <Text className="text-[8px] font-black text-[#2a14b4] uppercase">
                      {member.role}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Responsibility matrix */}
          <View className="space-y-3">
            <Text className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Responsibility mapping
            </Text>

            <View className="bg-white border border-[#e2dfd9] rounded-3xl p-5 shadow-sm space-y-4">
              {assignments.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <View
                    key={idx}
                    className="flex-row items-center justify-between pb-3 last:pb-0 border-b last:border-0 border-slate-50"
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-8 h-8 rounded-full items-center justify-center"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        <IconComponent size={14} color={item.color} />
                      </View>
                      <Text className="text-xs font-black text-slate-800">{item.task}</Text>
                    </View>
                    <View className="bg-slate-100 px-3 py-1 rounded-full">
                      <Text className="text-[9px] font-black text-slate-600 uppercase">
                        &rarr; {item.assignee}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Chat Launcher CTA */}
          <TouchableOpacity
            onPress={() => router.push('/family-chat')}
            className="w-full bg-[#2a14b4] py-4 rounded-2xl flex-row items-center justify-center gap-2 active:scale-98 shadow-sm"
          >
            <Text className="text-white font-black text-xs uppercase tracking-wider">
              Open Family Chat
            </Text>
          </TouchableOpacity>

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
