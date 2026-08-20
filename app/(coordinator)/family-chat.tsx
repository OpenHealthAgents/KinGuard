import { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { AppContext } from '../../src/store/AppContext';
import { DeviceFrame } from '../../src/components/DeviceFrame';
import { SimulatorControls } from '../../src/components/SimulatorControls';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Sparkles, FileText, Calendar } from 'lucide-react-native';

export default function FamilyCommunicationRoute() {
  const context = useContext(AppContext);
  const router = useRouter();

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'Anjali',
      role: 'Primary coordinator',
      avatarColor: '#2a14b4',
      message: 'Dad has his cardiology appointment tomorrow.',
      time: '10:15 AM'
    },
    {
      sender: 'Priya',
      role: 'Caregiver',
      avatarColor: '#059669',
      message: "I'll take him.",
      time: '10:18 AM'
    },
    {
      sender: 'KinGuard',
      role: 'System Copilot',
      avatarColor: '#d97706',
      message: "Dad's latest medication and BP summary is ready.",
      time: '10:20 AM',
      isSystem: true
    }
  ]);

  if (!context) return null;

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        sender: 'Anjali',
        role: 'Primary coordinator',
        avatarColor: '#2a14b4',
        message: chatInput,
        time: 'Just now'
      }
    ]);
    setChatInput('');
    context.showToast('Message sent to Family Circle.');
  };

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
            <Text className="text-lg font-black text-[#121c2a]">Family Communication</Text>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Care circle Chat Log
            </Text>
          </View>
        </View>

        {/* Chat Feed */}
        <ScrollView className="flex-1 px-6 pt-4 space-y-4">
          <View className="space-y-4 pb-24">
            {messages.map((msg, idx) => {
              if (msg.isSystem) {
                return (
                  <View
                    key={idx}
                    className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-5 space-y-3.5"
                  >
                    <View className="flex-row items-center gap-2">
                      <Sparkles size={14} color="#d97706" fill="#d97706" />
                      <Text className="text-[10px] font-black text-[#d97706] uppercase tracking-wider">
                        KinGuard Copilot
                      </Text>
                    </View>
                    <Text className="text-xs font-semibold text-slate-700 leading-relaxed">
                      {msg.message}
                    </Text>

                    {/* Special In-bubble CTA Buttons */}
                    <View className="flex-row gap-2 pt-1">
                      <TouchableOpacity
                        onPress={() => router.push('/parent/dad/summary')}
                        className="flex-1 bg-white border border-amber-200 py-2.5 rounded-xl flex-row items-center justify-center gap-1 active:scale-95 shadow-xs"
                      >
                        <FileText size={10} color="#d97706" />
                        <Text className="text-[9px] font-black text-[#d97706] uppercase">
                          View summary
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => router.push('/parent/dad/prepare')}
                        className="flex-1 bg-white border border-amber-200 py-2.5 rounded-xl flex-row items-center justify-center gap-1 active:scale-95 shadow-xs"
                      >
                        <Calendar size={10} color="#d97706" />
                        <Text className="text-[9px] font-black text-[#d97706] uppercase">
                          Prepare appointment
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }

              const isMe = msg.sender === 'Anjali';
              return (
                <View
                  key={idx}
                  className={`flex-row gap-3 ${isMe ? 'flex-row-reverse' : ''} items-start`}
                >
                  {/* Avatar Initials */}
                  <View
                    style={{ backgroundColor: msg.avatarColor }}
                    className="w-8 h-8 rounded-full items-center justify-center shrink-0 shadow-xs"
                  >
                    <Text className="text-white text-xs font-black">{msg.sender.charAt(0)}</Text>
                  </View>

                  <View className={`space-y-1 max-w-[75%] ${isMe ? 'items-end' : ''}`}>
                    <View className="flex-row items-center gap-1.5">
                      <Text className="text-[9px] font-black text-slate-800">{msg.sender}</Text>
                      <Text className="text-[8px] text-slate-400 font-bold">{msg.time}</Text>
                      {isMe && <Text className="text-[9px] text-[#3b82f6] font-black">✓✓</Text>}
                    </View>
                    <View
                      className={`p-4 rounded-3xl ${
                        isMe
                          ? 'bg-[#2a14b4] rounded-tr-none'
                          : 'bg-white border border-[#e2dfd9] rounded-tl-none'
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold leading-relaxed ${
                          isMe ? 'text-white' : 'text-slate-700'
                        }`}
                      >
                        {msg.message}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Chat input box at the bottom */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#e2dfd9] p-4 flex-row items-center gap-2">
          <TextInput
            placeholder="Message Care circle..."
            value={chatInput}
            onChangeText={setChatInput}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-full px-4 py-3 text-xs text-slate-800 font-semibold"
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            className="w-10 h-10 rounded-full bg-[#2a14b4] items-center justify-center active:scale-95"
          >
            <Send size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>
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
