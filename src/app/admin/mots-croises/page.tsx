import { getAllCrosswordsAdmin } from '@/app/clients/sanityClient';
import Link from 'next/link';
import { logout } from '../actions/auth';
import { Button } from '@/components/ui/button';
import { Pencil, Plus } from 'lucide-react';
import DeleteCrosswordButton from './components/DeleteCrosswordButton';

const difficultyStyles: Record<string, string> = {
  facile: 'bg-emerald-100 text-emerald-800',
  moyen: 'bg-yellow-100 text-yellow-800',
  difficile: 'bg-red-100 text-red-800',
};

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function AdminCrosswordListPage() {
  const crosswords = await getAllCrosswordsAdmin();

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mots croisés</h1>
        <div className="flex gap-2">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 !text-white" size="sm">
            <Link href="/admin/mots-croises/nouveau">
              <Plus className="h-4 w-4 mr-1" />
              Nouveau
            </Link>
          </Button>
          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit">Déconnexion</Button>
          </form>
        </div>
      </div>

      {crosswords.length === 0 ? (
        <p className="text-slate-500 text-sm">Aucun mot croisé pour l'instant.</p>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Titre</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Difficulté</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Disponible</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {crosswords.map(cw => (
                <tr key={cw._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{cw.title}</div>
                    <div className="text-xs text-slate-400 font-mono">{cw.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyStyles[cw.difficulty] ?? ''}`}>
                      {cw.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(cw.availableFrom)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/mots-croises/${cw.slug}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteCrosswordButton id={cw._id} slug={cw.slug} title={cw.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
