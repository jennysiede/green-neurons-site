import React from 'react';
import { StyleHeader } from '../types';

interface Props {
  header: StyleHeader;
  onChange: (field: keyof StyleHeader, value: string) => void;
}

const fields: Array<{ key: keyof StyleHeader; label: string; placeholder: string; type?: string; full?: boolean; textarea?: boolean }> = [
  { key: 'label', label: 'Label / Project', placeholder: 'Brand or project name' },
  { key: 'styleNumber', label: 'Style #', placeholder: 'e.g. GN-2025-001' },
  { key: 'season', label: 'Season', placeholder: 'e.g. FW26' },
  { key: 'date', label: 'Date', placeholder: '', type: 'date' },
  { key: 'description', label: 'Description', placeholder: 'e.g. Unisex Tech Jacket with PCB pocket', full: true },
  { key: 'fabrication', label: 'Fabrication', placeholder: 'e.g. 4-way stretch neoprene, 320gsm', full: true },
  { key: 'sizeRange', label: 'Size Range', placeholder: 'e.g. XS–3XL' },
  { key: 'sampleSize', label: 'Sample Size', placeholder: 'e.g. M / 10' },
  { key: 'designer', label: 'Designer / Patternmaker', placeholder: 'Name', full: true },
  { key: 'notes', label: 'Notes', placeholder: 'General notes, standards, disclaimers...', full: true, textarea: true },
];

export const CoverSheet: React.FC<Props> = ({ header, onChange }) => (
  <section>
    <div className="card">
      <div className="card-header">
        <span className="card-title">Style header</span>
        <span className="badge">Populates all pages</span>
      </div>
      <div className="field-grid">
        {fields.map(f => (
          <div key={f.key} className={`field${f.full ? ' full' : ''}`}>
            <label>{f.label}</label>
            {f.textarea ? (
              <textarea
                value={header[f.key]}
                placeholder={f.placeholder}
                onChange={e => onChange(f.key, e.target.value)}
                rows={3}
              />
            ) : (
              <input
                type={f.type || 'text'}
                value={header[f.key]}
                placeholder={f.placeholder}
                onChange={e => onChange(f.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);
