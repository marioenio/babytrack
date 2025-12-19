import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bath, Scale, Trash2, Plus, Ruler } from 'lucide-react';
import { saveBath, getBaths, deleteBath, saveWeight, getWeights, deleteWeight, saveHeight, getHeights, deleteHeight } from '../services/storageService';
import { BathRecord, WeightRecord, HeightRecord } from '../types';

export const CareView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bath' | 'weight' | 'height'>('bath');

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-24">
      <h2 className="text-xl font-bold text-gray-800 mb-4 ml-1">Cuidados & Crescimento</h2>
      
      {/* Tabs */}
      <div className="flex p-1 mb-6 bg-gray-100 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('bath')}
          className={`flex-1 min-w-[80px] py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'bath' ? 'bg-white text-baby-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Bath size={16} /> Banhos
        </button>
        <button
          onClick={() => setActiveTab('weight')}
          className={`flex-1 min-w-[80px] py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'weight' ? 'bg-white text-baby-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Scale size={16} /> Peso
        </button>
        <button
          onClick={() => setActiveTab('height')}
          className={`flex-1 min-w-[80px] py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'height' ? 'bg-white text-baby-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Ruler size={16} /> Altura
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'bath' && <BathTracker />}
        {activeTab === 'weight' && <WeightTracker />}
        {activeTab === 'height' && <HeightTracker />}
      </div>
    </div>
  );
};

const BathTracker: React.FC = () => {
  const [baths, setBaths] = useState<BathRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  const loadBaths = async () => setBaths(await getBaths());

  useEffect(() => {
    loadBaths();
    const now = new Date();
    setDateStr(now.toISOString().split('T')[0]);
    setTimeStr(now.toTimeString().slice(0, 5));
  }, []);

  const handleSave = async () => {
    if (!dateStr || !timeStr) return;
    const date = new Date(`${dateStr}T${timeStr}`);
    await saveBath(date);
    setIsAdding(false);
    loadBaths();
  };

  const handleDelete = async (id: string) => {
    if(confirm('Apagar registro de banho?')) {
      await deleteBath(id);
      loadBaths();
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {!isAdding ? (
        <Button fullWidth variant="secondary" onClick={() => setIsAdding(true)}>
          <Plus size={18} className="mr-2" /> Registrar Banho
        </Button>
      ) : (
        <Card className="bg-blue-50 border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-3">Novo Banho</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-blue-600 font-bold ml-1">Data</label>
              <input 
                type="date" 
                value={dateStr}
                onChange={e => setDateStr(e.target.value)}
                className="w-full p-2 rounded-lg border border-blue-200 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-blue-600 font-bold ml-1">Hora</label>
              <input 
                type="time" 
                value={timeStr}
                onChange={e => setTimeStr(e.target.value)}
                className="w-full p-2 rounded-lg border border-blue-200 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" fullWidth variant="secondary" onClick={() => setIsAdding(false)}>Cancelar</Button>
            <Button size="sm" fullWidth onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">Salvar</Button>
          </div>
        </Card>
      )}

      <div className="space-y-2 mt-4">
        {baths.map(bath => (
          <div key={bath.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <Bath size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {new Date(bath.dateTime).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(bath.dateTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
            <button onClick={() => handleDelete(bath.id)} className="text-gray-300 hover:text-red-500 p-2">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {baths.length === 0 && !isAdding && (
          <p className="text-center text-gray-400 py-8 text-sm">Nenhum banho registrado.</p>
        )}
      </div>
    </div>
  );
};

const WeightTracker: React.FC = () => {
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [dateStr, setDateStr] = useState('');

  const loadWeights = async () => {
    const data = await getWeights();
    // Sort by date descending for list, but we might need ascending for chart
    const w = data.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    setWeights(w);
  };

  useEffect(() => {
    loadWeights();
    setDateStr(new Date().toISOString().split('T')[0]);
  }, []);

  const handleSave = async () => {
    if (!weightInput || !dateStr) return;
    const w = parseFloat(weightInput.replace(',', '.'));
    if (isNaN(w)) return;

    await saveWeight(w, new Date(dateStr));
    setWeightInput('');
    setIsAdding(false);
    loadWeights();
  };

  const handleDelete = async (id: string) => {
    if(confirm('Apagar registro de peso?')) {
      await deleteWeight(id);
      loadWeights();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {weights.length >= 2 && (
        <Card title="Curva de Crescimento (Kg)">
          <div className="h-48 w-full mt-2">
            <SimpleLineChart 
              data={weights.map(w => ({ value: w.weightKg, date: w.dateTime }))} 
              color="#16a34a"
            />
          </div>
        </Card>
      )}

      {!isAdding ? (
        <Button fullWidth variant="secondary" onClick={() => setIsAdding(true)}>
          <Plus size={18} className="mr-2" /> Registrar Peso
        </Button>
      ) : (
        <Card className="bg-green-50 border-green-100">
          <h3 className="font-semibold text-green-800 mb-3">Novo Peso</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="col-span-2">
              <label className="text-xs text-green-600 font-bold ml-1">Peso (kg)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="Ex: 3.450"
                value={weightInput}
                onChange={e => setWeightInput(e.target.value)}
                className="w-full p-2 rounded-lg border border-green-200 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-green-600 font-bold ml-1">Data</label>
              <input 
                type="date" 
                value={dateStr}
                onChange={e => setDateStr(e.target.value)}
                className="w-full p-2 rounded-lg border border-green-200 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" fullWidth variant="secondary" onClick={() => setIsAdding(false)}>Cancelar</Button>
            <Button size="sm" fullWidth onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">Salvar</Button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {weights.map(w => (
          <div key={w.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <Scale size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">
                  {w.weightKg.toFixed(3)} kg
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(w.dateTime).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <button onClick={() => handleDelete(w.id)} className="text-gray-300 hover:text-red-500 p-2">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
         {weights.length === 0 && !isAdding && (
          <p className="text-center text-gray-400 py-8 text-sm">Nenhum peso registrado.</p>
        )}
      </div>
    </div>
  );
};

const HeightTracker: React.FC = () => {
  const [heights, setHeights] = useState<HeightRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [heightInput, setHeightInput] = useState('');
  const [dateStr, setDateStr] = useState('');

  const loadHeights = async () => {
    const data = await getHeights();
    const h = data.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    setHeights(h);
  };

  useEffect(() => {
    loadHeights();
    setDateStr(new Date().toISOString().split('T')[0]);
  }, []);

  const handleSave = async () => {
    if (!heightInput || !dateStr) return;
    const h = parseFloat(heightInput.replace(',', '.'));
    if (isNaN(h)) return;

    await saveHeight(h, new Date(dateStr));
    setHeightInput('');
    setIsAdding(false);
    loadHeights();
  };

  const handleDelete = async (id: string) => {
    if(confirm('Apagar registro de altura?')) {
      await deleteHeight(id);
      loadHeights();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       {heights.length >= 2 && (
        <Card title="Curva de Crescimento (cm)">
          <div className="h-48 w-full mt-2">
            <SimpleLineChart 
              data={heights.map(h => ({ value: h.heightCm, date: h.dateTime }))} 
              color="#8b5cf6"
            />
          </div>
        </Card>
      )}

      {!isAdding ? (
        <Button fullWidth variant="secondary" onClick={() => setIsAdding(true)}>
          <Plus size={18} className="mr-2" /> Registrar Altura
        </Button>
      ) : (
        <Card className="bg-purple-50 border-purple-100">
          <h3 className="font-semibold text-purple-800 mb-3">Nova Altura</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="col-span-2">
              <label className="text-xs text-purple-600 font-bold ml-1">Altura (cm)</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="Ex: 50.5"
                value={heightInput}
                onChange={e => setHeightInput(e.target.value)}
                className="w-full p-2 rounded-lg border border-purple-200 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-purple-600 font-bold ml-1">Data</label>
              <input 
                type="date" 
                value={dateStr}
                onChange={e => setDateStr(e.target.value)}
                className="w-full p-2 rounded-lg border border-purple-200 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" fullWidth variant="secondary" onClick={() => setIsAdding(false)}>Cancelar</Button>
            <Button size="sm" fullWidth onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">Salvar</Button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {heights.map(h => (
          <div key={h.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Ruler size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">
                  {h.heightCm.toFixed(1)} cm
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(h.dateTime).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <button onClick={() => handleDelete(h.id)} className="text-gray-300 hover:text-red-500 p-2">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
         {heights.length === 0 && !isAdding && (
          <p className="text-center text-gray-400 py-8 text-sm">Nenhuma altura registrada.</p>
        )}
      </div>
    </div>
  );
};

// --- Simple SVG Line Chart Component ---
const SimpleLineChart: React.FC<{ data: { value: number; date: string }[], color: string }> = ({ data, color }) => {
  // Sort data chronologically for the chart
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  if (sortedData.length < 2) return null;

  const width = 100; // viewbox units
  const height = 50; // viewbox units
  const padding = 5;

  const minVal = Math.min(...sortedData.map(d => d.value));
  const maxVal = Math.max(...sortedData.map(d => d.value));
  const timeStart = new Date(sortedData[0].date).getTime();
  const timeEnd = new Date(sortedData[sortedData.length - 1].date).getTime();
  
  const timeRange = timeEnd - timeStart;
  const valRange = maxVal - minVal;

  // Helper to map data to coordinates
  const getX = (dateStr: string) => {
    const t = new Date(dateStr).getTime();
    if (timeRange === 0) return width / 2;
    return padding + ((t - timeStart) / timeRange) * (width - 2 * padding);
  };

  const getY = (val: number) => {
    if (valRange === 0) return height / 2;
    return height - (padding + ((val - minVal) / valRange) * (height - 2 * padding));
  };

  const points = sortedData.map(d => `${getX(d.date)},${getY(d.value)}`).join(' ');

  return (
    <div className="w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        {/* Grid lines (simplified) */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#eee" strokeWidth="0.5" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#eee" strokeWidth="0.5" />

        {/* The Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={points}
          vectorEffect="non-scaling-stroke"
        />

        {/* Dots */}
        {sortedData.map((d, i) => (
          <circle 
            key={i} 
            cx={getX(d.date)} 
            cy={getY(d.value)} 
            r="1.5" 
            fill="white" 
            stroke={color}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        
        {/* Labels (Min/Max) */}
        <text x={padding} y={height} fontSize="4" fill="#999" dy="-2">
          {new Date(sortedData[0].date).toLocaleDateString(undefined, {month:'numeric', day:'numeric'})}
        </text>
        <text x={width - padding} y={height} fontSize="4" fill="#999" textAnchor="end" dy="-2">
          {new Date(sortedData[sortedData.length-1].date).toLocaleDateString(undefined, {month:'numeric', day:'numeric'})}
        </text>
      </svg>
    </div>
  );
};