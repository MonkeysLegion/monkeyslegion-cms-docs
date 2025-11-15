import { JSX } from "react";

export type Preset = '3d' | '7d' | '1m' | '3m' | '1y';

export interface DateRange {
  start: Date;
  end: Date;
  preset: Preset;
}

export interface StatMeta {
  id: string;
  title: string;
  description?: string;
}

export interface StatProps {
  range: DateRange;
}

export interface StatModule {
  meta: StatMeta;
  default: (props: StatProps) => JSX.Element;
}

export interface StatIndexEntry {
  id: string;
  title: string;
  loader: () => Promise<StatModule>;
}