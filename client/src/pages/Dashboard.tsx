import { usePromajData } from "@/hooks/usePromajData";
import { KPICard } from "@/components/KPICard";
import { SexDistributionChart } from "@/components/SexDistributionChart";
import { AgeDistributionChart } from "@/components/AgeDistributionChart";
import { ScholarshipChart } from "@/components/ScholarshipChart";
import { CRASDistributionChart } from "@/components/CRASDistributionChart";
import { AllocationChart } from "@/components/AllocationChart";
import { SexAllocationChart } from "@/components/SexAllocationChart";
import { Users, Briefcase, TrendingUp, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const { data, loading, error, years, selectedYear, setSelectedYear, selectedMeta } =
    usePromajData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando dados do POT...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive font-semibold">Erro ao carregar dados</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const yearLabel = selectedMeta?.label ?? String(selectedYear ?? "");
  const sourceUrl = selectedMeta?.sourceUrl;
  const total = data.total_participantes || 0;
  const masc = data.distribuicao_sexo?.Masculino ?? 0;
  const fem = data.distribuicao_sexo?.Feminino ?? 0;
  const topEscolaridade = Object.entries(data.distribuicao_escolaridade || {}).sort((a, b) => b[1] - a[1])[0];
  const topCras = Object.entries(data.distribuicao_cras || {}).sort((a, b) => b[1] - a[1])[0];
  const topLotacao = Object.entries(data.distribuicao_lotacao_agrupada || {}).sort((a, b) => b[1] - a[1])[0];
  const pct = (n: number) => (total ? ((n / total) * 100).toFixed(1) : "0.0");

  return (
    <div className="min-h-screen bg-fixed bg-[url(/images/background.png)] bg-cover bg-no-repeat bg-top bg-black">
      <header className="h-full w-full rounded-md bg-emerald-900/45 backdrop-blur-md border border-emerald-400/30 shadow-lg shadow-emerald-950/30">
        <div className="container py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Perfil Beneficiários POT {yearLabel ? `(${yearLabel})` : ""}
              </h1>
              <p className="text-sm text-white/80 mt-1">
                Perfil dos Beneficiários do Programa Operação Trabalho
              </p>
              {sourceUrl && (
                <a
                  className="font-bold text-white underline mt-3 inline-block"
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Dados Abertos Compilados - Clique Aqui
                </a>
              )}
            </div>
            {years.length > 0 && selectedYear != null && (
              <div className="flex items-center gap-3 self-start md:self-center shrink-0 rounded-xl px-3 py-2 bg-emerald-900/55 backdrop-blur-md border border-emerald-400/35 shadow-lg shadow-emerald-950/30">
                <span className="text-sm font-medium text-emerald-50">Ano</span>
                <Select value={String(selectedYear)} onValueChange={v => setSelectedYear(Number(v))}>
                  <SelectTrigger className="w-[130px] bg-emerald-800/50 text-white border-emerald-400/35 backdrop-blur-sm hover:bg-emerald-700/50 focus-visible:ring-emerald-400/40">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(y => (
                      <SelectItem key={y.year} value={String(y.year)}>
                        {y.label ?? y.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Indicadores Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <KPICard title="Total de Beneficiários" value={data.total_participantes} icon={Users} description="Beneficiários selecionados no programa" />
            <KPICard title="Idade Média" value={`${data.idade_media} anos`} icon={TrendingUp} description={`Entre ${data.idade_minima} e ${data.idade_maxima} anos`} />
            <KPICard title="Público Masculino" value={masc} icon={Users} description={`${pct(masc)}% do total`} />
            <KPICard title="Público Feminino" value={fem} icon={Users} description={`${pct(fem)}% do total`} />
            <KPICard title="Áreas de Atuação" value={Object.keys(data.distribuicao_lotacao_agrupada || {}).length} icon={Briefcase} description="Grupos de Estruturas" />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Análise Demográfica</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SexDistributionChart data={data.distribuicao_sexo} />
            <AgeDistributionChart data={data.sexo_por_idade} />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Perfil Educacional</h2>
          <div className="grid grid-cols-1 gap-6">
            <ScholarshipChart data={data.distribuicao_escolaridade} />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Cobertura Territorial</h2>
          <div className="grid grid-cols-1 gap-6">
            <CRASDistributionChart data={data.distribuicao_cras} />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Alocação Profissional</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AllocationChart data={data.distribuicao_lotacao_agrupada} />
            <SexAllocationChart data={data.sexo_por_categoria_lotacao} />
          </div>
        </section>

        <section className="mb-12 p-6 bg-emerald-900/45 backdrop-blur-md border border-emerald-400/30 shadow-lg shadow-emerald-950/30">
          <h2 className="text-xl font-bold mb-4 text-white text-center">Resumo Executivo</h2>
          <div className="grid grid-cols-1 gap-6 text-sm">
            <div>
              <p className="font-semibold mb-2 text-white">Perfil Educacional</p>
              <p className="text-white">
                O perfil educacional dos {total} participantes do Programa Operação Trabalho (POT)
                {topEscolaridade
                  ? ` revela maior concentração em ${topEscolaridade[0]}, com ${pct(topEscolaridade[1])}% do público total (${topEscolaridade[1]} indivíduos).`
                  : " não possui dados de escolaridade disponíveis."}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2 text-white">Distribuição Geográfica</p>
              <p className="text-white">
                O programa atende {Object.keys(data.distribuicao_cras || {}).length} unidades/áreas de CRAS
                {topCras ? `, com maior concentração em ${topCras[0]} (${topCras[1]} beneficiários).` : "."}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2 text-white">Alocação Profissional</p>
              <p className="text-white">
                {topLotacao
                  ? `A maior parte dos beneficiários está alocada em ${topLotacao[0]} (${topLotacao[1]} beneficiários), com distribuição em ${Object.keys(data.distribuicao_lotacao_agrupada || {}).length} áreas de atuação.`
                  : "Não há dados de alocação profissional disponíveis."}
              </p>
            </div>
            <div>
              <p className="font-semibold mb-2 text-white">Equilíbrio de Gênero</p>
              <p className="text-white">
                O programa apresenta {pct(masc)}% de beneficiários masculinos ({masc}) e {pct(fem)}% femininos ({fem}).
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Dashboard POT © {yearLabel || "—"} - Prefeitura Municipal de Teresópolis</p>
          <p className="text-xs mt-2">
            Dados mantidos e atualizados pela Secretaria Municipal de Ciência e Tecnologia - Departamento de Governança de Dados
          </p>
        </div>
      </footer>
    </div>
  );
}
