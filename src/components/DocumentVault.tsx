import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput
} from 'react-native';
import {
  FolderOpen,
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  MessageSquare,
  Share2,
  Camera,
  Image as ImageIcon,
  Mic,
  X,
  AlertTriangle
} from 'lucide-react-native';
import { DocumentItem } from '../types';

interface DocumentVaultProps {
  documents: DocumentItem[];
  onAddDocument: (doc: DocumentItem) => void;
  onAskAI: (query: string) => void;
  showToast: (msg: string) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  documents,
  onAddDocument,
  onAskAI,
  showToast
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Workflow states
  const [workflowStep, setWorkflowStep] = useState<
    'idle' | 'capture' | 'processing' | 'extracted' | 'review' | 'failed'
  >('idle');
  const [captureSource, setCaptureSource] = useState<
    'camera' | 'library' | 'preset' | 'voice' | null
  >(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  // Extracted info editable fields
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState('');
  const [docSummary, setDocSummary] = useState('');

  const presets = [
    {
      name: 'Ramesh_EKG_Report_Aug18.pdf',
      category: 'Diagnostic Lab',
      size: '1.8 MB',
      summary:
        'Ambulatory EKG tracing showing normal sinus rhythm with occasional premature ventricular contractions (PVCs). No acute ST-T changes or signs of active myocardial ischemia.',
      findings: ['Average heart rate: 74 bpm.', 'Occasional PVCs, burden less than 0.8%.'],
      recommendations: ['Continue current anti-hypertensive regimen.', 'Avoid excessive caffeine.']
    },
    {
      name: 'Lakshmi_Diabetic_Screening_Aug15.pdf',
      category: 'Clinical Summary',
      size: '2.5 MB',
      summary:
        'Diabetic eye screening summary for Lakshmi Kumar. Direct ophthalmoscopy confirms no active diabetic retinopathy or maculopathy in either eye.',
      findings: [
        'Bilateral visual acuity corrected to 20/25.',
        'Intraocular pressure within normal bounds.'
      ],
      recommendations: [
        'Maintain Metformin dosage.',
        'Follow up with annual screening in Aug 2025.'
      ]
    },
    {
      name: 'Apollo_Lab_Report_Aug19.pdf',
      category: 'Diagnostic Lab',
      size: '1.2 MB',
      summary: 'I found 6 lab results.',
      findings: [
        'HbA1c: 6.8% (Elevated)',
        'LDL: 104 mg/dL (Borderline)',
        'Creatinine: 0.9 mg/dL (Normal)'
      ],
      recommendations: [
        'Schedule consultation with cardiologist.',
        'Monitor sodium intake and log daily vitals.'
      ]
    }
  ];

  const handleSelectSource = (
    source: 'camera' | 'library' | 'preset' | 'voice',
    presetIdx?: number
  ) => {
    setCaptureSource(source);
    setWorkflowStep('processing');
    setScanProgress(0);

    let targetName = 'Scanned_Paper_Handout.pdf';
    let targetCategory = 'Physician Handout';
    let targetSummary = 'Telemetry details summary extracted by OCR.';

    if (source === 'preset' && presetIdx !== undefined) {
      targetName = presets[presetIdx].name;
      targetCategory = presets[presetIdx].category;
      targetSummary = presets[presetIdx].summary;
    } else if (source === 'camera') {
      targetName = 'Prescription_Snapshot_Camera.jpg';
      targetCategory = 'Prescription Receipt';
      targetSummary =
        'Extracted medication checklist: Amlodipine 5mg (morning), Atorvastatin 20mg (night) scheduled daily.';
    } else if (source === 'library') {
      targetName = 'Blood_Panel_Photo.png';
      targetCategory = 'Diagnostic Lab';
      targetSummary = 'Fasting glucose: 98 mg/dL, HbA1c: 6.4% matching metabolic boundaries.';
    } else if (source === 'voice') {
      targetName = 'Cardiology_Consultation_Audio.wav';
      targetCategory = 'Speech Transcript';
      targetSummary =
        'Dr. Sharma audio summary: Verify Ramesh hydration levels and indoor veranda walk counts on days Chennai heat peaks above 38°C.';
    }

    setDocName(targetName);
    setDocCategory(targetCategory);
    setDocSummary(targetSummary);

    const currentAttempt = attemptCount + 1;
    setAttemptCount(currentAttempt);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (currentAttempt % 2 === 1 && prev >= 60) {
          clearInterval(interval);
          setTimeout(() => {
            setWorkflowStep('failed');
            showToast("OCR Ingestion Failed. We couldn't parse the document.");
          }, 400);
          return 60;
        }

        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setWorkflowStep('extracted');
          }, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handleSaveDocument = () => {
    const finalDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: docName,
      category: docCategory,
      date: 'Today',
      status: 'parsed',
      summary: docSummary,
      findings: ['Extracted info reviewed and confirmed by Anjali.'],
      recommendations: ['Consult physician for dosage confirmation.'],
      uploader: 'Anjali (Vault Capture)',
      fileSize: captureSource === 'voice' ? '420 KB' : '1.5 MB'
    };

    onAddDocument(finalDoc);
    setWorkflowStep('idle');
    setCaptureSource(null);
    showToast(`Successfully saved ${docName} to London Vault.`);
    setSelectedDocId(finalDoc.id);
  };

