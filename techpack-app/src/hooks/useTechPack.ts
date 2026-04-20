import { useState, useCallback } from 'react';
import { TechPack, StyleHeader, Colorway, BomRow, PomRow, BomType, BomUnit } from '../types';

const defaultHeader: StyleHeader = {
  label: '', styleNumber: '', season: '', date: new Date().toISOString().split('T')[0],
  description: '', fabrication: '', sizeRange: '', sampleSize: '', designer: '', notes: '',
};

const uid = () => Math.random().toString(36).slice(2, 8);

export function useTechPack() {
  const [header, setHeader] = useState<StyleHeader>(defaultHeader);
  const [colorways, setColorways] = useState<Colorway[]>([
    { id: uid(), name: 'Colorway 1', self: '', combo: '', lining: '', trimA: '', trimB: '', notes: '' }
  ]);
  const [bom, setBom] = useState<BomRow[]>([
    { id: uid(), type: 'SELF', description: '', vendor: '', color: '', content: '', unit: 'yd', qtyPerUnit: '' }
  ]);
  const [pomSizes, setPomSizes] = useState<string[]>(['XS', 'S', 'M', 'L', 'XL']);
  const [pomRows, setPomRows] = useState<PomRow[]>([]);

  const updateHeader = useCallback((field: keyof StyleHeader, value: string) => {
    setHeader(h => ({ ...h, [field]: value }));
  }, []);

  const addColorway = useCallback(() => {
    setColorways(c => [...c, {
      id: uid(), name: `Colorway ${c.length + 1}`,
      self: '', combo: '', lining: '', trimA: '', trimB: '', notes: ''
    }]);
  }, []);

  const updateColorway = useCallback((id: string, field: keyof Colorway, value: string) => {
    setColorways(c => c.map(cw => cw.id === id ? { ...cw, [field]: value } : cw));
  }, []);

  const removeColorway = useCallback((id: string) => {
    setColorways(c => c.filter(cw => cw.id !== id));
  }, []);

  const addBomRow = useCallback(() => {
    setBom(b => [...b, { id: uid(), type: 'TRIM', description: '', vendor: '', color: '', content: '', unit: 'pc', qtyPerUnit: '' }]);
  }, []);

  const updateBomRow = useCallback((id: string, field: keyof BomRow, value: string) => {
    setBom(b => b.map(r => r.id === id ? { ...r, [field]: value } : r));
  }, []);

  const removeBomRow = useCallback((id: string) => {
    setBom(b => b.filter(r => r.id !== id));
  }, []);

  const addPomRow = useCallback((entry: { code: number; name: string; tolerance: number }) => {
    setPomRows(rows => {
      if (rows.find(r => r.code === entry.code)) return rows;
      return [...rows, { code: entry.code, name: entry.name, tolerance: entry.tolerance, measurements: {} }];
    });
  }, []);

  const updatePomMeasurement = useCallback((code: number | string, size: string, value: string) => {
    setPomRows(rows => rows.map(r => r.code === code ? { ...r, measurements: { ...r.measurements, [size]: value } } : r));
  }, []);

  const updatePomTolerance = useCallback((code: number | string, value: string) => {
    setPomRows(rows => rows.map(r => r.code === code ? { ...r, tolerance: value } : r));
  }, []);

  const removePomRow = useCallback((code: number | string) => {
    setPomRows(rows => rows.filter(r => r.code !== code));
  }, []);

  const exportJSON = useCallback(() => {
    const data: TechPack = {
      header, colorways, bom,
      pom: { sizes: pomSizes, rows: pomRows },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techpack_${header.styleNumber || 'draft'}_${header.season || 'v1'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [header, colorways, bom, pomSizes, pomRows]);

  const importJSON = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: TechPack = JSON.parse(e.target?.result as string);
        if (data.header) setHeader(data.header);
        if (data.colorways) setColorways(data.colorways);
        if (data.bom) setBom(data.bom);
        if (data.pom) { setPomSizes(data.pom.sizes); setPomRows(data.pom.rows); }
      } catch { alert('Invalid tech pack JSON file.'); }
    };
    reader.readAsText(file);
  }, []);

  return {
    header, updateHeader,
    colorways, addColorway, updateColorway, removeColorway,
    bom, addBomRow, updateBomRow, removeBomRow,
    pomSizes, setPomSizes, pomRows, addPomRow, updatePomMeasurement, updatePomTolerance, removePomRow,
    exportJSON, importJSON,
  };
}
