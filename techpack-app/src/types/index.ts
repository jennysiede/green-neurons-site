export interface StyleHeader {
  label: string;
  styleNumber: string;
  season: string;
  date: string;
  description: string;
  fabrication: string;
  sizeRange: string;
  sampleSize: string;
  designer: string;
  notes: string;
}

export interface Colorway {
  id: string;
  name: string;
  self: string;
  combo: string;
  lining: string;
  trimA: string;
  trimB: string;
  notes: string;
}

export type BomType = 'SELF' | 'COMBO' | 'LINING' | 'FUSING' | 'TRIM' | 'LABEL' | 'THREAD' | 'HW' | 'OTHER';
export type BomUnit = 'yd' | 'm' | 'pc' | 'pr' | 'set' | 'spool' | 'roll';

export interface BomRow {
  id: string;
  type: BomType;
  description: string;
  vendor: string;
  color: string;
  content: string;
  unit: BomUnit;
  qtyPerUnit: string;
}

export interface PomRow {
  code: number | string;
  name: string;
  tolerance: number | string;
  measurements: Record<string, string>;
}

export interface TechPack {
  header: StyleHeader;
  colorways: Colorway[];
  bom: BomRow[];
  pom: {
    sizes: string[];
    rows: PomRow[];
  };
  exportedAt?: string;
}
