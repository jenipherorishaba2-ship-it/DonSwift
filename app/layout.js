import './globals.css';
import Nav from '@/components/Nav';

export const metadata = { title: 'TalentLens · Donswift', description: 'Skills over CVs, humans over algorithms' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex">
          <Nav />
          <main className="flex-1 p-8 max-w-7xl">{children}</main>
        </div>
      </body>
    </html>
  );
}
