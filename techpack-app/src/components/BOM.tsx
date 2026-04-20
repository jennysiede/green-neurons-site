import React from 'react';
import { BomRow, BomType, BomUnit } from '../types';

interface Props {
  rows: BomRow[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof BomRow, value: string) => void;
  onRemove: (id: string) => void;
}

const BOM_TYPES: BomType[] = ['SELF', 'COMBO', 'LINING', 'FUSING', 'TRIM', 'LABEL', 'THREAD', 'HW', 'OTHER'];
const BOM_UNITS: BomUnit[] = ['yd', 'm', 'pc', 'pr', 'set', 'spool', 'roll'];

export const BOM: React.FC<Props> = ({ rows, onAdd, onUpdate, onRemove }) => (
  <section>
    <div className="card">
      <div className="card-header">
        <span className="card-title">Bill of materials</span>
        <button className="btn btn-sm" onClick={onAdd}>+ Add row</button>
      </div>
      <div className="table-scroll">
        <table className="tbl bom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Description</th>
              <th>Vendor</th>
              <th>Color / ref</th>
              <th>Content</th>
              <th>Unit</th>
              <th>Qty / unit</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id}>
                <td className="row-num">{idx + 1}</td>
                <td>
                  <select value={r.type} onChange={e => onUpdate(r.id, 'type', e.target.value)}>
                    {BOM_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </td>
                <td><input value={r.description} placeholder="Description" onChange={e => onUpdate(r.id, 'description', e.target.value)} /></td>
                <td><input value={r.vendor} placeholder="Vendor name" onChange={e => onUpdate(r.id, 'vendor', e.target.value)} /></td>
                <td><input value={r.color} placeholder="Color / ref" onChange={e => onUpdate(r.id, 'color', e.target.value)} /></td>
                <td><input value={r.content} placeholder="e.g. 100% PES" onChange={e => onUpdate(r.id, 'content', e.target.value)} /></td>
                <td>
                  <select value={r.unit} onChange={e => onUpdate(r.id, 'unit', e.target.value)}>
                    {BOM_UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </td>
                <td><input value={r.qtyPerUnit} placeholder="1.25" style={{ textAlign: 'right' }} onChange={e => onUpdate(r.id, 'qtyPerUnit', e.target.value)} /></td>
                <td>
                  <button className="btn-icon btn-danger" onClick={() => onRemove(r.id)}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);
