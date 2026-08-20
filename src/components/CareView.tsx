import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Pill, Plus, Users, Bell, Eye, Edit, Calendar } from 'lucide-react-native';
import { HealthRecordItem, SyncLog, Person } from '../types';
import { SyncDashboard } from './SyncDashboard';
import { AppContext } from '../store/AppContext';

interface CareViewProps {
  records: HealthRecordItem[];
  onOpenQuickActions: () => void;
  onAskAI: (prompt: string) => void;
  syncLogs: SyncLog[];
  onTriggerSync: () => void;
  isSyncing: boolean;
  people: Person[];
}

export const CareView: React.FC<CareViewProps> = ({
  records: _records,
  onOpenQuickActions,
  onAskAI: _onAskAI,
  syncLogs,
  onTriggerSync,
  isSyncing,
  people
}) => {
  const router = useRouter();
  const context = useContext(AppContext);
  const [activeSegment, setActiveSegment] = useState<'care' | 'plan' | 'sync'>('care');

  // Care dashboard state
  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      title: "Log Dad's midday blood pressure",
      assignee: 'Anjali',
      time: 'Today · 2:00 PM IST',
      section: 'Needs attention',
      status: 'pending'
    },
    {
      id: 'task-2',
      title: "Pick up Dad's lab report",
      assignee: 'Priya',
      time: 'Today · 5:00 PM IST',
      section: 'Today',
      status: 'pending'
    },
    {
      id: 'task-3',
      title: 'Accompany Mom to diabetic eye screening',
      assignee: 'Suresh Kumar',
      time: 'Tomorrow · 10:00 AM IST',
      section: 'Upcoming',
      status: 'pending'
    },
    {
      id: 'task-4',
      title: 'Upload new prescription paperwork',
      assignee: 'Ramesh (Dad)',
      time: 'Waiting for Dad',
      section: 'Waiting for someone',
      status: 'pending'
    },
    {
      id: 'task-5',
      title: 'Verify Metformin morning dose',
      assignee: 'Priya',
      time: 'Today · 8:05 AM IST',
      section: 'Completed',
      status: 'completed'
    }
  ]);

  if (!context) return null;

  const handleCompleteTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'completed', section: 'Completed' } : t))
    );
    const t = tasks.find((x) => x.id === id);
    if (t) {
      context.showToast(`Task "${t.title}" marked as completed.`);
    }
  };

  const handleReassignTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, assignee: 'Priya' } : t)));
    context.showToast('Reassigned task to Priya.');
  };

  const handleMessageTask = (assignee: string) => {
    context.showToast(`Message reminder dispatched to ${assignee}.`);
  };

  const isAtorvastatinTaken =
    context.records
      .find((r) => r.id === 'rec-5')
      ?.status?.toLowerCase()
      .includes('taken') || false;

  const dadMeds = [
    {
      name: 'Amlodipine',
      dose: '5 mg',
      time: '8:00 AM',
      status: isAtorvastatinTaken ? 'Taken' : 'Taken'
    },
    { name: 'Metformin', dose: '500 mg', time: '8:00 PM', status: 'Upcoming' }
  ];

  const momMeds = [
    { name: 'Metformin', dose: '500 mg', time: '8:00 AM', status: 'Taken' },
    { name: 'Osteocare Calcium', dose: 'ER', time: '8:00 PM', status: 'Upcoming' }
  ];

  // Helper Switcher Render
  const renderSwitcher = () => (
    <View className="flex-row bg-[#eff4ff] p-0.5 rounded-full border border-[#dee9fc]">
      <TouchableOpacity
        onPress={() => setActiveSegment('care')}
        className={`flex-1 py-2 rounded-full items-center justify-center ${activeSegment === 'care' ? 'bg-[#2a14b4]' : ''}`}
      >
        <Text
          className={`text-[10px] font-black uppercase ${activeSegment === 'care' ? 'text-white' : 'text-[#464554]'}`}
        >
          Care
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveSegment('plan')}
        className={`flex-1 py-2 rounded-full items-center justify-center ${activeSegment === 'plan' ? 'bg-[#2a14b4]' : ''}`}
      >
        <Text
          className={`text-[10px] font-black uppercase ${activeSegment === 'plan' ? 'text-white' : 'text-[#464554]'}`}
        >
          Medications
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveSegment('sync')}
        className={`flex-1 py-2 rounded-full items-center justify-center ${activeSegment === 'sync' ? 'bg-[#2a14b4]' : ''}`}
      >
        <Text
          className={`text-[10px] font-black uppercase ${activeSegment === 'sync' ? 'text-white' : 'text-[#464554]'}`}
        >
          Telemetry Sync
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Sync segment early return
  if (activeSegment === 'sync') {
    return (
      <View className="flex-1 bg-[#fbfaf7]">
        <View className="bg-[#fbfaf7] border-b border-[#e2dfd9] pt-4 pb-2 px-5">
          {renderSwitcher()}
        </View>
        <SyncDashboard syncLogs={syncLogs} onTriggerSync={onTriggerSync} isSyncing={isSyncing} />
      </View>
    );
  }

  // Care segment early return
  if (activeSegment === 'care') {
    return (
      <View className="flex-1 bg-[#fbfaf7]">
        {/* Header */}
        <View className="bg-[#fbfaf7] border-b border-[#e2dfd9] pt-4 pb-3 px-6 space-y-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-black text-[#121c2a]">Care Dashboard</Text>
            <TouchableOpacity
              onPress={onOpenQuickActions}
              className="w-9 h-9 rounded-full bg-[#f4effc] items-center justify-center shadow-xs"
            >
              <Plus size={16} color="#2a14b4" />
            </TouchableOpacity>
          </View>
          {renderSwitcher()}
        </View>

        <ScrollView className="flex-1 p-6 space-y-6">
          {['Needs attention', 'Today', 'Upcoming', 'Waiting for someone', 'Completed'].map(
            (sec) => {
              const secTasks = tasks.filter((t) => t.section === sec);
              if (secTasks.length === 0) return null;
              return (
                <View key={sec} className="space-y-3">
                  <Text className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    {sec}
                  </Text>
                  <View className="space-y-3">
                    {secTasks.map((task) => (
                      <View
                        key={task.id}
                        className="bg-white border border-[#e2dfd9] rounded-3xl p-5 shadow-sm space-y-4"
                      >
                        <View className="flex-row justify-between items-start">
                          <View className="space-y-1 pr-2 flex-1">
                            <Text className="text-sm font-black text-slate-800 leading-snug">
                              {task.title}
                            </Text>
                            <Text className="text-[10px] font-bold text-slate-400">
                              Assigned to {task.assignee}
                            </Text>
                          </View>
                          <View className="bg-slate-100 px-2.5 py-0.5 rounded-full shrink-0">
                            <Text className="text-[9px] font-black text-slate-500 uppercase">
                              {task.time}
                            </Text>
                          </View>
                        </View>

                        {/* Actions */}
                        <View className="flex-row gap-2.5 pt-3 border-t border-slate-50">
                          {task.status !== 'completed' && (
                            <TouchableOpacity
                              onPress={() => handleCompleteTask(task.id)}
                              className="flex-1 bg-[#059669] py-3 rounded-xl items-center justify-center active:scale-95 shadow-xs"
                            >
                              <Text className="text-[9px] font-black text-white uppercase">
                                Complete
                              </Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            onPress={() => handleReassignTask(task.id)}
                            className="flex-1 bg-white border border-slate-200 py-3 rounded-xl items-center justify-center active:scale-95 shadow-xs"
                          >
                            <Text className="text-[9px] font-black text-slate-600 uppercase">
                              Reassign
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleMessageTask(task.assignee)}
                            className="flex-1 bg-white border border-[#dee9fc] py-3 rounded-xl items-center justify-center active:scale-95 shadow-xs"
                          >
                            <Text className="text-[9px] font-black text-[#2a14b4] uppercase">
                              Message
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            }
          )}
          <View className="h-24" />
        </ScrollView>
      </View>
    );
  }

  // Medications plan segment
  return (
    <ScrollView className="flex-1 bg-[#fbfaf7]">
      {/* Header */}
      <View className="bg-[#fbfaf7] border-b border-[#e2dfd9] pt-4 pb-3 px-6 space-y-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-black text-[#121c2a]">Medications</Text>
          <TouchableOpacity
            onPress={onOpenQuickActions}
            className="w-9 h-9 rounded-full bg-[#f4effc] items-center justify-center shadow-xs"
          >
            <Plus size={16} color="#2a14b4" />
          </TouchableOpacity>
        </View>
        {renderSwitcher()}
      </View>

      <View className="p-6 space-y-6">
        {/* Dad Section */}
        <View className="space-y-3.5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Image
                source={{ uri: people.find((p) => p.id === 'dad')?.avatarUrl }}
                className="w-6.5 h-6.5 rounded-full border border-slate-100"
              />
              <Text className="text-sm font-black text-slate-800">Dad's Medications</Text>
            </View>
            <View className="bg-[#eff4ff] px-2.5 py-0.5 rounded-full">
              <Text className="text-[9px] font-black text-[#2a14b4] uppercase">Adherence 92%</Text>
            </View>
          </View>

          <View className="bg-white border border-[#e2dfd9] rounded-3xl p-5 shadow-sm space-y-4">
            {dadMeds.map((med, idx) => (
              <View
                key={idx}
                className="flex-row items-center justify-between border-b border-slate-50 last:border-0 last:pb-0 pb-3"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-[#f4effc] items-center justify-center">
                    <Pill size={14} color="#2a14b4" />
                  </View>
                  <View>
                    <Text className="text-xs font-black text-slate-800">{med.name}</Text>
                    <Text className="text-[9px] text-slate-400 font-semibold">
                      {med.dose} · {med.time}
                    </Text>
                  </View>
                </View>
                <View
                  className={`px-2 py-0.5 rounded-full ${med.status.includes('Taken') ? 'bg-[#d2f4ef]' : 'bg-slate-100'}`}
                >
                  <Text
                    className={`text-[8px] font-black uppercase ${med.status.includes('Taken') ? 'text-[#006a61]' : 'text-slate-500'}`}
                  >
                    {med.status.includes('Taken') ? '✓ Taken' : med.status}
                  </Text>
                </View>
              </View>
            ))}

            {/* Dad Actions */}
            <View className="flex-row gap-2.5 pt-2 border-t border-slate-50">
              <TouchableOpacity
                onPress={() =>
                  context.showToast('Medication adherence check SMS dispatched to Dad.')
                }
                className="flex-1 bg-white border border-[#dee9fc] py-3.5 rounded-xl flex-row items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <Bell size={12} color="#2a14b4" />
                <Text className="text-[10px] font-black text-[#2a14b4] uppercase">Remind</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/parent/dad')}
                className="flex-1 bg-white border border-[#dee9fc] py-3.5 rounded-xl flex-row items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <Eye size={12} color="#708090" />
                <Text className="text-[10px] font-black text-slate-600 uppercase">View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onOpenQuickActions}
                className="flex-1 bg-white border border-[#dee9fc] py-3.5 rounded-xl flex-row items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <Edit size={12} color="#708090" />
                <Text className="text-[10px] font-black text-slate-600 uppercase">Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Mom Section */}
        <View className="space-y-3.5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Image
                source={{ uri: people.find((p) => p.id === 'mom')?.avatarUrl }}
                className="w-6.5 h-6.5 rounded-full border border-slate-100"
              />
              <Text className="text-sm font-black text-slate-800">Mom's Medications</Text>
            </View>
            <View className="bg-[#eff4ff] px-2.5 py-0.5 rounded-full">
              <Text className="text-[9px] font-black text-[#2a14b4] uppercase">Adherence 98%</Text>
            </View>
          </View>

          <View className="bg-white border border-[#e2dfd9] rounded-3xl p-5 shadow-sm space-y-4">
            {momMeds.map((med, idx) => (
              <View
                key={idx}
                className="flex-row items-center justify-between border-b border-slate-50 last:border-0 last:pb-0 pb-3"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-[#f4effc] items-center justify-center">
                    <Pill size={14} color="#2a14b4" />
                  </View>
                  <View>
                    <Text className="text-xs font-black text-slate-800">{med.name}</Text>
                    <Text className="text-[9px] text-slate-400 font-semibold">
                      {med.dose} · {med.time}
                    </Text>
                  </View>
                </View>
                <View
                  className={`px-2 py-0.5 rounded-full ${med.status.includes('Taken') ? 'bg-[#d2f4ef]' : 'bg-slate-100'}`}
                >
                  <Text
                    className={`text-[8px] font-black uppercase ${med.status.includes('Taken') ? 'text-[#006a61]' : 'text-slate-500'}`}
                  >
                    {med.status.includes('Taken') ? '✓ Taken' : med.status}
                  </Text>
                </View>
              </View>
            ))}

            {/* Mom Actions */}
            <View className="flex-row gap-2.5 pt-2 border-t border-slate-50">
              <TouchableOpacity
                onPress={() =>
                  context.showToast('Medication adherence check SMS dispatched to Mom.')
                }
                className="flex-1 bg-white border border-[#dee9fc] py-3.5 rounded-xl flex-row items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <Bell size={12} color="#2a14b4" />
                <Text className="text-[10px] font-black text-[#2a14b4] uppercase">Remind</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/parent/mom')}
                className="flex-1 bg-white border border-[#dee9fc] py-3.5 rounded-xl flex-row items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <Eye size={12} color="#708090" />
                <Text className="text-[10px] font-black text-slate-600 uppercase">View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onOpenQuickActions}
                className="flex-1 bg-white border border-[#dee9fc] py-3.5 rounded-xl flex-row items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <Edit size={12} color="#708090" />
                <Text className="text-[10px] font-black text-slate-600 uppercase">Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Appointments Section */}
        <View className="space-y-3.5">
          <View className="flex-row items-center gap-2">
            <Calendar size={16} color="#ba1a1a" />
            <Text className="text-xs font-black text-slate-800 uppercase tracking-widest">
              Upcoming Appointments
            </Text>
          </View>

          {/* Dad's Appt */}
          <View className="bg-white border border-[#e2dfd9] rounded-3xl p-5 shadow-sm space-y-3.5">
            <View className="flex-row justify-between items-start">
              <View className="space-y-0.5">
                <Text className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Dad
                </Text>
                <Text className="text-sm font-black text-slate-850">Cardiology</Text>
              </View>
              <View className="bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">
                <Text className="text-[9px] font-black text-[#ba1a1a] uppercase">
                  Tomorrow · 4:00 PM IST
                </Text>
              </View>
            </View>
            <Text className="text-xs text-slate-500 font-bold">
              Apollo Hospital Chennai · Dr. Sharma
            </Text>

            {/* Actions */}
            <View className="flex-row gap-2.5 pt-2 border-t border-slate-50">
              <TouchableOpacity
                onPress={() => router.push('/parent/dad/prepare')}
                className="flex-1 bg-white border border-[#dee9fc] py-3 rounded-xl items-center justify-center active:scale-95 shadow-xs"
              >
                <Text className="text-[9px] font-black text-[#2a14b4] uppercase">Prepare</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => context.showToast('Cardiology appointment details shared.')}
                className="flex-1 bg-white border border-[#dee9fc] py-3 rounded-xl items-center justify-center active:scale-95 shadow-xs"
              >
                <Text className="text-[9px] font-black text-slate-600 uppercase">Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => context.showToast('Caregiver Priya assigned to accompany Dad.')}
                className="flex-1 bg-white border border-[#dee9fc] py-3 rounded-xl items-center justify-center active:scale-95 shadow-xs"
              >
                <Text className="text-[9px] font-black text-slate-600 uppercase font-black">
                  Assign caregiver
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Care Providers Circle Section */}
        <View className="space-y-3.5 mb-12">
          <View className="flex-row items-center gap-2">
            <Users size={16} color="#708090" />
            <Text className="text-xs font-black text-slate-800 uppercase tracking-widest">
              Active Care circle
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-3 py-1"
          >
            {context.familyMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                onPress={() => router.push(`/caregiver/${member.id}`)}
                className="bg-white rounded-3xl p-4 border border-[#e2dfd9] items-center space-y-1.5 w-24 shrink-0 shadow-sm active:scale-95"
              >
                <Image
                  source={{ uri: member.avatarUrl }}
                  className="w-10 h-10 rounded-full border border-slate-100"
                />
                <View className="items-center">
                  <Text
                    className="text-[10px] font-black text-slate-800 text-center"
                    numberOfLines={1}
                  >
                    {member.name}
                  </Text>
                  <Text className="text-[8px] text-slate-400 font-bold text-center">
                    {member.relationship}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};
