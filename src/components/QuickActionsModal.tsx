import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { X, Heart, Sparkles, MessageSquare, Upload, Activity, Calendar } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const medSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dosage: z.string().min(2, 'Dosage must be at least 2 characters')
});

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'ask' | 'family' | 'report') => void;
  onLogVitalSuccess: (vital: { systolic: number; diastolic: number; note: string }) => void;
  onAddMedicationSuccess: (med: { name: string; dosage: string; person: string }) => void;
  onAddContextSuccess: (note: string) => void;
  onAddAppointmentSuccess?: (appt: {
    specialty: string;
    doctor: string;
    date: string;
    time: string;
  }) => void;
  initialTab?: 'menu' | 'log_bp' | 'add_med' | 'add_context' | 'add_appt';
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  onLogVitalSuccess,
  onAddMedicationSuccess,
  onAddContextSuccess,
  onAddAppointmentSuccess,
  initialTab = 'menu'
}) => {
  const [subAction, setSubAction] = useState<
    'menu' | 'log_bp' | 'add_med' | 'add_context' | 'add_appt'
  >('menu');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [medPerson] = useState('Dad (Ramesh)');
  const [contextNote, setContextNote] = useState('');

  // Appointment states
  const [apptSpecialty, setApptSpecialty] = useState('');
  const [apptDoctor, setApptDoctor] = useState('');
  const [apptDate, setApptDate] = useState('Tomorrow');
  const [apptTime, setApptTime] = useState('4:00 PM');

  useEffect(() => {
    if (isOpen) {
      setSubAction(initialTab);
    }
  }, [isOpen, initialTab]);

  // Form Configuration
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(medSchema),
    defaultValues: { name: '', dosage: '' }
  });

  const handleLogVital = () => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    if (sys && dia) {
      onLogVitalSuccess({ systolic: sys, diastolic: dia, note: 'Quick Actions Ingest' });
      setSystolic('');
      setDiastolic('');
      setSubAction('menu');
      onClose();
    }
  };

  const handleAddMed = (data: { name: string; dosage: string }) => {
    onAddMedicationSuccess({ name: data.name, dosage: data.dosage, person: medPerson });
    reset();
    setSubAction('menu');
    onClose();
  };

  const handleAddContext = () => {
    if (contextNote.trim()) {
      onAddContextSuccess(contextNote);
      setContextNote('');
      setSubAction('menu');
      onClose();
    }
  };

  const handleAddAppt = () => {
    if (apptSpecialty.trim() && apptDoctor.trim()) {
      if (onAddAppointmentSuccess) {
        onAddAppointmentSuccess({
          specialty: apptSpecialty,
          doctor: apptDoctor,
          date: apptDate,
          time: apptTime
        });
      }
      setApptSpecialty('');
      setApptDoctor('');
      setSubAction('menu');
      onClose();
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-white rounded-t-[32px] p-6 space-y-5">
          {/* Header */}
          <View className="flex-row justify-between items-center pb-2 border-b border-slate-100">
            <Text className="text-base font-black text-slate-800">Quick Actions Sheet</Text>
            <TouchableOpacity
              onPress={() => {
                setSubAction('menu');
                onClose();
              }}
              className="p-1.5 bg-slate-100 rounded-full"
            >
              <X size={16} color="#464554" />
            </TouchableOpacity>
          </View>

          {subAction === 'menu' && (
            <View className="space-y-4">
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onSelectAction('ask');
                  }}
                  className="flex-1 p-4 bg-[#eff4ff] rounded-2xl items-center border border-[#dee9fc]"
                >
                  <Sparkles size={20} color="#2a14b4" fill="#2a14b4" />
                  <Text className="text-[10px] font-black text-[#2a14b4] uppercase mt-2">
                    Ask AI
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onSelectAction('family');
                  }}
                  className="flex-1 p-4 bg-[#eff4ff] rounded-2xl items-center border border-[#dee9fc]"
                >
                  <MessageSquare size={20} color="#2a14b4" />
                  <Text className="text-[10px] font-black text-[#2a14b4] uppercase mt-2">
                    Chat Group
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onSelectAction('report');
                  }}
                  className="flex-1 p-4 bg-[#eff4ff] rounded-2xl items-center border border-[#dee9fc]"
                >
                  <Upload size={20} color="#2a14b4" />
                  <Text className="text-[10px] font-black text-[#2a14b4] uppercase mt-2">
                    Doc Vault
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="space-y-2">
                <TouchableOpacity
                  onPress={() => setSubAction('log_bp')}
                  className="w-full p-4 bg-white border border-slate-150 rounded-2xl flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <Heart size={16} color="#ba1a1a" fill="#ba1a1a" />
                    <Text className="text-xs font-bold text-slate-800">
                      Log Blood Pressure (Dad)
                    </Text>
                  </View>
                  <Text className="text-xs text-slate-400 font-bold">&rarr;</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSubAction('add_med')}
                  className="w-full p-4 bg-white border border-slate-150 rounded-2xl flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <Activity size={16} color="#006a61" />
                    <Text className="text-xs font-bold text-slate-800">Add New Prescription</Text>
                  </View>
                  <Text className="text-xs text-slate-400 font-bold">&rarr;</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSubAction('add_appt')}
                  className="w-full p-4 bg-white border border-slate-150 rounded-2xl flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <Calendar size={16} color="#ff3b30" />
                    <Text className="text-xs font-bold text-slate-800">Add New Appointment</Text>
                  </View>
                  <Text className="text-xs text-slate-400 font-bold">&rarr;</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSubAction('add_context')}
                  className="w-full p-4 bg-white border border-slate-150 rounded-2xl flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <MessageSquare size={16} color="#4338ca" />
                    <Text className="text-xs font-bold text-slate-800">
                      Log Caregiver Context Note
                    </Text>
                  </View>
                  <Text className="text-xs text-slate-400 font-bold">&rarr;</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {subAction === 'log_bp' && (
            <View className="space-y-4">
              <Text className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Log Dad's Blood Pressure
              </Text>
              <View className="flex-row gap-3">
                <TextInput
                  value={systolic}
                  onChangeText={setSystolic}
                  placeholder="Systolic (120)"
                  keyboardType="numeric"
                  className="flex-1 bg-slate-100 p-3.5 rounded-xl text-xs"
                />
                <TextInput
                  value={diastolic}
                  onChangeText={setDiastolic}
                  placeholder="Diastolic (80)"
                  keyboardType="numeric"
                  className="flex-1 bg-slate-100 p-3.5 rounded-xl text-xs"
                />
              </View>
              <TouchableOpacity
                onPress={handleLogVital}
                className="w-full py-4 bg-[#ba1a1a] rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-black text-xs uppercase tracking-wider">
                  Confirm Log
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {subAction === 'add_med' && (
            <View className="space-y-4">
              <Text className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Add Prescription
              </Text>

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Medication name (e.g. Lipitor)"
                    className="w-full bg-slate-100 p-3.5 rounded-xl text-xs text-slate-800"
                  />
                )}
              />
              {errors.name && (
                <Text className="text-rose-800 text-[10px] font-black uppercase pl-1">
                  ⚠️ {errors.name.message}
                </Text>
              )}

              <Controller
                control={control}
                name="dosage"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Dosage (e.g. 10mg morning)"
                    className="w-full bg-slate-100 p-3.5 rounded-xl text-xs text-slate-800"
                  />
                )}
              />
              {errors.dosage && (
                <Text className="text-rose-800 text-[10px] font-black uppercase pl-1">
                  ⚠️ {errors.dosage.message}
                </Text>
              )}

              <TouchableOpacity
                onPress={handleSubmit(handleAddMed)}
                className="w-full py-4 bg-[#006a61] rounded-2xl items-center justify-center active:scale-95"
              >
                <Text className="text-white font-black text-xs uppercase tracking-wider">
                  Confirm Medication
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {subAction === 'add_appt' && (
            <View className="space-y-4">
              <Text className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Add New Appointment
              </Text>

              <TextInput
                value={apptSpecialty}
                onChangeText={setApptSpecialty}
                placeholder="Specialty / Department (e.g. Cardiology)"
                className="w-full bg-slate-100 p-3.5 rounded-xl text-xs text-slate-800"
              />

              <TextInput
                value={apptDoctor}
                onChangeText={(apptDoctor) => setApptDoctor(apptDoctor)}
                placeholder="Doctor Name (e.g. Dr. Sharma)"
                className="w-full bg-slate-100 p-3.5 rounded-xl text-xs text-slate-800"
              />

              <View className="flex-row gap-3">
                <TextInput
                  value={apptDate}
                  onChangeText={setApptDate}
                  placeholder="Date (e.g. Tomorrow)"
                  className="flex-1 bg-slate-100 p-3.5 rounded-xl text-xs text-slate-800"
                />
                <TextInput
                  value={apptTime}
                  onChangeText={setApptTime}
                  placeholder="Time (e.g. 4:00 PM)"
                  className="flex-1 bg-slate-100 p-3.5 rounded-xl text-xs text-slate-800"
                />
              </View>

              <TouchableOpacity
                onPress={handleAddAppt}
                className="w-full py-4 bg-[#ff3b30] rounded-2xl items-center justify-center active:scale-95"
              >
                <Text className="text-white font-black text-xs uppercase tracking-wider">
                  Confirm Appointment
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {subAction === 'add_context' && (
            <View className="space-y-4">
              <Text className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Caregiver Context Note
              </Text>
              <TextInput
                value={contextNote}
                onChangeText={setContextNote}
                placeholder="e.g. Checked Ramesh sir, took walk inside verandas today."
                multiline
                className="w-full bg-slate-100 p-3.5 rounded-xl text-xs text-slate-800 h-20"
              />
              <TouchableOpacity
                onPress={handleAddContext}
                className="w-full py-4 bg-[#4338ca] rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-black text-xs uppercase tracking-wider">
                  Inject Context
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
