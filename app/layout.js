import './theme.css';
import './globals.css';
import Nav from '@/components/Nav';
import Logo from '@/components/Logo';

export const metadata = { title: 'TalentLens · Donswift', description: 'Skills over CVs, humans over algorithms' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Nav />
          <div className="flex-1 min-w-0">
            <header className="flex items-center justify-between bg-white px-8 py-3">
              <div className="flex items-center gap-3"><Logo size="sm" /><span className="text-slate-300">|</span><span className="font-bold text-brand-800">TalentLens</span><span className="text-sm text-slate-500">Recruitment platform built for Donswift Company Ltd</span></div>
              <span className="text-xs text-slate-400">Recruiter workspace</span>
            </header>
            <div className="brand-gradient h-1.5" />
            <main className="p-8 max-w-7xl">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
