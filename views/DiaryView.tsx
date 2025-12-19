import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BookHeart, Plus, Trash2, Calendar } from 'lucide-react';
import { saveDiaryEntry, getDiaryEntries, deleteDiaryEntry } from '../services/storageService';
import { DiaryEntry } from '../types';

export const DiaryView: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState('');
  const [dateStr, setDateStr] = useState('');

  const loadEntries = async () => {
    const data = await getDiaryEntries();
    setEntries(data);
  };

  useEffect(() => {
    loadEntries();
    setDateStr(new Date().toISOString().split('T')[0]);
  }, []);

  const handleSave = async () => {
    if (!content.trim() || !dateStr) return;
    await saveDiaryEntry(content, new Date(dateStr));
    setContent('');
    setIsAdding(false);
    loadEntries();
  };

  const handleDelete = async (id: string) => {
    if(confirm('Apagar esta anotação?')) {
      await deleteDiaryEntry(id);
      loadEntries();
    }
  };

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-24 space-y-4">
      <div className="flex items-center justify-between ml-1">
        <h2 className="text-xl font-bold text-gray-800">Diário de Bordo</h2>
        {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="text-baby-500 hover:text-baby-600 font-medium text-sm flex items-center">
                <Plus size={16} className="mr-1" /> Nova Nota
            </button>
        )}
      </div>

      {isAdding && (
        <Card className="bg-pink-50 border-pink-100 animate-fade-in">
          <div className="space-y-3">
             <div className="flex items-center gap-2 mb-2">
                 <Calendar size={16} className="text-pink-400" />
                 <input 
                    type="date" 
                    value={dateStr}
                    onChange={e => setDateStr(e.target.value)}
                    className="bg-transparent border-b border-pink-200 text-sm focus:outline-none focus:border-pink-400"
                 />
             </div>
             <textarea 
                className="w-full p-3 rounded-xl border border-pink-200 bg-white text-gray-700 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 outline-none h-32 resize-none"
                placeholder="Como foi o dia hoje? Alguma novidade no comportamento?"
                value={content}
                onChange={e => setContent(e.target.value)}
             ></textarea>
             <div className="flex gap-2 justify-end">
                <Button size="sm" variant="secondary" onClick={() => setIsAdding(false)}>Cancelar</Button>
                <Button size="sm" onClick={handleSave}>Salvar Nota</Button>
             </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {entries.map(entry => (
          <Card key={entry.id} className="relative group">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-baby-400 uppercase tracking-wide">
              <BookHeart size={14} />
              {new Date(entry.dateTime).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {entry.content}
            </p>
            <button 
                onClick={() => handleDelete(entry.id)} 
                className="absolute top-4 right-4 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 size={16} />
            </button>
          </Card>
        ))}
        {entries.length === 0 && !isAdding && (
             <div className="text-center py-12 text-gray-400">
                 <BookHeart size={48} className="mx-auto mb-3 opacity-20" />
                 <p>Nenhuma anotação no diário ainda.</p>
             </div>
        )}
      </div>
    </div>
  );
};