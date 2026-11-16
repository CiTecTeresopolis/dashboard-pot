import { useEffect, useMemo, useState } from "react";

export interface PromajData {
  total_participantes: number;
  distribuicao_sexo: Record<string, number>;
  idade_media: number;
  idade_minima: number;
  idade_maxima: number;
  faixa_etaria?: { minima: number; maxima: number };
  distribuicao_idade: Record<string, number>;
  distribuicao_escolaridade: Record<string, number>;
  distribuicao_cras: Record<string, number>;
  top_5_bairros: Record<string, number>;
  distribuicao_lotacao_agrupada: Record<string, number>;
  sexo_por_categoria_lotacao: Record<string, Record<string, number>>;
  sexo_por_idade: Record<string, Record<string, number>>;
}

export interface YearMeta {
  year: number;
  label?: string;
  file?: string;
  sourceUrl?: string;
}

interface YearsManifest {
  defaultYear?: number;
  years: YearMeta[];
}

function getYearFromUrl(): number | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  const raw = p.get("ano") ?? p.get("year");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function usePromajData() {
  const [years, setYears] = useState<YearMeta[]>([]);
  const [selectedYear, setSelectedYearState] = useState<number | null>(
    getYearFromUrl()
  );
  const [data, setData] = useState<PromajData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let manifest: YearsManifest | null = null;
        try {
          const mRes = await fetch("/data/pot/years.json");
          if (mRes.ok) manifest = (await mRes.json()) as YearsManifest;
        } catch {
          manifest = null;
        }

        if (manifest?.years?.length) {
          const sorted = [...manifest.years].sort((a, b) => b.year - a.year);
          setYears(sorted);
          const urlYear = getYearFromUrl();
          const available = new Set(sorted.map(y => y.year));
          const chosen =
            (urlYear && available.has(urlYear) && urlYear) ||
            (selectedYear && available.has(selectedYear) && selectedYear) ||
            (manifest.defaultYear && available.has(manifest.defaultYear)
              ? manifest.defaultYear
              : sorted[0].year);
          setSelectedYearState(chosen);
          const meta = sorted.find(y => y.year === chosen) ?? sorted[0];
          const dRes = await fetch(meta.file || `/data/pot/${chosen}.json`);
          if (!dRes.ok) throw new Error("Erro ao carregar dados do POT");
          setData((await dRes.json()) as PromajData);
        } else {
          const dRes = await fetch("/pot_dashboard_data.json");
          if (!dRes.ok) throw new Error("Erro ao carregar dados do POT");
          const jsonData = (await dRes.json()) as PromajData;
          setData(jsonData);
          setYears([{ year: 2025, label: "2025", file: "/pot_dashboard_data.json" }]);
          setSelectedYearState(2025);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  useEffect(() => {
    const onPop = () => {
      const y = getYearFromUrl();
      if (y) setSelectedYearState(y);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const setSelectedYear = (year: number) => {
    setSelectedYearState(year);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("ano", String(year));
      window.history.pushState({}, "", url.toString());
    }
  };

  const selectedMeta = useMemo(
    () => years.find(y => y.year === selectedYear) ?? null,
    [years, selectedYear]
  );

  return { data, loading, error, years, selectedYear, setSelectedYear, selectedMeta };
}
