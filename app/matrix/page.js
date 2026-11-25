'use client';
import Link from 'next/link';
import { useFetch, Loading, useBlind, who } from '@/components/ui';

const color = (c) => c.band === 'Strong' ? 'bg-emerald-500 text-white' : c.band === 'Possible' ? 'bg-amber-300' : 'bg-slate-100 text-slate-500';

export default function Matrix() {
  const { data, error } = useFetch('/api/matrix');
  const [blind] = useBlind();
  if (!data) return <Loading error={error} />;
  return (
    <div className="space-y-4">
      <h1>Match Matrix</h1>
      <p className="text-sm text-slate-500">Every candidate scored against every vacancy. A thick border means where they applied. Green cells without a border are people who are a strong fit for a job they never applied for.</p>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr><th className="text-left p-2">Candidate</th>{data.vacancies.map((v) => <th key={v.id} className="p-2"><Link href={`/vacancies/${v.id}`} className="hover:underline">{v.title}</Link></th>)}</tr></thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2"><Link href={`/candidates/${r.id}`} className="font-medium hover:underline">{who(r, blind)}</Link></td>
                {r.cells.map((c, i) => (
                  <td key={i} className="p-1.5 text-center">
                    <div className={`rounded-lg py-2 font-bold ${color(c)} ${c.applied ? 'ring-4 ring-slate-800' : ''}`}>{c.overall}%{c.hiddenGem ? ' 💎' : ''}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
