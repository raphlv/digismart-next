'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useDigismart } from '@/lib/digismartContext';
import { generateSocialMediaWithAI } from '@/lib/aiService';
import { exportSocialMediaToDocx, exportSocialMediaToPdf } from '@/lib/exportUtils';
import { 
  MessageSquare, 
  Sparkles, 
  Copy, 
  Check, 
  Download,
  FileDown,
  FileText,
  Instagram, 
  Twitter, 
  Linkedin,
  Share2,
  Heart,
  MessageCircle,
  Repeat,
  Bookmark,
  Send,
  MoreHorizontal,
  Clock,
  Image as ImageIcon,
  BookOpen
} from 'lucide-react';

export default function SocialMediaPage() {
  const { addKnowledgeDoc } = useDigismart();

  const [topik, setTopik] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Casual');

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [savedToKb, setSavedToKb] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topik.trim()) return;

    setIsGenerating(true);

    try {
      const topicTitle = topik.trim();
      const aiRes = await generateSocialMediaWithAI({
        topik: topicTitle,
        platform,
        tone,
      });

      setResult({
        topic: topicTitle,
        platform,
        tone,
        caption: aiRes.caption,
        hashtags: aiRes.hashtags,
        visualIdea: aiRes.visualIdea,
        bestTime: aiRes.bestTime,
        provider: aiRes.provider,
      });
      setSavedToKb(false);
    } catch (err) {
      console.error('Social media generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(`${result.caption}\n\n${result.hashtags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (!result) return;
    const text = `KONTEN MEDIA SOSIAL (${result.platform.toUpperCase()})\nTone: ${result.tone}\n\nCAPTION:\n${result.caption}\n\nHASHTAGS:\n${result.hashtags}\n\nREKOMENDASI VISUAL:\n${result.visualIdea}\n\nWAKTU POSTING OPTIMAL:\n${result.bestTime}\n\n---\nDIGISMART AI Content Generator`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sosmed-${result.platform.toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleSaveToKb = () => {
    if (!result) return;
    addKnowledgeDoc({
      title: `Konten Medsos (${result.platform}): ${result.topic}`,
      category: 'Social Media & Fact-Checking',
      summary: `Naskah postingan medsos untuk platform ${result.platform} bertema "${result.topic}" dengan tone ${result.tone}.`,
      content: `Platform: ${result.platform}\nTone: ${result.tone}\n\nCaption:\n${result.caption}\n\nHashtags:\n${result.hashtags}\n\nSaran Visual:\n${result.visualIdea}\nWaktu Tayang:\n${result.bestTime}`,
      author: 'Social Media Officer',
    });
    setSavedToKb(true);
    setTimeout(() => setSavedToKb(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#060913] flex flex-col lg:flex-row transition-colors">
      <Sidebar />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header 
          title="AI Social Media Content" 
          subtitle="Generate konten media sosial"
          icon={MessageSquare}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Card: Input Form */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0B1120] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <form onSubmit={handleGenerate} className="space-y-4">
                {/* Topik * */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Topik Konten <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={topik}
                    onChange={(e) => setTopik(e.target.value)}
                    placeholder="Contoh: Launching program digitalisasi..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>

                {/* Platform & Tone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Platform
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="Twitter/X">Twitter/X</option>
                      <option value="TikTok">TikTok</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Facebook">Facebook</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                    >
                      <option value="Casual">Casual</option>
                      <option value="Formal">Formal</option>
                      <option value="Persuasif">Persuasif</option>
                      <option value="Humanis">Humanis</option>
                    </select>
                  </div>
                </div>

                {/* Button Generate Konten */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating || !topik.trim()}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGenerating ? 'Menyusun Konten...' : 'Generate Konten'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Card: Output */}
            <div className="lg:col-span-6 bg-white dark:bg-[#0B1120] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm min-h-[420px] flex flex-col justify-between">
              {result ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono">
                      {result.platform} ({result.tone})
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => exportSocialMediaToDocx(result)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Unduh Word (.docx)"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Word</span>
                      </button>

                      <button
                        onClick={() => exportSocialMediaToPdf(result)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Unduh PDF (.pdf)"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>

                      <button
                        onClick={handleSaveToKb}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Simpan ke Knowledge Base"
                      >
                        {savedToKb ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <BookOpen className="w-3.5 h-3.5" />}
                        <span>{savedToKb ? 'Tersimpan' : 'Ke KB'}</span>
                      </button>

                      <button
                        onClick={downloadTxt}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Unduh (.txt)"
                      >
                        {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
                        <span>{downloaded ? 'Terunduh' : 'TXT'}</span>
                      </button>

                      <button
                        onClick={copyToClipboard}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Salin Naskah"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Social Platform Mockup Preview */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                    {/* Header of Post Mockup */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          DG
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <span>Humas Digital Komunikasi</span>
                            <span className="text-blue-500">✓</span>
                          </div>
                          <div className="text-[10px] text-slate-400">@humasdigital • Baru saja</div>
                        </div>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Caption Content */}
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                      {result.caption}
                    </p>

                    {/* Hashtags */}
                    <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-medium pt-1">
                      {result.hashtags}
                    </p>

                    {/* Engagement bar */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-slate-400 text-xs">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 hover:text-rose-500 cursor-pointer"><Heart className="w-3.5 h-3.5" /> 1.2k</span>
                        <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer"><MessageCircle className="w-3.5 h-3.5" /> 84</span>
                        <span className="flex items-center gap-1 hover:text-emerald-500 cursor-pointer"><Repeat className="w-3.5 h-3.5" /> 312</span>
                      </div>
                      <Bookmark className="w-3.5 h-3.5 hover:text-amber-500 cursor-pointer" />
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-200/50 dark:border-blue-900/40">
                      <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-bold mb-1">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Saran Visual:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {result.visualIdea}
                      </p>
                    </div>

                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200/50 dark:border-emerald-900/40">
                      <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Waktu Posting Terbaik:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        {result.bestTime}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto py-16 text-center text-slate-400 dark:text-slate-500">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-3">
                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-500">
                    Hasil konten akan muncul di sini
                  </p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
