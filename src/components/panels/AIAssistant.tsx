'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useExplorerStore } from '../../store/useExplorerStore';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { Send, Terminal, Loader, Volume2, VolumeX } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const { 
    chatMessages, 
    addChatMessage, 
    isChatLoading, 
    setChatLoading, 
    activeMolecule,
    scale
  } = useExplorerStore();
  
  const [input, setInput] = useState('');
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<number>(0);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    if (!text) return;
    
    // Clean markdown characters from text for cleaner speaking
    const cleanText = text.replace(/[*#`_\-]/g, '').replace(/\n/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                         voices.find(v => v.lang.startsWith('en')) || 
                         voices[0];
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.pitch = 1.0;
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    const nextState = !speechEnabled;
    setSpeechEnabled(nextState);
    if (nextState) {
      const lastAIMsg = [...chatMessages].reverse().find(m => m.sender === 'ai');
      if (lastAIMsg) {
        speakText(lastAIMsg.text);
      }
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // Monitor voice enablement and cancel speech on disable
  useEffect(() => {
    if (!speechEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [speechEnabled]);

  // Read new AI responses aloud
  useEffect(() => {
    if (chatMessages.length > lastMessageRef.current) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg && lastMsg.sender === 'ai' && speechEnabled) {
        speakText(lastMsg.text);
      }
      lastMessageRef.current = chatMessages.length;
    }
  }, [chatMessages, speechEnabled]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isChatLoading]);

  // Handle message sending
  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || isChatLoading) return;

    if (!textToSend) setInput('');

    // Append user query to chat store
    addChatMessage({
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString()
    });

    setChatLoading(true);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moleculeId: (scale === 'galaxy' || scale === 'earth' || scale === 'cell' || scale === 'quark') ? scale : activeMolecule.id,
          question: queryText
        })
      });

      const data = await response.json();
      
      addChatMessage({
        sender: 'ai',
        text: data.explanation || "System error: Failed to retrieve explanation from molecular database.",
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err) {
      console.error(err);
      addChatMessage({
        sender: 'ai',
        text: "Neural downlink failed. Operating in offline diagnostic mode. Check your internet connection or API settings.",
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setChatLoading(false);
    }
  };

  const presetQueries = React.useMemo(() => {
    if (scale === 'galaxy') {
      return [
        "What is the orbital structure and mass of the Solar System?",
        "Explain the class and characteristics of the Sun.",
        "How do the inner terrestrial and outer gas giant planets compare?"
      ];
    } else if (scale === 'earth') {
      return [
        "What is the orbital speed and mass of Planet Earth?",
        "Describe the composition of Earth's atmosphere.",
        "How many communication and weather satellites orbit Earth?"
      ];
    } else if (scale === 'cell') {
      return [
        "What are the major organelles in a eukaryotic cell?",
        "How do mitochondria generate ATP power?",
        "What is the function of the cell nucleus core?"
      ];
    } else if (scale === 'quark') {
      return [
        "What is a proton and its subatomic structure?",
        "Describe the Up and Down quarks and their fractional charges.",
        "How does the strong force and gluon binding keep quarks confined?"
      ];
    } else {
      return [
        `How does ${activeMolecule.name} interact in the body?`,
        `Describe the electron bonding geometry of ${activeMolecule.formula}.`,
        `What are the major industrial uses of this compound?`
      ];
    }
  }, [scale, activeMolecule]);

  const activeFocusName = 
    scale === 'galaxy'
      ? 'Solar System'
      : scale === 'earth' 
        ? 'Planet Earth' 
        : scale === 'cell' 
          ? 'Eukaryotic Cell' 
          : scale === 'quark'
            ? 'Proton Quark Core'
            : activeMolecule.name;

  return (
    <GlassCard className="w-full h-fit lg:h-[calc(100vh-180px)] flex flex-col justify-between border border-cyberPurple/20 pointer-events-auto" glowColor="purple">
      {/* HUD Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyberPurple/20">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyberPurple" />
          <div>
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">AI Cognitive Core</h2>
            <span className="text-[10px] font-mono text-cyberPurple/80 font-semibold">Active Focus: {activeFocusName}</span>
          </div>
        </div>
        
        {/* Voice read-aloud toggle */}
        <button
          onClick={toggleSpeech}
          className={`p-2 rounded border transition-all duration-300 pointer-events-auto ${
            speechEnabled
              ? 'bg-cyberPurple/25 border-cyberPurple text-cyberPurple text-glow-purple shadow-[0_0_8px_rgba(108,99,255,0.4)]'
              : 'bg-spaceLight/40 border-white/5 hover:border-cyberPurple/30 text-white/50 hover:text-white/80'
          }`}
          title={speechEnabled ? "Mute Read-Aloud" : "Enable Read-Aloud"}
        >
          {speechEnabled ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Messages Log */}
      <div className="flex-1 overflow-y-auto my-3 pr-1 flex flex-col gap-3 max-h-[250px] lg:max-h-[calc(100vh-420px)]">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col max-w-[85%] rounded p-3 text-xs font-sans ${
              msg.sender === 'user'
                ? 'self-end bg-cyberPurple/10 border border-cyberPurple/30 text-purple-100'
                : 'self-start bg-spaceLight border border-white/5 text-slate-300'
            }`}
          >
            <span className="text-[9px] font-mono text-white/40 mb-1">
              {msg.sender === 'user' ? 'USER_SHELL' : 'COGNITIVE_COV'} • {msg.timestamp}
            </span>
            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
          </div>
        ))}
        {isChatLoading && (
          <div className="self-start bg-spaceLight border border-white/5 rounded p-3 text-xs flex items-center gap-2 text-white/40">
            <Loader className="w-3.5 h-3.5 animate-spin text-cyberPurple" />
            <span className="font-mono text-[10px]">Processing quantum equations...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset template queries */}
      <div className="flex flex-col gap-1.5 mb-2.5">
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Query templates:</span>
        <div className="flex flex-col gap-1">
          {presetQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isChatLoading}
              className="text-left text-[11px] font-sans truncate bg-spaceLight/50 hover:bg-cyberPurple/10 hover:text-cyberPurple border border-white/5 hover:border-cyberPurple/30 text-slate-400 rounded px-2.5 py-1.5 transition-all duration-200 pointer-events-auto"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Form Input */}
      <div className="flex gap-2 border-t border-cyberPurple/20 pt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask chemical analyzer..."
          className="flex-1 bg-spaceLight border border-cyberPurple/30 text-white rounded px-3 py-2 text-xs font-sans placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-cyberPurple pointer-events-auto"
        />
        <NeonButton
          variant="purple"
          onClick={() => handleSend()}
          disabled={!input.trim() || isChatLoading}
          className="px-3 py-2 pointer-events-auto"
        >
          <Send className="w-4 h-4" />
        </NeonButton>
      </div>
    </GlassCard>
  );
};
