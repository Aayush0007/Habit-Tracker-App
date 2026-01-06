import React, { useState, useEffect } from 'react';
import { initDB } from '../../db/indexedDB/dbConfig';
import MockForm from './MockForm';
import { Trophy, TrendingUp, AlertCircle } from 'lucide-react';

const MockTests = () => {
  const [mocks, setMocks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchMocks = async () => {
    const db = await initDB();
    const allMocks = await db.getAll('mock_exams');
    setMocks(allMocks.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  useEffect(() => {
    fetchMocks();
  }, []);

  const handleSaveMock = async (mockData) => {
    const db = await initDB();
    await db.add('mock_exams', {
      ...mockData,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
    fetchMocks();
  };

  const deleteMock = async (id) => {
    const db = await initDB();
    await db.delete('mock_exams', id);
    fetchMocks();
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mock Analysis</h1>
          <p className="text-slate-400 text-sm">Quantify your progress</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg transition-colors"
        >
          {showForm ? 'Close' : 'Add Mock'}
        </button>
      </header>

      {showForm && <MockForm onSave={handleSaveMock} />}

      <div className="space-y-4">
        {mocks.length === 0 ? (
          <div className="card text-center py-10 opacity-50 border-dashed">
            <AlertCircle className="mx-auto mb-2" />
            <p>No mocks logged yet. Time to test yourself!</p>
          </div>
        ) : (
          mocks.map(mock => (
            <div key={mock.id} className="card flex justify-between items-center border-l-4 border-blue-500">
              <div>
                <h3 className="font-bold text-slate-100">{mock.examName}</h3>
                <div className="flex gap-2 text-[10px] uppercase font-black tracking-widest text-slate-500 mt-1">
                  <span>{mock.category}</span>
                  <span>•</span>
                  <span>{mock.difficulty}</span>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <span className="text-2xl font-black text-blue-400">{mock.score}</span>
                  <span className="text-slate-600 text-xs ml-1">pts</span>
                </div>
                <button 
                  onClick={() => deleteMock(mock.id)}
                  className="text-slate-700 hover:text-rose-500 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MockTests;