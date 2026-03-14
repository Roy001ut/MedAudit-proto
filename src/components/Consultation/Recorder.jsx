import { useState, useRef, useEffect } from 'react';
import LoadingCard from '../shared/LoadingCard.jsx';
import ErrorBanner from '../shared/ErrorBanner.jsx';
import { callClaude } from '../../lib/claude.js';
import { insertConsultation } from '../../db/queries.js';
import { Mic, MicOff, Send } from 'lucide-react';

const SYSTEM = `You are a medical scribe AI. Extract structured info from doctor consultation transcripts. Return ONLY valid JSON.`;
const PROMPT = (transcript) => `Transcript:

${transcript}

Return JSON:
{
  "date": "",
  "diagnoses": [{ "name": "", "plain_english": "" }],
  "medications": [{ "name": "", "dosage": "", "frequency": "" }],
  "tests_ordered": [{ "name": "", "reason": "" }],
  "follow_up": "",
  "key_points": [],
  "action_items": []
}`;

export default function Recorder({ onConsult }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);
  const recognitionRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const supported = !!SpeechRecognition;

  function startRecording() {
    if (!supported) {
      setError('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = transcript;

    recognition.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript + ' ';
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interim);
    };

    recognition.onerror = (e) => setError(`Speech error: ${e.error}`);
    recognition.onend = () => setRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setRecording(true);
    setStartTime(Date.now());
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setRecording(false);
  }

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  async function analyze() {
    if (!transcript.trim()) {
      setError('No transcript to analyze.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
      const result = await callClaude(SYSTEM, PROMPT(transcript));

      insertConsultation({
        date: result.date || new Date().toISOString().slice(0, 10),
        duration_seconds: duration,
        transcript,
        diagnoses: result.diagnoses,
        medications: result.medications,
        tests_ordered: result.tests_ordered,
        follow_up: result.follow_up,
      });

      onConsult(result);
      setTranscript('');
      setStartTime(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingCard message="Transcribing consultation notes..." />;

  return (
    <div className="space-y-4">
      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="flex gap-3">
        {!recording ? (
          <button
            onClick={startRecording}
            disabled={!supported}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors"
          >
            <Mic size={18} /> Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors animate-pulse"
          >
            <MicOff size={18} /> Stop Recording
          </button>
        )}
        {recording && (
          <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording...
          </div>
        )}
      </div>

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Live transcript will appear here... or type/paste a consultation transcript manually."
        className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-40 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <button
        onClick={analyze}
        disabled={!transcript.trim()}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        <Send size={16} /> Analyze Transcript
      </button>
    </div>
  );
}
