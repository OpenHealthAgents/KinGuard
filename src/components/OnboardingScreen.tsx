import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import {
  ShieldCheck,
  Heart,
  Compass,
  Smartphone,
  CheckCircle2,
  MapPin,
  Users,
  Send
} from 'lucide-react-native';

interface OnboardingScreenProps {
  onComplete: (config: { userLoc: string; parentLoc: string }) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userLoc, setUserLoc] = useState('UK');
  const [parentLoc, setParentLoc] = useState('India');
  const [careTarget, setCareTarget] = useState<'Mom' | 'Dad' | 'Both'>('Both');

  // Parent details
  const [parentName, setParentName] = useState('');
  const [parentAge, setParentAge] = useState('');
  const [parentCity, setParentCity] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  // Invite parent channel
  const [inviteMethod, setInviteMethod] = useState<'WhatsApp' | 'SMS' | 'Email'>('WhatsApp');

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      onComplete({ userLoc, parentLoc });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#fbfaf7] px-6 py-12">
      <View className="items-center justify-center py-6 space-y-4">
        {/* Step Indicator */}
        <View className="flex-row justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <View
              key={s}
              className={`w-4.5 h-1.5 rounded-full ${s === step ? 'bg-[#2a14b4]' : 'bg-[#e2dfd9]'}`}
            />
          ))}
        </View>

        {/* STEP 1: #Welcome */}
        {step === 1 && (
          <View className="space-y-6 items-center w-full py-4">
            <View className="w-16 h-16 rounded-full bg-[#f4effc] items-center justify-center shadow-sm">
              <Heart size={36} color="#2a14b4" fill="#2a14b4" />
            </View>
            <Text className="text-2xl font-black text-[#121c2a] text-center leading-tight">
              KinGuard
            </Text>
            <Text className="text-lg font-black text-slate-800 text-center leading-relaxed px-2">
              “Be there for your parents, even when you're far away.”
            </Text>
            <Text className="text-xs font-semibold text-slate-500 text-center leading-normal px-4">
              Cross-border health coordination that connects adult children living abroad with their
              ageing parents and local caregivers in India.
            </Text>
          </View>
        )}

        {/* STEP 2: #Where do you live? */}
        {step === 2 && (
          <View className="space-y-6 w-full py-2">
            <View className="items-center">
              <Compass size={48} color="#2a14b4" />
            </View>
            <Text className="text-xl font-black text-[#121c2a] text-center">
              Where do you live?
            </Text>
            <Text className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">
              Child's current country of residence
            </Text>

            <View className="space-y-3.5 mt-2">
              {['UK', 'UAE', 'USA', 'Singapore', 'Canada'].map((country) => (
                <TouchableOpacity
                  key={country}
                  onPress={() => setUserLoc(country)}
                  className={`p-4 rounded-2xl border flex-row items-center justify-between ${
                    userLoc === country
                      ? 'border-[#2a14b4] bg-[#4338ca]/5'
                      : 'border-[#dee9fc] bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-black ${userLoc === country ? 'text-[#2a14b4]' : 'text-slate-800'}`}
                  >
                    {country === 'UK'
                      ? 'United Kingdom (London)'
                      : country === 'UAE'
                        ? 'United Arab Emirates (Dubai)'
                        : country === 'USA'
                          ? 'United States'
                          : country}
                  </Text>
                  {userLoc === country && <CheckCircle2 size={16} color="#2b14b5" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 3: #Where do your parents live? */}
        {step === 3 && (
          <View className="space-y-6 w-full py-2">
            <View className="items-center">
              <MapPin size={48} color="#2a14b4" />
            </View>
            <Text className="text-xl font-black text-[#121c2a] text-center">
              Where do your parents live?
            </Text>
            <Text className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">
              Primary telemetry source region
            </Text>

            <TouchableOpacity
              onPress={() => setParentLoc('India')}
              className="p-5 rounded-2xl border border-[#2a14b4] bg-[#4338ca]/5 flex-row items-center justify-between mt-2"
            >
              <View className="space-y-1">
                <Text className="text-sm font-black text-[#2a14b4]">India</Text>
                <Text className="text-[10px] font-bold text-slate-500">
                  Fully optimized timezone mapping active
                </Text>
              </View>
              <CheckCircle2 size={20} color="#2b14b5" />
            </TouchableOpacity>

            <Text className="text-[10px] text-slate-400 text-center font-bold px-4 leading-normal mt-4">
              KinGuard is currently optimized for cross-border care delivery between the West/Gulf
              regions and parents residing in India.
            </Text>
          </View>
        )}

        {/* STEP 4: #Who do you care for? */}
        {step === 4 && (
          <View className="space-y-6 w-full py-2">
            <View className="items-center">
              <Users size={48} color="#2a14b4" />
            </View>
            <Text className="text-xl font-black text-[#121c2a] text-center">
              Who do you care for?
            </Text>
            <Text className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">
              Profile checklist configuration
            </Text>

            <View className="flex-row gap-3.5 mt-2">
              {(['Mom', 'Dad', 'Both'] as const).map((target) => (
                <TouchableOpacity
                  key={target}
                  onPress={() => setCareTarget(target)}
                  className={`flex-1 p-5 rounded-2xl border items-center space-y-2 ${
                    careTarget === target
                      ? 'border-[#2a14b4] bg-[#4338ca]/5'
                      : 'border-[#dee9fc] bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-black ${careTarget === target ? 'text-[#2a14b4]' : 'text-slate-800'}`}
                  >
                    {target}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 5: #Add parent */}
        {step === 5 && (
          <View className="space-y-4 w-full py-2">
            <View className="items-center">
              <Smartphone size={48} color="#2a14b4" />
            </View>
            <Text className="text-xl font-black text-[#121c2a] text-center">
              Add Parent details
            </Text>

            <View className="space-y-3.5 mt-2">
              <View className="space-y-1.5">
                <Text className="text-[10px] font-black text-slate-500 uppercase">Full Name</Text>
                <TextInput
                  value={parentName}
                  onChangeText={setParentName}
                  placeholder="e.g. Ramesh Kumar"
                  className="bg-white border border-[#dee9fc] rounded-xl px-4 py-3.5 text-xs text-slate-800"
                />
              </View>

              <View className="space-y-1.5">
                <Text className="text-[10px] font-black text-slate-500 uppercase">Age</Text>
                <TextInput
                  value={parentAge}
                  onChangeText={setParentAge}
                  placeholder="e.g. 68"
                  keyboardType="numeric"
                  className="bg-white border border-[#dee9fc] rounded-xl px-4 py-3.5 text-xs text-slate-800"
                />
              </View>

              <View className="space-y-1.5">
                <Text className="text-[10px] font-black text-slate-500 uppercase">
                  City (India)
                </Text>
                <TextInput
                  value={parentCity}
                  onChangeText={setParentCity}
                  placeholder="e.g. Chennai"
                  className="bg-white border border-[#dee9fc] rounded-xl px-4 py-3.5 text-xs text-slate-800"
                />
              </View>

              <View className="space-y-1.5">
                <Text className="text-[10px] font-black text-slate-500 uppercase">
                  Phone Number
                </Text>
                <TextInput
                  value={parentPhone}
                  onChangeText={setParentPhone}
                  placeholder="+91 XXXXX XXXXX"
                  keyboardType="phone-pad"
                  className="bg-white border border-[#dee9fc] rounded-xl px-4 py-3.5 text-xs text-slate-800"
                />
              </View>
            </View>
          </View>
        )}

        {/* STEP 6: #Invite parent */}
        {step === 6 && (
          <View className="space-y-6 w-full py-2">
            <View className="items-center">
              <Send size={48} color="#2a14b4" />
            </View>
            <Text className="text-xl font-black text-[#121c2a] text-center">Invite Parent</Text>
            <Text className="text-xs text-slate-500 text-center leading-normal px-2">
              Send Ramesh a reassuring invitation message to link their wearable health sensors.
            </Text>

            <View className="space-y-3.5 mt-2">
              {(['WhatsApp', 'SMS', 'Email'] as const).map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setInviteMethod(method)}
                  className={`p-4.5 rounded-2xl border flex-row items-center justify-between ${
                    inviteMethod === method
                      ? 'border-[#2a14b4] bg-[#4338ca]/5'
                      : 'border-[#dee9fc] bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-black ${inviteMethod === method ? 'text-[#2a14b4]' : 'text-slate-800'}`}
                  >
                    Invite via {method}
                  </Text>
                  {inviteMethod === method && <CheckCircle2 size={16} color="#2b14b5" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 7: #Complete */}
        {step === 7 && (
          <View className="space-y-6 items-center w-full py-4">
            <View className="w-16 h-16 rounded-full bg-emerald-50 items-center justify-center shadow-sm">
              <ShieldCheck size={36} color="#059669" />
            </View>
            <Text className="text-2xl font-black text-[#121c2a] text-center">Connected!</Text>
            <Text className="text-lg font-black text-slate-800 text-center leading-relaxed px-4">
              “You're now connected to Mom & Dad.”
            </Text>
            <Text className="text-xs font-semibold text-slate-500 text-center leading-normal px-6">
              Ramesh's blood pressure monitor and Lakshmi's glucose levels will now transmit updates
              automatically. Anjali is active as primary coordinator.
            </Text>
          </View>
        )}

        {/* Navigation Actions */}
        <View className="w-full flex-row gap-3 mt-8">
          {step > 1 && (
            <TouchableOpacity
              onPress={handleBack}
              className="flex-1 py-4.5 bg-white border border-slate-200 rounded-2xl items-center justify-center shadow-sm"
            >
              <Text className="text-slate-700 font-black text-xs uppercase tracking-wider">
                Back
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleNext}
            className={`py-4.5 rounded-2xl items-center justify-center shadow-md active:scale-98 ${
              step > 1 ? 'flex-2 bg-[#2a14b4]' : 'w-full bg-[#2a14b4]'
            }`}
          >
            <Text className="text-white font-black text-xs uppercase tracking-wider px-6">
              {step === 7 ? 'Connect Parents' : 'Next Step'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
