"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check, Wand2, Zap, Layout, Terminal } from "lucide-react";

const MODELS = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "claude-3", name: "Claude 3" },
  { id: "deepseek", name: "DeepSeek" },
  { id: "llama-3", name: "Llama 3" },
];

export default function Home() {
  const [draftPrompt, setDraftPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async (action = "optimize") => {
    if (!draftPrompt.trim()) return;
    
    setIsOptimizing(true);
    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: draftPrompt,
          model: selectedModel,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to optimize prompt");
      }

      const data = await response.json();
      setOptimizedPrompt(data.result);
    } catch (error) {
      console.error(error);
      setOptimizedPrompt("Erreur lors de l'optimisation. Vérifiez votre clé API ou réessayez.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = () => {
    if (!optimizedPrompt) return;
    navigator.clipboard.writeText(optimizedPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-purple-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-purple-400 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Prompt Engineering</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent"
          >
            PromptOPT
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto"
          >
            Transformez vos idées brouillons en prompts parfaitement structurés et optimisés pour votre LLM préféré.
          </motion.p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Editor Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  Brouillon
                </h2>
                
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              
              <textarea
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
                placeholder="Tapez votre idée de prompt ici... (ex: je veux que tu ailles me chercher les données de sport sur le web et que tu fasses un graphe)"
                className="w-full h-64 bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all"
              />

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => handleOptimize("optimize")}
                  disabled={isOptimizing || !draftPrompt}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                >
                  {isOptimizing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Optimisation...
                    </span>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Structurer le Prompt
                    </>
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleOptimize("concise")}
                  disabled={isOptimizing || !draftPrompt}
                  className="flex items-center justify-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-700 py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Rendre plus concis
                </button>
                <button 
                  onClick={() => handleOptimize("creative")}
                  disabled={isOptimizing || !draftPrompt}
                  className="flex items-center justify-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-700 py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Plus Créatif
                </button>
              </div>
            </div>
          </motion.div>

          {/* Result Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-4 h-full"
          >
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Layout className="w-5 h-5 text-purple-400" />
                  Prompt Optimisé
                </h2>
                
                {optimizedPrompt && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {isCopied ? "Copié !" : "Copier"}
                  </button>
                )}
              </div>
              
              <div className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 overflow-y-auto relative min-h-[300px]">
                {!optimizedPrompt && !isOptimizing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                    <Sparkles className="w-8 h-8 mb-2 opacity-20" />
                    <p>Le prompt optimisé apparaîtra ici</p>
                  </div>
                )}
                
                {optimizedPrompt && (
                  <div className="prose prose-invert max-w-none text-zinc-300 whitespace-pre-wrap">
                    {optimizedPrompt}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