  return (
    <ScrollView className="flex-1 bg-[#fbfaf7]">
      {/* Mini Header */}
      <View className="flex-row items-center justify-between px-6 py-5 border-b border-[#e2dfd9] bg-[#fbfaf7]">
        <Text className="text-lg font-black text-[#121c2a]">Document Vault</Text>
        <View className="flex-row items-center gap-1.5 bg-[#d2f4ef] px-3.5 py-1 rounded-full">
          <FolderOpen size={12} color="#006a61" />
          <Text className="text-[10px] font-black text-[#006a61] uppercase tracking-wide">
            {documents.length} Files
          </Text>
        </View>
      </View>

      <View className="p-6 space-y-6">
        {/* workflow step manager */}
        {workflowStep === 'idle' && (
          <TouchableOpacity
            onPress={() => setWorkflowStep('capture')}
            className="w-full bg-[#2a14b4] py-4 rounded-2xl flex-row items-center justify-center gap-2 active:scale-98 shadow-sm"
          >
            <Upload size={16} color="#ffffff" />
            <Text className="text-white font-black text-xs uppercase tracking-wider">
              Scan New Document
            </Text>
          </TouchableOpacity>
        )}

        {/* Capture Source Selection Wizard */}
        {workflowStep === 'capture' && (
          <View className="bg-white border border-[#e2dfd9] rounded-3xl p-5 shadow-sm space-y-4">
            <View className="flex-row justify-between items-center pb-2 border-b border-slate-50">
              <View>
                <Text className="text-sm font-black text-slate-800">Scan New Medical Document</Text>
                <Text className="text-[10px] font-bold text-slate-400">
                  Choose document capture source
                </Text>
              </View>
              <TouchableOpacity onPress={() => setWorkflowStep('idle')}>
                <X size={16} color="#708090" />
              </TouchableOpacity>
            </View>

            <View className="grid grid-cols-2 gap-3 flex-row flex-wrap">
              <TouchableOpacity
                onPress={() => handleSelectSource('camera')}
                className="flex-1 min-w-[120px] p-4 bg-slate-50 border border-slate-100 rounded-2xl items-center gap-2 active:scale-95"
              >
                <Camera size={20} color="#2a14b4" />
                <Text className="text-[10px] font-black text-slate-800 uppercase">Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectSource('library')}
                className="flex-1 min-w-[120px] p-4 bg-slate-50 border border-slate-100 rounded-2xl items-center gap-2 active:scale-95"
              >
                <ImageIcon size={20} color="#059669" />
                <Text className="text-[10px] font-black text-slate-800 uppercase">Library</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectSource('voice')}
                className="flex-1 min-w-[120px] p-4 bg-slate-50 border border-slate-100 rounded-2xl items-center gap-2 active:scale-95"
              >
                <Mic size={20} color="#ba1a1a" />
                <Text className="text-[10px] font-black text-slate-800 uppercase">Voice Note</Text>
              </TouchableOpacity>
            </View>

            {/* Presets Mock Upload */}
            <View className="space-y-2 pt-2 border-t border-slate-50">
              <Text className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                Presets Mock Upload
              </Text>
              {presets.map((preset, idx) => (
                <TouchableOpacity
                  key={preset.name}
                  onPress={() => handleSelectSource('preset', idx)}
                  className="flex-row justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl active:scale-95"
                >
                  <View className="flex-row items-center gap-2">
                    <FileText size={12} color="#708090" />
                    <Text className="text-[10px] font-black text-slate-700">{preset.name}</Text>
                  </View>
                  <ArrowRight size={10} color="#708090" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Processing State */}
        {workflowStep === 'processing' && (
          <View className="bg-white border border-[#e2dfd9] rounded-3xl p-6 items-center space-y-4 shadow-sm">
            <ActivityIndicator size="small" color="#2a14b4" />
            <View className="items-center">
              <Text className="text-xs font-black text-slate-800 uppercase tracking-wider text-center">
                {docName.includes('Apollo')
                  ? 'KinGuard is reading the report…'
                  : captureSource === 'voice'
                    ? 'Transcribing Voice memo...'
                    : 'KinGuard AI OCR Scanning...'}
              </Text>
              <Text className="text-[9px] font-bold text-slate-400 mt-0.5">
                Uploading files to London Vault ({scanProgress}%)
              </Text>
            </View>
            <View className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <View
                className="bg-[#2a14b4] h-1.5 rounded-full"
                style={{ width: `${scanProgress}%` }}
              />
            </View>
          </View>
        )}

        {/* Failed State */}
        {workflowStep === 'failed' && (
          <View className="bg-white border-2 border-[#ba1a1a]/30 rounded-3xl p-6 items-center space-y-4 shadow-sm">
            <View className="w-10 h-10 rounded-full bg-rose-50 items-center justify-center">
              <AlertTriangle size={20} color="#ba1a1a" />
            </View>
            <View className="items-center space-y-1">
              <Text className="text-xs font-black text-rose-800 uppercase tracking-wider text-center">
                OCR Ingestion Failed
              </Text>
              <Text className="text-[10px] text-slate-500 font-bold text-center px-4 leading-normal">
                We couldn't read the text from the image. Please verify resolution and try again.
              </Text>
            </View>
            <View className="flex-row gap-3 w-full">
              <TouchableOpacity
                onPress={() => setWorkflowStep('capture')}
                className="flex-1 bg-slate-100 border border-slate-200 py-3 rounded-xl items-center justify-center active:scale-95"
              >
                <Text className="text-slate-600 text-[10px] font-black uppercase">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSelectSource(captureSource!)}
                className="flex-1 bg-[#ba1a1a] py-3 rounded-xl items-center justify-center active:scale-95 shadow-sm"
              >
                <Text className="text-white text-[10px] font-black uppercase">Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Extracted Information State */}
        {workflowStep === 'extracted' && (
          <View className="bg-white border border-[#e2dfd9] rounded-3xl p-5 space-y-4 shadow-sm">
            <View className="flex-row items-center justify-between pb-2 border-b border-slate-50">
              <View>
                <Text className="text-sm font-black text-slate-800">
                  {docName.includes('Apollo') ? 'I found 6 lab results.' : 'Extracted information'}
                </Text>
                <Text className="text-[9px] font-bold text-[#059669] uppercase tracking-wider">
                  KinGuard AI Parser Ingested
                </Text>
              </View>
              <TouchableOpacity onPress={() => setWorkflowStep('idle')}>
                <X size={16} color="#708090" />
              </TouchableOpacity>
            </View>

            {/* Extracted Lab Values Panel */}
            {docName.includes('Apollo') && (
              <View className="bg-[#eff4ff]/60 border border-[#dee9fc] p-4 rounded-2xl space-y-2">
                <Text className="text-[9px] font-black text-[#2a14b4] uppercase tracking-wider">
                  Extracted Lab Metrics
                </Text>
                <View className="space-y-1.5">
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-700 font-bold">HbA1c</Text>
                    <Text className="text-xs font-black text-[#ba1a1a]">6.8% (Elevated)</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-700 font-bold">LDL Cholesterol</Text>
                    <Text className="text-xs font-black text-slate-800">104 mg/dL</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-700 font-bold">Creatinine</Text>
                    <Text className="text-xs font-black text-slate-850">0.9 mg/dL</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Editable Fields */}
            <View className="space-y-3">
              <View className="space-y-1">
                <Text className="text-[9px] font-black text-slate-400 uppercase">
                  Document Name
                </Text>
                <TextInput
                  value={docName}
                  onChangeText={setDocName}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-800 font-bold"
                />
              </View>

              <View className="space-y-1">
                <Text className="text-[9px] font-black text-slate-400 uppercase">Category</Text>
                <TextInput
                  value={docCategory}
                  onChangeText={setDocCategory}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-800 font-bold"
                />
              </View>

              <View className="space-y-1">
                <Text className="text-[9px] font-black text-slate-400 uppercase">
                  Parsed Summary
                </Text>
                <TextInput
                  value={docSummary}
                  onChangeText={setDocSummary}
                  multiline
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-800 font-semibold h-16 leading-relaxed"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setWorkflowStep('review')}
              className="w-full bg-[#2a14b4] py-3.5 rounded-xl items-center justify-center active:scale-95 shadow-xs"
            >
              <Text className="text-white text-xs font-black uppercase">
                {docName.includes('Apollo') ? 'Review & save' : 'Review details'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Review and Save State */}
        {workflowStep === 'review' && (
          <View className="bg-white border border-[#e2dfd9] rounded-3xl p-5 space-y-4 shadow-sm">
            <View className="flex-row items-center justify-between pb-2 border-b border-slate-50">
              <View>
                <Text className="text-sm font-black text-slate-800">Final Verification Review</Text>
                <Text className="text-[9px] font-bold text-slate-400">
                  Validate extracted values before save
                </Text>
              </View>
              <TouchableOpacity onPress={() => setWorkflowStep('extracted')}>
                <X size={16} color="#708090" />
              </TouchableOpacity>
            </View>

            <View className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <View className="space-y-0.5">
                <Text className="text-[9px] font-black text-slate-400 uppercase">Document</Text>
                <Text className="text-xs font-black text-slate-800">{docName}</Text>
              </View>
              <View className="space-y-0.5">
                <Text className="text-[9px] font-black text-slate-400 uppercase">Category</Text>
                <Text className="text-xs font-black text-slate-800">{docCategory}</Text>
              </View>
              <View className="space-y-0.5">
                <Text className="text-[9px] font-black text-slate-400 uppercase">Summary</Text>
                <Text className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {docSummary}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setWorkflowStep('extracted')}
                className="flex-1 bg-white border border-slate-200 py-3.5 rounded-xl items-center justify-center"
              >
                <Text className="text-slate-600 font-bold text-xs">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveDocument}
                className="flex-1 bg-[#059669] py-3.5 rounded-xl items-center justify-center shadow-xs"
              >
                <Text className="text-white text-xs font-black uppercase">Save report</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Processed Files catalog list */}
        <View className="space-y-3">
          <Text className="text-sm font-black text-[#121c2a]">Processed Medical Files</Text>
          <View className="space-y-3">
            {documents.map((doc) => {
              const isExpanded = selectedDocId === doc.id;
              return (
                <View
                  key={doc.id}
                  className={`bg-white rounded-[24px] p-4.5 border transition-all ${
                    isExpanded ? 'border-[#2a14b4]' : 'border-slate-100'
                  }`}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedDocId(isExpanded ? null : doc.id)}
                    className="flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-9 h-9 rounded-full bg-[#d9e3f6] items-center justify-center shrink-0">
                        <FileText size={18} color="#2a14b4" />
                      </View>
                      <View>
                        <Text className="text-xs font-black text-[#121c2a] truncate max-w-[160px]">
                          {doc.name}
                        </Text>
                        <Text className="text-[10px] text-slate-400 font-bold">
                          {doc.category} • {doc.fileSize}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <View className="bg-[#d2f4ef] px-2 py-0.5 rounded-full">
                        <Text className="text-[9px] font-black text-[#006a61] uppercase">
                          {doc.status}
                        </Text>
                      </View>
                      <Text className="text-[9px] text-slate-400 mt-1 font-bold">{doc.date}</Text>
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View className="mt-4 pt-3.5 border-t border-[#e2dfd9] space-y-4">
                      {/* AI Summary */}
                      <View className="bg-[#eff4ff]/60 p-3 rounded-2xl border border-[#dee9fc]/40">
                        <View className="flex-row items-center gap-1.5 mb-1.5">
                          <Sparkles size={12} color="#2a14b4" />
                          <Text className="text-[10px] font-black text-[#2a14b4] uppercase tracking-wider">
                            KinGuard Summary
                          </Text>
                        </View>
                        <Text className="text-[11px] leading-relaxed text-slate-700">
                          {doc.summary}
                        </Text>
                      </View>

                      {/* Findings */}
                      {doc.findings && (
                        <View className="space-y-1">
                          <View className="flex-row items-center gap-1">
                            <TrendingUp size={12} color="#2a14b4" />
                            <Text className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                              Key Findings
                            </Text>
                          </View>
                          {doc.findings.map((f: string, idx: number) => (
                            <Text
                              key={idx}
                              className="text-[11px] text-slate-600 leading-normal pl-2 font-medium"
                            >
                              &#8226; {f}
                            </Text>
                          ))}
                        </View>
                      )}

                      {/* Recommendations */}
                      {doc.recommendations && (
                        <View className="space-y-1">
                          <View className="flex-row items-center gap-1">
                            <CheckCircle2 size={12} color="#006a61" />
                            <Text className="text-[10px] font-black text-[#006a61] uppercase tracking-wider">
                              Actionable Steps
                            </Text>
                          </View>
                          {doc.recommendations.map((r: string, idx: number) => (
                            <Text
                              key={idx}
                              className="text-[11px] text-[#006a61] leading-normal pl-2 font-bold"
                            >
                              &#8226; {r}
                            </Text>
                          ))}
                        </View>
                      )}

                      {/* Actions */}
                      <View className="flex-row gap-2 pt-2 border-t border-slate-50">
                        <TouchableOpacity
                          onPress={() => onAskAI(`Summarize file ${doc.name}`)}
                          className="flex-grow py-3 bg-[#2a14b4] rounded-xl flex-row items-center justify-center gap-1.5 active:scale-95 px-3"
                        >
                          <MessageSquare size={12} color="#ffffff" />
                          <Text className="text-white font-black text-[10px] uppercase">
                            AI Summary
                          </Text>
                        </TouchableOpacity>

                        {doc.status === 'parsed' && (
                          <TouchableOpacity
                            onPress={() => {
                              onAskAI(`Prepare questions for doctor about report ${doc.name}`);
                              showToast('Generating doctor pre-visit question checklists...');
                            }}
                            className="flex-grow py-3 bg-[#006a61] rounded-xl flex-row items-center justify-center gap-1.5 active:scale-95 px-3"
                          >
                            <Sparkles size={12} color="#ffffff" />
                            <Text className="text-white font-black text-[10px] uppercase">
                              Prepare Questions
                            </Text>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          onPress={() => alert('Report shared safely with Care network.')}
                          className="py-3 px-3.5 border border-slate-200 rounded-xl flex-row items-center justify-center gap-1 active:scale-95 bg-white"
                        >
                          <Share2 size={12} color="#464554" />
                          <Text className="text-slate-600 font-bold text-[10px] uppercase">
                            Share
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
