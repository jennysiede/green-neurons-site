import React, { useState, useRef } from 'react';
import { CoverSheet } from './components/CoverSheet';
import { Colorways } from './components/Colorways';
import { BOM } from './components/BOM';
import { POMSpec } from './components/POMSpec';
import { useTechPack } from './hooks/useTechPack';
import './App.css';

type Tab = 'cover' | 'colorway' | 'bom' | 'pom';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'cover', label: 'Cover sheet' },
  { id: 'colorway', label: 'Colorways' },
  { id: 'bom', label: 'BOM' },
  { id: 'pom', label: 'POM / Spec' },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('cover');
  const importRef = useRef<HTMLInputElement>(null);
  const tp = useTechPack();

  const styleLabel = tp.header.styleNumber || '—';
  const seasonLabel = tp.header.season || '—';

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) tp.importJSON(file);
    e.target.value = '';
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-left">
          <a href="https://greenneurons.us" className="logo-link" target="_blank" rel="noreferrer">
            <span className="logo-text">Green Neurons</span>
          </a>
          <span className="header-divider">/</span>
          <span className="header-title">Tech Pack Builder</span>
        </div>
        <div className="header-meta">
          <span className="meta-pill">Style: {styleLabel}</span>
          <span className="meta-pill">Season: {seasonLabel}</span>
        </div>
        <div className="header-actions">
          <input ref={importRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          <button className="btn" onClick={() => importRef.current?.click()}>Import JSON</button>
          <button className="btn btn-primary" onClick={tp.exportJSON}>Export JSON ↓</button>
        </div>
      </header>

      <nav className="tab-nav">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 'cover' && <CoverSheet header={tp.header} onChange={tp.updateHeader} />}
        {activeTab === 'colorway' && <Colorways colorways={tp.colorways} onAdd={tp.addColorway} onUpdate={tp.updateColorway} onRemove={tp.removeColorway} />}
        {activeTab === 'bom' && <BOM rows={tp.bom} onAdd={tp.addBomRow} onUpdate={tp.updateBomRow} onRemove={tp.removeBomRow} />}
        {activeTab === 'pom' && <POMSpec sizes={tp.pomSizes} rows={tp.pomRows} onSizesChange={tp.setPomSizes} onAdd={tp.addPomRow} onUpdateMeasurement={tp.updatePomMeasurement} onUpdateTolerance={tp.updatePomTolerance} onRemove={tp.removePomRow} />}
      </main>

      <footer className="app-footer">
        <span>© {new Date().getFullYear()} Green Neurons Design and Technologies PBC</span>
        <span className="footer-sep">·</span>
        <span>Tech Pack Builder v1.0</span>
      </footer>
    </div>
  );
}

export default App;
