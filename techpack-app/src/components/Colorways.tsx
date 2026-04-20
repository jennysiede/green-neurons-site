import React from 'react';
import { Colorway } from '../types';

interface Props {
  colorways: Colorway[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Colorway, value: string) => void;
  onRemove: (id: string) => void;
}

const COLOR_FIELDS: Array<{ key: keyof Colorway; label: string }> = [
  { key: 'self', label: 'Self' },
  { key: 'combo', label: 'Combo' },
  { key: 'lining', label: 'Lining' },
  { key: 'trimA', label: 'Trim A' },
  { key: 'trimB', label: 'Trim B' },
];

export const Colorways: React.FC<Props> = ({ colorways, onAdd, onUpdate, onRemove }) => (
  <section>
    <div className="card">
      <div className="card-header">
        <span className="card-title">Colorways</span>
        <button className="btn btn-sm" onClick={onAdd}>+ Add colorway</button>
      </div>

      {colorways.map((cw, idx) => (
        <div key={cw.id} className={`colorway-block${idx < colorways.length - 1 ? ' border-bottom' : ''}`}>
          <div className="colorway-row-header">
            <input
              className="colorway-name"
              value={cw.name}
              onChange={e => onUpdate(cw.id, 'name', e.target.value)}
            />
            <button className="btn btn-sm btn-danger" onClick={() => onRemove(cw.id)}>Remove</button>
          </div>
          <div className="color-fields">
            {COLOR_FIELDS.map(f => (
              <div key={f.key} className="color-field">
                <label>{f.label}</label>
                <div className="color-input-row">
                  <input
                    type="color"
                    value={cw[f.key] && cw[f.key].startsWith('#') ? cw[f.key] : '#888888'}
                    onChange={e => onUpdate(cw.id, f.key, e.target.value)}
                    className="color-swatch-input"
                  />
                  <input
                    type="text"
                    value={cw[f.key]}
                    placeholder="Color / ref code"
                    onChange={e => onUpdate(cw.id, f.key, e.target.value)}
                    className="color-text-input"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="field" style={{ marginTop: '0.5rem' }}>
            <label>Notes</label>
            <input
              type="text"
              value={cw.notes}
              placeholder="Special instructions..."
              onChange={e => onUpdate(cw.id, 'notes', e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>

    <div className="card">
      <div className="card-header"><span className="card-title">Colorway matrix</span></div>
      <div className="table-scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th>Colorway</th>
              {COLOR_FIELDS.map(f => <th key={f.key}>{f.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {colorways.map(cw => (
              <tr key={cw.id}>
                <td><strong>{cw.name}</strong></td>
                {COLOR_FIELDS.map(f => (
                  <td key={f.key}>
                    {cw[f.key] ? (
                      <div className="matrix-cell">
                        <span
                          className="dot"
                          style={{ background: cw[f.key].startsWith('#') ? cw[f.key] : '#ccc' }}
                        />
                        <span className="matrix-label">{cw[f.key]}</span>
                      </div>
                    ) : <span className="muted">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);
