import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import {
  ArrowLeft,
  Search,
  X,
  Mic,
  Pill,
  Calendar,
  History,
  Activity,
  Upload,
  CheckCircle2
} from 'lucide-react-native';
import { HealthRecordItem, DocumentItem } from '../types';
import { DocumentVault } from './DocumentVault';

interface SearchRecordsScreenProps {
  records: HealthRecordItem[];
  recentSearches: string[];
  onBack: () => void;
  onSelectRecord: (record: HealthRecordItem) => void;
  onAskAIQuery: (query: string) => void;
  onClearRecentSearches: () => void;
  onRemoveRecentSearch: (search: string) => void;
  documents: DocumentItem[];
  onAddDocument: (doc: DocumentItem) => void;
  showToast: (msg: string) => void;
}

interface TimelineItem {
  id: string;
  dateGroup: 'Today' | 'Yesterday' | 'Aug 14' | 'Aug 12' | string;
  category: 'medication' | 'lab' | 'vital' | 'appointment' | 'document' | 'symptom';
  title: string;
  subtitle: string;
  time: string;
}

const timelineData: TimelineItem[] = [
  {
    id: 'time-1',
    dateGroup: 'Today',
    category: 'medication',
    title: 'Medication taken',
    subtitle: 'Atorvastatin 20mg • Ramesh Kumar',
    time: '8:05 AM'
  },
  {
    id: 'time-2',
    dateGroup: 'Yesterday',
    category: 'vital',
    title: 'Blood pressure recorded',
    subtitle: '142/88 mmHg • Omron Device',
    time: '3:15 PM'
  },
  {
    id: 'time-3',
    dateGroup: 'Yesterday',
    category: 'appointment',
    title: 'Doctor appointment',
    subtitle: 'Cardiology Consultation • Dr. Sharma',
    time: '11:30 AM'
  },
  {
    id: 'time-4',
    dateGroup: 'Aug 14',
    category: 'document',
    title: 'Lab report uploaded',
    subtitle: 'Apollo Fasting Blood Panel scan',
    time: '5:40 PM'
  },
  {
    id: 'time-5',
    dateGroup: 'Aug 12',
    category: 'symptom',
    title: 'Check-in completed',
    subtitle: 'Dad reported feeling fine & hydrated',
    time: '9:00 AM'
  }
];

