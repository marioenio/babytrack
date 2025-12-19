import React, { useEffect, useState } from 'react';
import { getSessions, deleteSession } from '../services/storageService';
import { NursingSession } from '../types';
import { Trash2 } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const [sessions, setSessions] = useState<NursingSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja apagar este registro?')) {
      await deleteSession(id);
      loadData();
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    return `${m} min`;
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-4">
      <h2 className="text-xl font-bold text-gray-800 ml-1">Histórico de Mamadas</h2>
      
      {loading ? (
        <p className="text-center text-gray-400 py-12">Carregando...</p>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
          <p>Nenhuma mamada registrada ainda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-baby-50 text-baby-600 uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Horário</th>
                  <th className="px-4 py-3">Duração</th>
                  <th className="px-4 py-3 text-center">Fralda</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {formatDate(session.startTime)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatTime(session.startTime)} - {session.endTime ? formatTime(session.endTime) : '?'}
                    </td>
                    <td className="px-4 py-3 font-bold text-baby-500">
                      {formatDuration(session.durationSeconds)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-1">
                        {session.hasPee && <span title="Xixi" className="text-blue-400 text-lg">💧</span>}
                        {session.hasPoop && <span title="Cocô" className="text-yellow-600 text-lg">💩</span>}
                        {!session.hasPee && !session.hasPoop && <span className="text-gray-300">-</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDelete(session.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};