'use client';
import { useState, useRef, useEffect } from 'react';
import { MicButton, SpeakButton, speak } from '@/components/Voice';
import Logo from '@/components/Logo';

const QUICK = ['Has my application moved? TL-1001', 'I am deaf, can I still apply? TL-1009', 'Which jobs fit me? TL-1008', 'Why was I not selected? TL-1001', 'How do I apply without a CV?', 'What is the skills challenge?', 'When are the deadlines?', 'I want to talk to a person'];

export default function Assistant() {
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Hello! I am the Donswift Careers assistant. I answer 24/7 so you never have to wait on the phone. Ask about your application (include your reference, e.g. TL-1001), open jobs, or the skills challenge.' }]);
  const [input, setInput] = useState('');
  const [ref, setRef] = useState('');
  const [autoRead, setAutoRead] = useState(false);
  const end = useRef(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: 'smooth' }), [msgs]);
  const send = async (text) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: 'me', text }]);
    setInput('');
    const r = await fetch('/api/assistant', { method: 'POST', body: JSON.stringify({ message: text, ref }) });
    const j = await r.json();
    if (j.candidate && !ref) setRef(j.candidate.ref);
    setMsgs((m) => [...m, { from: 'bot', text: j.answer || j.error, intent: j.intent }]);
    if (autoRead) speak(j.answer);
  };
  return (
    <div className="max-w-2xl space-y-4">
      <h1>💬 Candidate Assistant</h1>
      <p className="text-sm text-slate-500">Handles the ~45 daily "has my application moved?" calls. Works on web; the same logic can sit behind WhatsApp or USSD.</p>
      <div className="flex gap-2 items-center text-sm"><span className="label !mb-0">Reference</span><input className="input !w-40" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="TL-1001" /><label className="text-xs flex items-center gap-1 ml-4"><input type="checkbox" checked={autoRead} onChange={(e) => setAutoRead(e.target.checked)} /> 🔊 Read answers aloud</label></div>
      <div className="rounded-t-2xl bg-brand-800 text-white px-4 py-2 flex items-center gap-3 -mb-4"><div className="bg-white rounded-lg px-2 py-1"><Logo size="sm" /></div><div><div className="font-semibold text-sm">Donswift Careers Assistant</div><div className="text-[11px] text-brand-200">● online 24/7 · powered by TalentLens</div></div></div>
      <div className="card !rounded-t-none h-[460px] overflow-y-auto space-y-3 bg-[#ece5dd]">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : ''}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap shadow-sm ${m.from === 'me' ? 'bg-[#dcf8c6]' : 'bg-white'}`}>{m.text}{m.from === 'bot' && <div className="flex items-center gap-2 mt-1"><SpeakButton text={m.text} />{m.intent && <span className="text-[10px] text-slate-400">intent: {m.intent}</span>}</div>}</div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <div className="flex flex-wrap gap-1">{QUICK.map((q) => <button key={q} onClick={() => send(q)} className="text-xs bg-white border rounded-full px-3 py-1 hover:bg-brand-50">{q}</button>)}</div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2"><input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a question…" /><MicButton label="Ask" onText={(t) => send(t)} /><button className="btn-primary">Send</button></form>
      <p className="text-xs text-slate-500">♿ Speak instead of typing (🎤), or have answers read aloud. Deaf candidates can use text only; no phone call is ever required.</p>
    </div>
  );
}