export const SearchRecordsScreen: React.FC<SearchRecordsScreenProps> = ({
  records,
  recentSearches,
  onBack,
  onSelectRecord,
  onAskAIQuery,
  onClearRecentSearches,
  onRemoveRecentSearch,
  documents,
  onAddDocument,
  showToast
}) => {
  const [activeSegment, setActiveSegment] = useState<'search' | 'vault'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [timelineFilter, setTimelineFilter] = useState<
    'all' | 'medication' | 'lab' | 'vital' | 'appointment' | 'document' | 'symptom'
  >('all');

  const timelineFilters = [
    { id: 'all', label: 'All' },
    { id: 'medication', label: 'Medications' },
    { id: 'lab', label: 'Labs' },
    { id: 'vital', label: 'Vitals' },
    { id: 'appointment', label: 'Appointments' },
    { id: 'document', label: 'Documents' },
    { id: 'symptom', label: 'Symptoms' }
  ] as const;

  const filteredTimeline = useMemo(() => {
    if (timelineFilter === 'all') return timelineData;
    return timelineData.filter((item) => item.category === timelineFilter);
  }, [timelineFilter]);

  // Grouped timeline helper
  const groupedTimeline = useMemo(() => {
    const groups: { [key: string]: TimelineItem[] } = {};
    filteredTimeline.forEach((item) => {
      if (!groups[item.dateGroup]) {
        groups[item.dateGroup] = [];
      }
      groups[item.dateGroup].push(item);
    });
    return groups;
  }, [filteredTimeline]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesCategory = timelineFilter !== 'all' ? rec.category === timelineFilter : true;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;
      const matchesText =
        rec.title.toLowerCase().includes(query) ||
        (rec.subtitle || '').toLowerCase().includes(query) ||
        (rec.details && rec.details.toLowerCase().includes(query)) ||
        (rec.tag && rec.tag.toLowerCase().includes(query));
      return matchesCategory && matchesText;
    });
  }, [records, timelineFilter, searchQuery]);

  if (activeSegment === 'vault') {
    return (
      <View className="flex-1 bg-[#fbfaf7]">
        {/* Vault Header Segment */}
        <View className="bg-[#fbfaf7] border-b border-[#e2dfd9] pt-4 pb-2 px-5 space-y-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onBack} className="p-2 bg-slate-100 rounded-full">
              <ArrowLeft size={16} color="#464554" />
            </TouchableOpacity>
            <Text className="text-base font-black text-[#2a14b4]">Health Records</Text>
            <View className="w-9 h-9" />
          </View>

          <View className="flex-row bg-[#eff4ff] p-0.5 rounded-full border border-[#dee9fc]">
            <TouchableOpacity
              onPress={() => setActiveSegment('search')}
              className="flex-1 py-2 rounded-full items-center justify-center"
            >
              <Text className="text-xs font-bold text-[#464554]">Health Timeline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveSegment('vault')}
              className="flex-1 py-2 rounded-full items-center justify-center bg-[#4338ca]"
            >
              <Text className="text-xs font-black text-white">Document Vault</Text>
            </TouchableOpacity>
          </View>
        </View>

        <DocumentVault
          documents={documents}
          onAddDocument={onAddDocument}
          onAskAI={onAskAIQuery}
          showToast={showToast}
        />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#fbfaf7] pb-24">
      {/* Search Header Segment */}
      <View className="bg-[#fbfaf7] border-b border-[#e2dfd9] pt-4 pb-3 px-5 space-y-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onBack} className="p-2 bg-slate-100 rounded-full">
            <ArrowLeft size={16} color="#464554" />
          </TouchableOpacity>
          <Text className="text-base font-black text-[#2a14b4]">Health Timeline</Text>
          <View className="w-9 h-9" />
        </View>

        <View className="flex-row bg-[#eff4ff] p-0.5 rounded-full border border-[#dee9fc]">
          <TouchableOpacity
            onPress={() => setActiveSegment('search')}
            className="flex-1 py-2 rounded-full items-center justify-center bg-[#4338ca]"
          >
            <Text className="text-xs font-black text-white">Health Timeline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveSegment('vault')}
            className="flex-1 py-2 rounded-full items-center justify-center"
          >
            <Text className="text-xs font-bold text-[#464554]">Document Vault</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="p-5 space-y-6">
        {/* Search Input bar */}
        <View className="relative flex-row items-center bg-slate-100 rounded-2xl px-4 py-1 border border-slate-100 focus:border-[#4338ca]">
          <Search size={16} color="#777586" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search timeline & reports..."
            className="flex-1 px-3 py-3.5 text-xs text-slate-800"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={14} color="#ba1a1a" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => onAskAIQuery('Search all recent clinical notes and medications')}
            >
              <Mic size={14} color="#777586" />
            </TouchableOpacity>
          )}
        </View>

        {/* Timeline Horizontal Filters */}
        <View className="space-y-2">
          <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Filters
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2.5 py-1"
          >
            {timelineFilters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setTimelineFilter(filter.id)}
                className={`px-4 py-2 rounded-full border ${
                  timelineFilter === filter.id
                    ? 'bg-[#2a14b4] border-[#2a14b4]'
                    : 'bg-white border-[#e2dfd9]'
                }`}
              >
                <Text
                  className={`text-xs font-black ${
                    timelineFilter === filter.id ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results for active search queries */}
        {searchQuery.trim().length > 0 && (
          <View className="space-y-3">
            <Text className="text-xs font-black text-slate-800">
              Filtered Records ({filteredRecords.length})
            </Text>
            {filteredRecords.length === 0 ? (
              <View className="bg-white rounded-2xl p-6 border border-slate-100 items-center justify-center">
                <Text className="text-xs font-bold text-slate-400">No matching records found.</Text>
              </View>
            ) : (
              <View className="space-y-2.5">
                {filteredRecords.map((rec) => (
                  <TouchableOpacity
                    key={rec.id}
                    onPress={() => onSelectRecord(rec)}
                    className="bg-white rounded-2xl p-4 border border-slate-100 flex-row gap-3 items-start"
                  >
                    <View
                      className={`w-8 h-8 rounded-full ${rec.iconBgColor || 'bg-slate-100'} items-center justify-center shrink-0`}
                    >
                      <Activity size={14} color="#4338ca" />
                    </View>
                    <View className="flex-1 space-y-1">
                      <View className="flex-row justify-between items-start">
                        <Text className="text-xs font-black text-slate-900 truncate max-w-[70%]">
                          {rec.title}
                        </Text>
                        {rec.tag && (
                          <View className="bg-[#eff4ff] px-2 py-0.5 rounded-full shrink-0">
                            <Text className="text-[8px] font-black text-[#4338ca] uppercase">
                              {rec.tag}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                        {rec.subtitle}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* APPROACHABLE TIMELINE BLOCK */}
        {!searchQuery && (
          <View className="space-y-4">
            <Text className="text-sm font-black text-[#121c2a] uppercase tracking-wider">
              Timeline
            </Text>

            {Object.keys(groupedTimeline).length === 0 ? (
              <View className="bg-white rounded-2xl p-6 border border-[#e2dfd9] items-center justify-center">
                <Text className="text-xs font-bold text-slate-400">
                  No items match this filter.
                </Text>
              </View>
            ) : (
              <View className="space-y-6 relative pl-3">
                {/* Visual Timeline vertical line */}
                <View className="absolute left-[20px] top-[10px] bottom-[10px] w-0.5 bg-[#e2dfd9]" />

                {Object.keys(groupedTimeline).map((date) => (
                  <View key={date} className="space-y-3.5">
                    {/* Date Heading */}
                    <View className="flex-row items-center gap-2">
                      <View className="w-4 h-4 rounded-full bg-[#fbfaf7] border-[3px] border-[#2a14b4] z-10" />
                      <Text className="text-xs font-black text-slate-800">{date}</Text>
                    </View>

                    {/* Timeline group items */}
                    <View className="space-y-3 pl-6">
                      {groupedTimeline[date].map((item) => {
                        const iconColor =
                          item.category === 'medication'
                            ? '#2a14b4'
                            : item.category === 'vital'
                              ? '#ba1a1a'
                              : item.category === 'appointment'
                                ? '#d97706'
                                : item.category === 'document'
                                  ? '#006a61'
                                  : '#708090';

                        return (
                          <View
                            key={item.id}
                            className="bg-white rounded-2xl p-4 border border-[#e2dfd9] flex-row items-center justify-between shadow-xs"
                          >
                            <View className="flex-row items-center gap-3.5">
                              <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center border border-slate-100">
                                {item.category === 'medication' ? (
                                  <Pill size={14} color={iconColor} />
                                ) : item.category === 'vital' ? (
                                  <Activity size={14} color={iconColor} />
                                ) : item.category === 'appointment' ? (
                                  <Calendar size={14} color={iconColor} />
                                ) : item.category === 'document' ? (
                                  <Upload size={14} color={iconColor} />
                                ) : (
                                  <CheckCircle2 size={14} color={iconColor} />
                                )}
                              </View>
                              <View className="space-y-0.5">
                                <Text className="text-xs font-black text-slate-800">
                                  {item.title}
                                </Text>
                                <Text className="text-[10px] text-slate-400 font-semibold">
                                  {item.subtitle}
                                </Text>
                              </View>
                            </View>
                            <Text className="text-[9px] font-black text-slate-400">
                              {item.time}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Recent Searches */}
        {!searchQuery && (
          <View className="space-y-3 pb-12">
            <View className="flex-row items-center justify-between border-b border-[#e2dfd9] pb-2">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Recent Searches
              </Text>
              {recentSearches.length > 0 && (
                <TouchableOpacity onPress={onClearRecentSearches}>
                  <Text className="text-xs font-bold text-[#2a14b4]">Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {recentSearches.length === 0 ? (
              <Text className="text-[10px] text-slate-400 italic font-bold">
                No recent searches.
              </Text>
            ) : (
              <View className="space-y-2">
                {recentSearches.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSearchQuery(item)}
                    className="bg-white rounded-2xl p-3 border border-slate-50 flex-row justify-between items-center"
                  >
                    <View className="flex-row items-center gap-3">
                      <History size={14} color="#777586" />
                      <Text className="text-xs font-bold text-slate-800">{item}</Text>
                    </View>
                    <TouchableOpacity onPress={() => onRemoveRecentSearch(item)}>
                      <X size={14} color="#777586" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
