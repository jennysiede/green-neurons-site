import React, { useState, useMemo } from 'react';
import { PomRow } from '../types';
import { POM_MASTER } from '../data/pomMaster';

interface Props {
  sizes: string[];
  rows: PomRow[];
  onSizesChange: (sizes: string[]) => void;
  onAdd: (entry: { code: number; name: string; tolerance: number }) => void;
  onUpdateMeasurement: (code: number | string, size: string, value: string) => void;
  onUpdateTolerance: (code: number | string, value: string) => void;
  onRemove: (code: number | string) => void;
}

export const POMSpec: React.FC<Props> = ({
  sizes, rows, onSizesChange, onAdd, onUpdateMeasurement, onUpdateTolerance, onRemove
}) => {
  const [search, setSearch] = useState('');
  const [sizesInput, setSizesInput] = useState(sizes.join(', '));

  const filtered = useMemo(() =>
    POM_MASTER.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.code).includes(search)
    ), [search]);

  const selectedCodes = new Set(rows.map(r => r.code));

  const handleSizesBlur = () => {
    const parsed = sizesInput.split(',').map(s => s.trim()).filter(Boolean);
    onSizesChange(parsed);
  };

  return (
    <section>
      <div className="pom-layout">
        <div className="pom-sidebar">
          <div className="card-title" style={{ marginBottom: '0.5rem' }}>POM master list</div>
          <input
            className="search-input"
            type="text"
            placeholder="Search measurements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="pom-list">
            {filtered.map(p => (
              <div
                key={p.code}
                className={`pom-item${selectedCodes.has(p.code) ? ' selected' : ''}`}
                onClick={() => onAdd(p)}
              >
                <span className="pom-item-name">{p.name}</span>
                <span className="pom-code">{p.code}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pom-main">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Selected POMs</span>
              <div className="sizes-control">
                <label>Sizes:</label>
                <input
                  value={sizesInput}
                  onChange={e => setSizesInput(e.target.value)}
                  onBlur={handleSizesBlur}
                  placeholder="XS, S, M, L, XL"
                  className="sizes-input"
                />
              </div>
            </div>

            {rows.length === 0 ? (
              <p className="empty-state">Click a measurement from the list to add it.</p>
            ) : (
              <div className="table-scroll">
                <table className="tbl pom-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Point of measure</th>
                      <th>Tol ±</th>
                      {sizes.map(s => <th key={s}>{s}</th>)}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={String(r.code)}>
                        <td><span className="pom-code">{r.code}</span></td>
                        <td className="pom-name">{r.name}</td>
                        <td>
                          <input
                            value={String(r.tolerance)}
                            style={{ width: '44px', textAlign: 'center' }}
                            onChange={e => onUpdateTolerance(r.code, e.target.value)}
                          />
                        </td>
                        {sizes.map(s => (
                          <td key={s}>
                            <input
                              value={r.measurements[s] || ''}
                              style={{ width: '44px', textAlign: 'right' }}
                              onChange={e => onUpdateMeasurement(r.code, s, e.target.value)}
                            />
                          </td>
                        ))}
                        <td>
                          <button className="btn-icon btn-danger" onClick={() => onRemove(r.code)}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
