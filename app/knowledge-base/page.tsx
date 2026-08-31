'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  LEARNING_MODULES, 
  CRISIS_CASE_STUDIES, 
  LearningModule, 
  CrisisCaseStudy 
} from '@/lib/digismartData';
import { 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Berapa batas waktu ideal (Golden Hour) untuk merilis Holding Statement pertama saat krisis komunikasi terjadi?',
    options: [
      'Maksimal 60 menit setelah isu mencuat ke publik',
      'Menunggu 24 jam sampai rapat direksi selesai',
      'Tidak perlu merilis apa pun sampai isu mereda sendiri',
      'Menunggu sampai ada panggilan dari kementerian terkait',
    ],
    correct: 0,
    explanation: 'Dalam etika humas modern, 60 menit pertama adalah masa krusial (Golden Hour) untuk mencegah berkembangnya spekulasi liar dan hoaks.',
  },
  {
    id: 2,
    question: 'Unsur manakah yang paling tepat diutamakan dalam kalimat pembuka sebuah respons krisis publik?',
    options: [
      'Membela diri dan menyalahkan pihak luar',
      'Empati tulus kepada korban/pihak terdampak serta pengakuan atas terjadinya insiden',
      'Rincian pencapaian dan prestasi organisasi di masa lalu',
      'Mengancam akan menuntut pihak yang menyebarkan keluhan',
    ],
    correct: 1,
    explanation: 'Prinsip "Empathy First" adalah fondasi utama komunikasi krisis agar publik merasa didengar dan dihormati.',
  },
  {
    id: 3,
    question: 'Apa fungsi utama sistem Social Listening AI dalam pusat komando komunikasi (Command Center)?',
    options: [
      'Menghapus komentar negatif netizen secara otomatis',
      'Mendeteksi anomali volume percakapan dan tren polaritas opini masyarakat secara real-time',
      'Menggantikan seluruh pekerjaan juru bicara institusi',
      'Membeli pengikut dan likes palsu di media sosial',
    ],
    correct: 1,
    explanation: 'Social Listening berfungsi sebagai sistem peringatan dini (early warning system) untuk memetakan dinamika persepsi masyarakat sebelum krisis membesar.',
  },
];

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<'modules' | 'cases' | 'prompts' | 'quiz'>('modules');
  const [selectedModule, setSelectedModule] = useState<LearningModule>(LEARNING_MODULES[0]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (qId: number, optionIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionIdx });
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) score += 1;
    });
    return Math.round((score / QUIZ_QUESTIONS.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header 
          title="Knowledge Base & Learning Center" 
          subtitle="Pusat Edukasi Komunikasi Publik Digital, Studi Kasus Krisis PR, & Panduan AI Mahasiswa" 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('modules')}
              className={`
                px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all
                ${activeTab === 'modules' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}
              `}
            >
              <BookOpen className="w-4 h-4" />
              <span>Modul Teori & Konsep</span>
            </button>

            <button
              onClick={() => setActiveTab('cases')}
              className={`
                px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all
                ${activeTab === 'cases' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}
              `}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Studi Kasus Krisis PR</span>
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className={`
                px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all
                ${activeTab === 'prompts' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}
              `}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Prompt Library</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`
                px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all
                ${activeTab === 'quiz' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}
              `}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Kuis Simulasi Mahasiswa</span>
            </button>
          </div>

          {/* TAB 1: Modul Teori & Konsep */}
          {activeTab === 'modules' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* List Modules */}
              <div className="lg:col-span-4 space-y-3">
                {LEARNING_MODULES.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedModule(mod)}
                    className={`
                      w-full text-left p-4 rounded-2xl border transition-all flex flex-col justify-between
                      ${
                        selectedModule.id === mod.id
                          ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200/90 hover:border-slate-300'
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span className="font-bold text-blue-600 uppercase">{mod.category}</span>
                        <span>{mod.readTime}</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {mod.summary}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Detail Selected Module */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-bold mb-1">
                    <span>{selectedModule.category}</span>
                    <span>•</span>
                    <span>{selectedModule.readTime}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900">
                    {selectedModule.title}
                  </h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedModule.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {/* Key Takeaways */}
                <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-100 space-y-2.5">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                    Poin Kunci yang Harus Dikuasai Mahasiswa:
                  </span>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-blue-950">
                    {selectedModule.keyTakeaways.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Studi Kasus Krisis PR */}
          {activeTab === 'cases' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CRISIS_CASE_STUDIES.map((cs) => (
                <div
                  key={cs.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="font-bold text-rose-600 uppercase">Studi Kasus Humas</span>
                      <span>{cs.organization}</span>
                    </div>

                    <h3 className="text-base font-display font-bold text-slate-900">
                      {cs.caseTitle}
                    </h3>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      <strong>Ringkasan Insiden:</strong> {cs.crisisSummary}
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                        <strong className="block text-emerald-700 mb-0.5">✅ Respons Terbaik (Best Practice):</strong>
                        {cs.goodResponse}
                      </div>

                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900">
                        <strong className="block text-rose-700 mb-0.5">❌ Kesalahan Fatal (Bad Practice):</strong>
                        {cs.badResponse}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Pelajaran Berharga:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {cs.learningPoints.map((pt, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: AI Prompt Library */}
          {activeTab === 'prompts' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-display font-bold text-slate-900">
                  Panduan & Perpustakaan Prompt AI untuk Praktisi Humas
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Gunakan formula prompt terstruktur berikut di dalam AI News Generator atau ChatGPT untuk hasil optimal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-blue-700 uppercase font-mono">
                    1. Prompt Siaran Pers Beasiswa / Inovasi
                  </span>
                  <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200 font-mono">
                    "Bertindaklah sebagai Senior Public Relations Officer. Buatkan siaran pers formal 4 paragraf mengenai peluncuran program beasiswa AI. Gunakan piramida terbalik, sertakan kutipan inspiratif pimpinan, dan kontak narahubung media."
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-rose-700 uppercase font-mono">
                    2. Prompt Holding Statement Krisis Sistem
                  </span>
                  <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200 font-mono">
                    "Buatkan holding statement darurat humas maksimal 100 kata terkait gangguan server KRS. Terapkan formula Acknowledge + Action + Assurance, dengan nada bahasa yang rendah hati dan menenangkan publik."
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 uppercase font-mono">
                    3. Prompt Utas Media Sosial Edukatif (Thread X)
                  </span>
                  <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200 font-mono">
                    "Susun utas X/Twitter 5 cuitan yang menjelaskan tips aman registrasi semester daring tanpa terkena kendala jaringan. Gunakan gaya bahasa kasual, ramah mahasiswa, dan sertakan tagar relevan."
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-amber-700 uppercase font-mono">
                    4. Prompt Analisis Persepsi Sentimen Netizen
                  </span>
                  <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200 font-mono">
                    "Analisis teks opini berikut. Ekstrak sentimen dominan (Positif/Netral/Negatif), kelompokkan 3 isu yang paling banyak dikeluhkan, dan rekomendasikan poin jawaban humas."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Kuis Simulasi Mahasiswa */}
          {activeTab === 'quiz' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-display font-bold text-slate-900">
                    Kuis Uji Pemahaman Komunikasi Publik & Mitigasi Krisis
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Uji pemahaman Anda mengenai prinsip humas digital, golden hour, dan pemanfaatan AI.
                  </p>
                </div>
                {showResults && (
                  <div className="text-right">
                    <span className="block text-xs text-slate-400 font-mono">Skor Akhir:</span>
                    <span className="text-2xl font-display font-bold text-blue-600 font-mono">
                      {calculateScore()} / 100
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {QUIZ_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="space-y-3">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {idx + 1}. {q.question}
                    </h4>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[q.id] === optIdx;
                        const isCorrect = q.correct === optIdx;
                        let optionStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                        if (showResults) {
                          if (isCorrect) {
                            optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-blue-50 border-blue-400 text-blue-900 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {showResults && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showResults && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 italic">
                        💡 <strong>Penjelasan:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setShowResults(false);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Ulangi Kuis
                </button>

                <button
                  onClick={() => setShowResults(true)}
                  disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 disabled:opacity-50"
                >
                  Periksa Jawaban & Lihat Nilai
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
