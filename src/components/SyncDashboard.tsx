import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { RefreshCw, Clock, Radio, Heart } from 'lucide-react-native';
import { SyncLog } from '../types';
import { CARE_NETWORK_TEAM } from '../data/mockData';

interface SyncDashboardProps {
  syncLogs: SyncLog[];
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const SyncDashboard: React.FC<SyncDashboardProps> = ({
  syncLogs,
  onTriggerSync,
  isSyncing
}) => {
  const [londonTime, setLondonTime] = useState('');
  const [chennaiTime, setChennaiTime] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();

      const lTimeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setLondonTime(lTimeStr);

      const cTimeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setChennaiTime(cTimeStr);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView className="flex-1 bg-[#f8f9ff]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#eff4ff] bg-[#f8f9ff]">
        <Text className="text-base font-black text-[#2a14b4]">Cross-User Sync</Text>
        <TouchableOpacity
          onPress={onTriggerSync}
          disabled={isSyncing}
          className="w-9 h-9 rounded-full bg-[#eff4ff] items-center justify-center text-[#2a14b4]"
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#2a14b4" />
          ) : (
            <RefreshCw size={16} color="#2a14b4" />
          )}
        </TouchableOpacity>
      </View>

      <View className="p-5 space-y-6">
        {/* Timezone translate */}
        <View className="bg-white border border-[#dee9fc] rounded-[24px] p-5 shadow-sm space-y-4">
          <View className="flex-row items-center justify-between border-b border-slate-55 pb-3">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Timezone Translation
            </Text>
            <View className="bg-[#eff4ff] px-2.5 py-0.5 rounded-full">
              <Text className="text-[8px] font-black text-[#4338ca] uppercase">
                5.5 Hour Offset
              </Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1 bg-[#f8f9ff] p-4 rounded-2xl items-center border border-slate-100">
              <View className="w-8 h-8 rounded-full bg-[#e6eeff] items-center justify-center mb-2">
                <Clock size={16} color="#2a14b4" />
              </View>
              <Text className="text-[9px] font-black text-slate-400 uppercase">London (BST)</Text>
              <Text className="text-base font-black text-slate-800 mt-0.5">
                {londonTime || '--:-- --'}
              </Text>
              <Text className="text-[8px] text-slate-400 mt-0.5 font-bold">Anjali (Daughter)</Text>
            </View>

            <View className="flex-1 bg-[#f8f9ff] p-4 rounded-2xl items-center border border-slate-100">
              <View className="w-8 h-8 rounded-full bg-[#d2f4ef] items-center justify-center mb-2">
                <Clock size={16} color="#006a61" />
              </View>
              <Text className="text-[9px] font-black text-slate-400 uppercase">Chennai (IST)</Text>
              <Text className="text-base font-black text-slate-800 mt-0.5">
                {chennaiTime || '--:-- --'}
              </Text>
              <Text className="text-[8px] text-slate-400 mt-0.5 font-bold">Ramesh (Dad)</Text>
            </View>
          </View>
        </View>

        {/* Telemetry Streams */}
        <View className="bg-white border border-[#dee9fc] rounded-[24px] p-5 shadow-sm space-y-4">
          <View className="flex-row items-center justify-between border-b border-slate-100 pb-3">
            <Text className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
              Connected Telemetry Streams
            </Text>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2 h-2 rounded-full bg-[#006a61] animate-pulse" />
              <Text className="text-[8px] font-black text-[#006a61] uppercase">Ingest: Active</Text>
            </View>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between p-3.5 bg-[#f8f9ff] rounded-2xl border border-slate-50">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-[#eff4ff] items-center justify-center">
                  <Radio size={16} color="#2a14b4" />
                </View>
                <View>
                  <Text className="text-xs font-black text-slate-800">Dexcom G7 CGM</Text>
                  <Text className="text-[9px] text-slate-400 font-bold">
                    Lakshmi (Mom) • Bluetooth stream
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-xs font-black text-[#006a61]">98 mg/dL</Text>
                <Text className="text-[8px] text-slate-400 font-bold mt-0.5">Synced 5m ago</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between p-3.5 bg-[#f8f9ff] rounded-2xl border border-slate-50">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-[#ffdad6] items-center justify-center">
                  <Heart size={16} color="#ba1a1a" fill="#ba1a1a" />
                </View>
                <View>
                  <Text className="text-xs font-black text-slate-800">Omron Blood Pressure</Text>
                  <Text className="text-[9px] text-slate-400 font-bold">
                    Ramesh (Dad) • Smart Hub sync
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-xs font-black text-[#ba1a1a]">138/88 mmHg</Text>
                <Text className="text-[8px] text-slate-400 font-bold mt-0.5">Synced 45m ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Care Network status */}
        <View className="bg-white border border-[#dee9fc] rounded-[24px] p-5 shadow-sm space-y-3.5">
          <Text className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
            Active Care Team Coordination
          </Text>
          <View className="space-y-4 pt-1.5">
            {CARE_NETWORK_TEAM.map((member) => (
              <View key={member.id} className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="relative">
                    <Image
                      source={{ uri: member.avatar }}
                      className="w-9 h-9 rounded-full object-cover border border-[#dee9fc]"
                    />
                    {member.online && (
                      <View className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#006a61] border-2 border-white rounded-full" />
                    )}
                  </View>
                  <View>
                    <Text className="text-xs font-black text-slate-800">{member.name}</Text>
                    <Text className="text-[9px] text-[#464554] font-bold">
                      {member.role} • {member.location.split(' ')[0]}
                    </Text>
                  </View>
                </View>
                <View className="bg-[#d2f4ef] px-2 py-0.5 rounded-full">
                  <Text className="text-[8px] font-black text-[#006a61] uppercase">
                    {member.online ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Sync logs */}
        <View className="bg-white border border-[#dee9fc] rounded-[24px] p-5 shadow-sm space-y-3.5 mb-12">
          <Text className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
            Device Ingestion Logs
          </Text>
          <View className="space-y-3 pt-1.5">
            {syncLogs.slice(0, 5).map((log) => (
              <View
                key={log.id}
                className="flex-row justify-between items-start py-2 border-b border-slate-50 last:border-0 last:pb-0"
              >
                <View className="space-y-0.5 flex-1 pr-2">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="font-black text-slate-800 text-[11px]">{log.device}</Text>
                    <Text className="text-[9px] text-slate-400 font-bold">• {log.user}</Text>
                  </View>
                  <Text className="text-[10px] text-slate-500 font-medium">{log.value}</Text>
                </View>
                <View className="items-end shrink-0">
                  <Text className="text-[9px] text-slate-400 font-black">{log.time}</Text>
                  <View className="w-1.5 h-1.5 rounded-full bg-[#006a61] mt-1" />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
