
import React, { useState, useCallback, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import { quickScan, deepAnalysis, analyzeEmail } from '../services/geminiService';
import { AnalysisResult, ReportingGuide } from '../types';
import AnalysisResultDisplay from './AnalysisResultDisplay';
import { MailIcon, MicrophoneIcon, ShieldCheckIcon, StopCircleIcon, ShieldExclamationIcon, ExternalLinkIcon, LightbulbIcon } from './icons/Icons';
import { MENTAL_HEALTH_SUPPORT, TAKEDOWN_RESOURCES, PLATFORM_REPORTING_GUIDES } from '../constants';


// Based on @google/genai documentation for Live API
const encode = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const createBlob = (data: Float32Array): Blob => {
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

type Tab = 'message' | 'email' | 'call' | 'harmful';

const ScamAnalyzer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('message');
  const [message, setMessage] = useState('');
  const [analysisMode, setAnalysisMode] = useState<'quick' | 'deep'>('quick');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [harmfulLink, setHarmfulLink] = useState('');
  const [reportingGuide, setReportingGuide] = useState<ReportingGuide | null>(null);
  const [unrecognizedLink, setUnrecognizedLink] = useState(false);
  const sessionRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setResult(null);
    setError(null);
    setMessage('');
    setSender('');
    setSubject('');
    setEmailBody('');
    setHarmfulLink('');
    setReportingGuide(null);
    setUnrecognizedLink(false);
  };

  const handleMessageAnalyze = useCallback(async () => {
    if (!message.trim()) {
      setError('Please enter a message to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisFunction = analysisMode === 'quick' ? quickScan : deepAnalysis;
      const analysisResult = await analysisFunction(message);
      setResult(analysisResult);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [message, analysisMode]);
  
  const handleEmailAnalyze = useCallback(async () => {
    if (!sender.trim() || !subject.trim() || !emailBody.trim()) {
        setError('Please fill in all email fields to analyze.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
        const analysisResult = await analyzeEmail(sender, subject, emailBody);
        setResult(analysisResult);
    } catch (e) {
        const err = e as Error;
        setError(err.message || 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  }, [sender, subject, emailBody]);

  const stopListeningCleanup = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    scriptProcessorRef.current?.disconnect();
    mediaStreamSourceRef.current?.disconnect();
    audioContextRef.current?.close().catch(console.error);
    sessionRef.current = null;
    setIsListening(false);
  }, []);

  const handleStartListening = useCallback(async () => {
    if (navigator.permissions) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permissionStatus.state === 'denied') {
          setError('Microphone access has been blocked. Please go to your browser settings to allow this site to access your microphone.');
          return;
        }
      } catch (e) {
        console.warn("Could not query microphone permission status:", e);
      }
    }

    setIsListening(true);
    setTranscript('');
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const context = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = context;

      sessionRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            const source = context.createMediaStreamSource(stream);
            mediaStreamSourceRef.current = source;
            const scriptProcessor = context.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(context.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const text = message.serverContent?.inputTranscription?.text;
            if (text) {
              setTranscript(prev => prev + text);
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error('Live session error:', e);
            setError(`A live session error occurred: ${e.message}. Please try again.`);
            stopListeningCleanup();
          },
          onclose: () => {
            stopListeningCleanup();
          },
        },
      });
    } catch (err) {
        console.error('Failed to start listening:', err);
        if (err instanceof DOMException) {
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError('Microphone access was denied. Please allow microphone access in your browser settings to use this feature.');
            } else if (err.name === 'NotFoundError') {
                setError('No microphone found on this device. Please connect a microphone and try again.');
            } else {
                setError(`Could not access microphone due to a hardware error: ${err.message}.`);
            }
        } else {
            setError('Could not start the listening session. Please ensure microphone access is granted and try again.');
        }
        setIsListening(false);
    }
  }, [stopListeningCleanup]);
  
  const handleStopListening = useCallback(async () => {
    if (sessionRef.current) {
        try {
            const session = await sessionRef.current;
            session.close();
        } catch (e) {
            console.error("Error closing session", e);
        }
    }
    stopListeningCleanup();
  }, [stopListeningCleanup]);

  const handleGetReportingHelp = () => {
    setReportingGuide(null);
    setUnrecognizedLink(false);
    setError(null);
    if (!harmfulLink.trim()) {
      setError("Please paste a link to get help.");
      return;
    }

    try {
      let fullUrl = harmfulLink;
      if (!/^https?:\/\//i.test(harmfulLink)) {
        fullUrl = `https://${harmfulLink}`;
      }
      
      const url = new URL(fullUrl);
      const hostname = url.hostname.replace('www.', '');

      const guide = PLATFORM_REPORTING_GUIDES.find(g => 
        g.domainKeywords.some(keyword => hostname.includes(keyword))
      );

      if (guide) {
        setReportingGuide(guide);
      } else {
        setUnrecognizedLink(true);
      }
    } catch (e) {
      setError("Invalid URL. Please enter a valid link.");
    }
  };


  const TabButton = ({ id, label, icon }: { id: Tab, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => handleTabChange(id)}
      className={`relative flex-1 flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-2 p-3 text-sm font-semibold rounded-t-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-dark focus-visible:ring-electric-purple ${
        activeTab === id
          ? 'bg-neutral-dark text-text-primary'
          : 'text-text-secondary hover:bg-neutral-light/50 hover:text-text-primary'
      }`}
    >
      {icon}
      <span>{label}</span>
      {activeTab === id && <div className="absolute bottom-0 h-0.5 w-full bg-electric-purple rounded-full"></div>}
    </button>
  );

  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <section className="max-w-4xl mx-auto bg-neutral-dark/50 backdrop-blur-xl p-1 sm:p-2 rounded-2xl border border-neutral-light shadow-card">
      <div className="flex flex-col sm:flex-row rounded-t-xl overflow-hidden bg-neutral-dark/30">
        <TabButton id="message" label="Message Analysis" icon={<ShieldCheckIcon className="h-5 w-5 mb-1 sm:mb-0" />} />
        <TabButton id="email" label="Email Guardian" icon={<MailIcon className="h-5 w-5 mb-1 sm:mb-0" />} />
        <TabButton id="call" label="Live Call Shield" icon={<MicrophoneIcon className="h-5 w-5 mb-1 sm:mb-0" />} />
        <TabButton id="harmful" label="Takedown Support" icon={<ShieldExclamationIcon className="h-5 w-5 mb-1 sm:mb-0" />} />
      </div>

      <div className="bg-neutral-dark p-6 sm:p-8 rounded-b-xl">
        {activeTab === 'message' && (
          <div>
            <div className="flex justify-center items-center bg-charcoal-black rounded-full p-1 max-w-sm mx-auto mb-6 ring-1 ring-neutral-light">
              <button onClick={() => setAnalysisMode('quick')} className={`w-1/2 py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-300 ${analysisMode === 'quick' ? 'bg-electric-purple text-white' : 'text-text-secondary hover:bg-neutral-light'}`}>Quick Scan</button>
              <button onClick={() => setAnalysisMode('deep')} className={`w-1/2 py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-300 ${analysisMode === 'deep' ? 'bg-deep-violet text-white' : 'text-text-secondary hover:bg-neutral-light'}`}>Deep Analysis</button>
            </div>
            <p className="mb-4 text-center text-text-secondary text-sm">
                {analysisMode === 'quick' ? 'Fast, real-time analysis for common threats.' : 'Advanced reasoning for complex, nuanced, and sophisticated threats.'}
            </p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Paste suspicious text here..." className="w-full h-40 p-4 bg-charcoal-black border border-neutral-light rounded-lg focus:ring-2 focus:ring-electric-purple focus:border-electric-purple focus:outline-none transition-all duration-200" disabled={isLoading} />
            <button onClick={handleMessageAnalyze} disabled={isLoading || !message.trim()} className="mt-4 w-full bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to bg-[size:200%_auto] animate-gradient-x hover:shadow-glow-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center">
              {isLoading ? <><LoadingSpinner /> Analyzing...</> : 'Initiate Analysis'}
            </button>
          </div>
        )}

        {activeTab === 'email' && (
            <div className="space-y-4">
                 <p className="text-center text-text-secondary text-sm">Analyze an email for phishing and scam indicators.</p>
                <input type="email" value={sender} onChange={e => setSender(e.target.value)} placeholder="Sender's Email Address" className="w-full p-3 bg-charcoal-black border border-neutral-light rounded-lg focus:ring-2 focus:ring-electric-purple focus:border-electric-purple focus:outline-none" disabled={isLoading} />
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject Line" className="w-full p-3 bg-charcoal-black border border-neutral-light rounded-lg focus:ring-2 focus:ring-electric-purple focus:border-electric-purple focus:outline-none" disabled={isLoading} />
                <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Paste the full email body here..." className="w-full h-40 p-4 bg-charcoal-black border border-neutral-light rounded-lg focus:ring-2 focus:ring-electric-purple focus:border-electric-purple focus:outline-none" disabled={isLoading} />
                <button onClick={handleEmailAnalyze} disabled={isLoading || !sender.trim() || !subject.trim() || !emailBody.trim()} className="w-full bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to bg-[size:200%_auto] animate-gradient-x hover:shadow-glow-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center">
                  {isLoading ? <><LoadingSpinner /> Analyzing...</> : 'Analyze Email'}
                </button>
            </div>
        )}

        {activeTab === 'call' && (
            <div className="text-center">
                <p className="text-text-secondary mb-6">Activate your shield to listen and transcribe a suspicious call in real-time. Place your microphone near the audio source.</p>
                {!isListening ? (
                    <button onClick={handleStartListening} className="bg-soft-mint/20 hover:bg-soft-mint/30 text-soft-mint font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto space-x-2">
                        <MicrophoneIcon className="h-5 w-5" />
                        <span>Activate Shield</span>
                    </button>
                ) : (
                    <button onClick={handleStopListening} className="bg-warm-amber/20 hover:bg-warm-amber/30 text-warm-amber font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto space-x-2 animate-pulse-slow">
                        <StopCircleIcon className="h-5 w-5" />
                        <span>Deactivate Shield</span>
                    </button>
                )}
                <div className="mt-6 p-4 bg-charcoal-black border border-neutral-light rounded-lg min-h-[12rem] text-left text-text-secondary whitespace-pre-wrap font-mono text-sm">
                    {transcript || (isListening ? 'Listening...' : 'Live transcript will appear here...')}
                </div>
            </div>
        )}

        {activeTab === 'harmful' && (
          <div>
            <h3 className="text-xl font-bold text-text-primary text-center">Harmful Content & Takedown Support</h3>
            <p className="text-center text-text-secondary text-sm my-4 max-w-2xl mx-auto">
              If someone has shared your intimate media online without your consent, know that this is not your fault. Support and powerful tools are available to help you regain control.
            </p>

            <div className="bg-warm-amber/10 border border-warm-amber/30 text-warm-amber rounded-lg p-4 my-6">
              <h4 className="font-bold text-lg flex items-center"><LightbulbIcon className="h-5 w-5 mr-2" />Your Well-being Is the Priority</h4>
              <p className="text-sm mt-2">{MENTAL_HEALTH_SUPPORT.description}</p>
              <div className="mt-3">
                <p className="font-semibold">{MENTAL_HEALTH_SUPPORT.name}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <a href={MENTAL_HEALTH_SUPPORT.website} target="_blank" rel="noopener noreferrer" className="text-sm bg-warm-amber/20 hover:bg-warm-amber/30 font-semibold py-1 px-3 rounded-full transition-colors">
                    Visit Website
                  </a>
                  <span className="text-sm font-mono bg-warm-amber/10 px-2 py-1 rounded">{MENTAL_HEALTH_SUPPORT.contact}</span>
                </div>
              </div>
            </div>

            <label htmlFor="harmful-link" className="block text-sm font-semibold text-text-secondary mb-2">
              Paste the link to the harmful content:
            </label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                id="harmful-link"
                type="url"
                value={harmfulLink}
                onChange={(e) => setHarmfulLink(e.target.value)}
                placeholder="https://example.com/harmful-content"
                className="flex-grow w-full p-3 bg-charcoal-black border border-neutral-light rounded-lg focus:ring-2 focus:ring-electric-purple focus:border-electric-purple focus:outline-none"
              />
              <button 
                onClick={handleGetReportingHelp}
                className="bg-gradient-to-r from-brand-gradient-from to-brand-gradient-to bg-[size:200%_auto] animate-gradient-x hover:shadow-glow-purple text-white font-bold py-3 px-6 rounded-lg flex-shrink-0"
              >
                Get Reporting Help
              </button>
            </div>

            {reportingGuide && (
              <div className="mt-6 p-4 bg-charcoal-black rounded-lg border border-electric-purple/50">
                <h4 className="font-bold text-text-primary text-lg">Reporting Guide for {reportingGuide.platform}</h4>
                <p className="text-sm text-text-secondary my-2">Follow these steps to report the content directly on their platform:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-text-primary pl-2">
                  {reportingGuide.instructions.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
                <a href={reportingGuide.reportingUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center space-x-2 text-sm bg-electric-purple hover:opacity-90 transition-opacity text-white font-semibold py-2 px-4 rounded-lg">
                  <span>Go to Reporting Page</span>
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              </div>
            )}

            {unrecognizedLink && (
              <div className="mt-6 p-4 bg-charcoal-black rounded-lg border border-warm-amber/50">
                <h4 className="font-bold text-warm-amber">Platform Not Recognized</h4>
                <p className="text-sm text-text-secondary mt-2 mb-4">
                  We couldn't automatically identify this platform. However, you can still take action using the powerful general resources below. We highly recommend starting with StopNCII.org.
                </p>
              </div>
            )}

            <div className="mt-8">
              <h4 className="font-bold text-lg text-text-primary mb-3">General Takedown Resources</h4>
              <div className="space-y-4">
                {TAKEDOWN_RESOURCES.map(resource => (
                  <div key={resource.organization} className="p-4 bg-charcoal-black rounded-lg border border-neutral-light">
                    <h5 className="font-bold text-text-primary">{resource.organization}</h5>
                    <p className="text-sm text-text-secondary mt-1 mb-3">{resource.description}</p>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-electric-purple hover:opacity-90 transition-opacity text-white font-semibold py-2 px-4 rounded-lg inline-block"
                    >
                      {resource.linkText}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {error && <div className="mt-6 p-4 bg-warm-amber/10 border border-warm-amber/30 text-warm-amber rounded-lg">{error}</div>}
        
        {(activeTab === 'message' || activeTab === 'email') && result && <AnalysisResultDisplay result={result} />}
      </div>
    </section>
  );
};

export default ScamAnalyzer;