import { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AppContext } from '../../src/store/AppContext';
import { ParentBottomNavBar } from '../../src/components/Navigation';
import { DeviceFrame } from '../../src/components/DeviceFrame';
import { SimulatorControls } from '../../src/components/SimulatorControls';
import { useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';

export default function ParentMedicinesRoute() {
  const context = useContext(AppContext);
  const router = useRouter();

  if (!context) return null;

  // Filter for Dad's medicines
  const dadMeds = context.medications.filter((m) => m.personId === 'dad');

  return (
    <DeviceFrame>
      <View className="flex-1 relative bg-[#f2f2f7]">
        {/* Header */}
        <View className="bg-white pt-6 pb-5 px-6 border-b border-neutral-100 space-y-0.5">
          <Text className="text-2xl font-bold text-neutral-900 tracking-tight">
            Today's medicines
          </Text>
          <Text className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Ramesh's Daily Checklist
          </Text>
        </View>

        <ScrollView className="flex-1 p-6 space-y-6">
          {dadMeds.some((m) => m.id === 'rec-5' && m.status !== 'taken') && (
            <View className="bg-amber-50 border-4 border-amber-500 rounded-[32px] p-5 mb-2 shadow-xs">
              <Text className="text-sm font-black text-amber-900 uppercase tracking-wide">
                {context.notifications.some(
                  (n) => n.recipient === 'parent' && n.category === 'medication_reminder' && !n.read
                )
                  ? 'Anjali sent you a reminder.'
                  : 'Did you take your evening medicine?'}
              </Text>
              <Text className="text-xs text-amber-700 font-semibold leading-relaxed mt-1">
                {context.notifications.some(
                  (n) => n.recipient === 'parent' && n.category === 'medication_reminder' && !n.read
                )
                  ? 'Anjali wants to make sure you confirm your evening dose of Atorvastatin 20mg.'
                  : 'Please check your medication card below and confirm if you have taken your dinner doses.'}
              </Text>
            </View>
          )}

          <View className="space-y-5">
            {dadMeds.map((med) => {
              const isTaken = med.status === 'taken';
              return (
                <View
                  key={med.id}
                  className={`bg-white rounded-2xl p-5 shadow-sm shadow-neutral-100 space-y-4 border-l-4 ${
                    isTaken ? 'border-[#34c759]' : 'border-[#ff9500]'
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs font-semibold text-neutral-400">
                      {med.scheduledTime}
                    </Text>
                    <View
                      className={`px-3 py-1 rounded-full ${isTaken ? 'bg-[#34c759]' : 'bg-orange-50'}`}
                    >
                      <Text
                        className={`text-[10px] font-bold ${isTaken ? 'text-white' : 'text-[#ff9500]'}`}
                      >
                        {isTaken ? '✓ Taken' : 'Upcoming'}
                      </Text>
                    </View>
                  </View>

                  <View className="space-y-1">
                    <Text className="text-3xl font-black text-slate-900 leading-none">
                      {med.name}
                    </Text>
                    <Text className="text-lg font-black text-slate-400 mt-1">{med.dose}</Text>
                  </View>

                  {!isTaken ? (
                    <TouchableOpacity
                      onPress={() => {
                        context.markMedicationTaken(med.id);
                        context.showToast(`${med.name} dose checked off successfully.`);
                      }}
                      className="w-full bg-[#d97706] py-4.5 rounded-2xl items-center justify-center active:scale-98 shadow-md mt-2"
                    >
                      <Text className="text-white font-black text-sm uppercase tracking-widest">
                        Mark as taken
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="w-full py-4 bg-emerald-600/10 rounded-2xl items-center justify-center flex-row gap-2 mt-2 border border-emerald-500/20">
                      <CheckCircle2 size={16} color="#059669" />
                      <Text className="text-emerald-800 text-xs font-black uppercase tracking-wider">
                        Dose logged in Care circle
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
          <View className="h-28" />
        </ScrollView>

        <ParentBottomNavBar
          activeTab="medicines"
          onTabChange={(tab) => {
            if (tab === 'home') router.push('/(parent)');
            else if (tab === 'profile') router.push('/(parent)/profile');
            else if (tab === 'ask') router.push('/(parent)/ask');
          }}
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
