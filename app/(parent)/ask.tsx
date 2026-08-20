import { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppContext } from '../../src/store/AppContext';
import { ParentBottomNavBar } from '../../src/components/Navigation';
import { DeviceFrame } from '../../src/components/DeviceFrame';
import { SimulatorControls } from '../../src/components/SimulatorControls';
import { useRouter } from 'expo-router';
import { Mic, Volume2, Sparkles, HelpCircle } from 'lucide-react-native';

export default function ParentVoiceRoute() {
  const context = useContext(AppContext);
  const router = useRouter();
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [aiReply, setAiReply] = useState<string | null>(null);

  if (!context) return null;

  const promptExamples = [
    {
      text: 'What medicines do I take tonight?',
      reply:
        'You have Metformin 500mg scheduled at 8:00 PM tonight. Amlodipine is already completed.'
    },
    {
      text: 'When is my appointment?',
      reply:
        'Your next visit is tomorrow at 4:00 PM with Dr. Sharma for a Cardiology consultation at Apollo Hospital.'
    },
    {
      text: 'What is this medicine?',
      reply:
        'Amlodipine supports your blood pressure, while Metformin helps control daily blood sugar levels.'
    },
    {
      text: 'What does my report mean?',
      reply:
        'Your EKG report shows normal sinus rhythm. All indicators reside in benign, normal ranges.'
    },
    {
      text: 'I want to tell Anjali something.',
      reply:
        'Sure, Dad! Just speak after the beep, and I will dispatch a message alert to Anjali in London.'
    }
  ];

  const handleSelectPrompt = (txt: string, rep: string) => {
    setLoading(true);
    setTranscript(txt);
    setAiReply(null);

    setTimeout(() => {
      setLoading(false);
      setAiReply(rep);
      context.showToast('KinGuard co-pilot answered query.');
    }, 800);
  };

  const startRecord = () => {
    setRecording(true);
    setTranscript(null);
    setAiReply(null);
    context.showToast('Listening to Ramesh sir...');

    setTimeout(() => {
      setRecording(false);
      setLoading(true);
      setTranscript('What medicines do I take tonight?');

      setTimeout(() => {
        setLoading(false);
        setAiReply(
          'You have Metformin 500mg scheduled at 8:00 PM. Amlodipine was taken this morning.'
        );
        context.showToast('Answered voice query.');
      }, 1000);
    }, 3000);
  };

  return (
    <DeviceFrame>
      <View className="flex-1 relative bg-[#fffbeb]">
        {/* Header */}
        <View className="bg-[#d97706] pt-6 pb-5 px-6 border-b-4 border-[#b45309] space-y-1">
          <Text className="text-2xl font-black text-white uppercase tracking-wider">
            Ask KinGuard
          </Text>
          <Text className="text-xs font-bold text-[#fef3c7] uppercase tracking-widest">
            “Ask anything about Mom & Dad.”
          </Text>
        </View>

        <ScrollView className="flex-1 p-6 space-y-6">
          {/* Status Display Area */}
          <View className="bg-white border-4 border-amber-300 rounded-[32px] p-6 shadow-xs min-h-[140px] justify-center">
            {recording ? (
              <View className="items-center space-y-2 py-4">
                <Text className="text-xl font-black text-[#d97706] animate-pulse uppercase tracking-wider">
                  Listening to Dad...
                </Text>
                <Text className="text-xs text-slate-400 font-semibold">Speak clearly now sir</Text>
              </View>
            ) : loading ? (
              <View className="items-center space-y-3 py-4">
                <ActivityIndicator size="small" color="#d97706" />
                <Text className="text-xs font-black text-slate-500 uppercase">
                  KinGuard is thinking...
                </Text>
              </View>
            ) : transcript ? (
              <View className="space-y-4">
                <View className="space-y-1">
                  <Text className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    You asked
                  </Text>
                  <Text className="text-sm font-black text-slate-850">"{transcript}"</Text>
                </View>
                {aiReply && (
                  <View className="pt-3 border-t border-slate-100 space-y-1">
                    <View className="flex-row items-center gap-1.5">
                      <Sparkles size={12} color="#2a14b4" fill="#2a14b4" />
                      <Text className="text-[10px] font-black text-[#2a14b4] uppercase tracking-wider">
                        KinGuard AI
                      </Text>
                    </View>
                    <Text className="text-xs font-bold text-slate-700 leading-relaxed">
                      {aiReply}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="items-center py-4 space-y-2">
                <Text className="text-base font-black text-[#5c3e03] text-center leading-relaxed">
                  How can I help you today, Dad?
                </Text>
                <Text className="text-[11px] font-semibold text-slate-400 text-center leading-snug">
                  Choose a question below or hold the big microphone to ask anything.
                </Text>
              </View>
            )}
          </View>

          {/* Prompts list grid */}
          <View className="space-y-3">
            <Text className="text-xs font-black text-slate-500 uppercase tracking-widest">
              Tap a question:
            </Text>
            <View className="space-y-2.5">
              {promptExamples.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSelectPrompt(item.text, item.reply)}
                  className="w-full bg-white border-2 border-amber-200 p-4 rounded-2xl flex-row items-center gap-3 active:scale-98 shadow-xs"
                >
                  <HelpCircle size={16} color="#d97706" />
                  <Text className="text-xs font-black text-slate-700 leading-snug flex-1">
                    {item.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Large Microphone Container */}
          <View className="items-center py-6">
            <TouchableOpacity
              onPress={startRecord}
              disabled={recording || loading}
              activeOpacity={0.8}
              className={`w-28 h-28 rounded-full items-center justify-center border-4 border-white shadow-xl ${
                recording ? 'bg-red-500' : 'bg-blue-500'
              } active:scale-95`}
            >
              {recording ? (
                <Volume2 size={40} color="#ffffff" />
              ) : (
                <Mic size={40} color="#ffffff" />
              )}
            </TouchableOpacity>
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3.5">
              {recording ? 'TAP TO COMPLETE' : 'TAP MICROPHONE TO SPEAK'}
            </Text>
          </View>

          <View className="h-28" />
        </ScrollView>

        <ParentBottomNavBar
          activeTab="ask"
          onTabChange={(tab) => {
            if (tab === 'home') router.push('/(parent)');
            else if (tab === 'medicines') router.push('/(parent)/medicines');
            else if (tab === 'profile') router.push('/(parent)/profile');
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
