
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, Sparkles, MapPin, Search, ExternalLink, Loader2, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../store/AppContext';
import AvatarCanvas from './AvatarCanvas';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

// Audio decoding utilities as per specifications
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): any {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const AssistantPanel: React.FC = () => {
  const { isAssistantOpen, setAssistantOpen } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Namaste! I am your Genie. I can talk to you live or chat. How can I help you today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const stopLiveSession = useCallback(() => {
    if (liveSessionRef.current) {
      liveSessionRef.current.close();
      liveSessionRef.current = null;
    }
    setIsLiveActive(false);
    for (const source of sourcesRef.current.values()) {
      source.stop();
    }
    sourcesRef.current.clear();
  }, []);

  const startLiveSession = async () => {
    if (isLiveActive) {
      stopLiveSession();
      return;
    }

    try {
      setIsLiveActive(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              if (isMuted) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const s of sourcesRef.current.values()) s.stop();
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error("Live API Error:", e),
          onclose: () => setIsLiveActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: 'You are a helpful, high-end AI shopping assistant for AI Genie Shop. Speak naturally and concisely.',
        },
      });

      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start live session:", err);
      setIsLiveActive(false);
    }
  };

  const handleAction = async (type: 'chat' | 'maps' | 'search', text: string = input) => {
    if (!text.trim() && type === 'chat') return;
    
    const userMsg: ChatMessage = { role: 'user', text: text || `Find ${type} nearby`, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let response;
      if (type === 'maps') {
        const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
        response = await geminiService.findNearby(text || 'useful shops', pos.coords.latitude, pos.coords.longitude);
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: response.text, 
          type: 'location',
          data: response.places,
          timestamp: Date.now() 
        }]);
      } else if (type === 'search') {
        response = await geminiService.search(text);
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: response.text, 
          type: 'search',
          data: response.links,
          timestamp: Date.now() 
        }]);
      } else {
        const textRes = await geminiService.chat(text);
        setMessages(prev => [...prev, { role: 'ai', text: textRes, timestamp: Date.now() }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting right now. Please try again.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, [stopLiveSession]);

  return (
    <AnimatePresence>
      {isAssistantOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setAssistantOpen(false)}
            className="fixed inset-0 bg-indigo-950/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-[60] flex flex-col"
          >
            <div className="p-5 border-b flex justify-between items-center bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-white/20 rounded-lg ${isLiveActive ? 'animate-bounce' : 'animate-pulse'}`}>
                   <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter">AI GENIE {isLiveActive ? 'LIVE' : 'ASSISTANT'}</h2>
                  <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">
                    {isLiveActive ? 'Voice Conversation Active' : 'Global Support Active'}
                  </p>
                </div>
              </div>
              <button onClick={() => setAssistantOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border-b relative">
              <AvatarCanvas />
              {isLiveActive && (
                <div className="absolute top-8 right-8 flex flex-col gap-2">
                   <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full shadow-lg transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white text-indigo-600'}`}
                   >
                     {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                   </button>
                </div>
              )}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar bg-white">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-indigo-50 text-indigo-950 rounded-tl-none border border-indigo-100'
                  }`}>
                    <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                    
                    {msg.data && (
                      <div className="mt-4 grid grid-cols-1 gap-2 border-t border-indigo-200/50 pt-4">
                        {msg.data.map((item: any, i: number) => (
                          <a 
                            key={i} 
                            href={item.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-white/60 rounded-xl hover:bg-white transition-all group"
                          >
                            <span className="text-xs font-black text-indigo-600 truncate mr-2">{item.title}</span>
                            <ExternalLink className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-indigo-50 p-4 rounded-2xl animate-pulse text-indigo-400 flex items-center gap-2 font-bold italic">
                    <Loader2 className="w-4 h-4 animate-spin" /> Genie is searching...
                  </div>
                </div>
              )}
              {isLiveActive && (
                 <div className="flex justify-center p-4">
                    <div className="flex gap-1 items-end h-8">
                       {[1,2,3,4,5,6].map(i => (
                         <motion.div 
                           key={i}
                           animate={{ height: [8, 24, 8] }}
                           transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                           className="w-1 bg-indigo-600 rounded-full"
                         />
                       ))}
                    </div>
                 </div>
              )}
            </div>

            <div className="p-5 border-t bg-slate-50">
              <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                <button 
                  onClick={startLiveSession}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-black text-xs whitespace-nowrap shadow-sm border ${
                    isLiveActive 
                    ? 'bg-red-500 text-white border-red-500' 
                    : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <Mic className="w-4 h-4" /> {isLiveActive ? 'STOP LIVE TALK' : 'START LIVE TALK'}
                </button>
                <button 
                  onClick={() => handleAction('maps')}
                  className="px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 font-bold text-xs whitespace-nowrap shadow-sm"
                >
                  <MapPin className="w-4 h-4" /> FIND NEARBY
                </button>
                <button 
                  onClick={() => handleAction('search', 'Health tips for diabetes')}
                  className="px-4 py-2 bg-white border border-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 font-bold text-xs whitespace-nowrap shadow-sm"
                >
                  <Search className="w-4 h-4" /> DIABETES TIPS
                </button>
              </div>
              
              {!isLiveActive && (
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAction('chat')}
                    placeholder="Ask me anything..."
                    className="w-full pl-5 pr-14 py-4 rounded-2xl border border-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-100 bg-white text-indigo-900 shadow-inner"
                  />
                  <button 
                    onClick={() => handleAction('chat')} 
                    className="absolute right-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg active:scale-95 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AssistantPanel;
