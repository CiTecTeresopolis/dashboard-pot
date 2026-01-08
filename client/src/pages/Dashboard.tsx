import { usePromajData } from "@/hooks/usePromajData";
import { KPICard } from "@/components/KPICard";
import { SexDistributionChart } from "@/components/SexDistributionChart";
import { AgeDistributionChart } from "@/components/AgeDistributionChart";
import { ScholarshipChart } from "@/components/ScholarshipChart";
import { CRASDistributionChart } from "@/components/CRASDistributionChart";
import { AllocationChart } from "@/components/AllocationChart";
import { SexAllocationChart } from "@/components/SexAllocationChart";
import { Users, Briefcase, BookOpen, MapPin, TrendingUp } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data, loading, error } = usePromajData();

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
          <p className="text-destructive font-semibold">
            Erro ao carregar dados
          </p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fixed bg-[url(/images/background.png)] bg-cover bg-no-repeat **bg-top** bg-black">
      {/* <div className="fixed bg-black opacity-10"></div> */}
      {/* Header */}
      <header className="h-full w-full rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-100 border border-gray-100 shadow-xl">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground text-white">
              Perfil Beneficiários POT (2025)
            </h1>
          </div>
          <p className="text-muted-foreground text-sm text-white">
            Perfil dos Beneficiários do Programa Operação Trabalho
          </p>
          <br />
          <a
            className="font-bold text-foreground mb-4 text-white"
            href="https://dados.teresopolis.rj.gov.br/dataset/beneficios-programa-operacao-trabalho/resource/ca191569-d7eb-4bf1-8d6c-5bc5ca499ec9"
          >
            Dados Abertos Compilados - Clique Aqui 🗎
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* KPI Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-white text-center">
            Indicadores Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <KPICard
              title="Total de Beneficiários"
              value={data.total_participantes}
              icon={Users}
              description="Bneneficiários selecionados no programa"
            />
            <KPICard
              title="Idade Média"
              value={`${data.idade_media} anos`}
              icon={TrendingUp}
              description={`Entre ${data.idade_minima} e ${data.idade_maxima} anos`}
            />
            <KPICard
              title="Público Masculino"
              value={data.distribuicao_sexo.Masculino}
              icon={Users}
              description={`${((data.distribuicao_sexo.Masculino / data.total_participantes) * 100).toFixed(1)}% do total`}
            />
            <KPICard
              title="Público Feminino"
              value={data.distribuicao_sexo.Feminino}
              icon={Users}
              description={`${((data.distribuicao_sexo.Feminino / data.total_participantes) * 100).toFixed(1)}% do total`}
            />
            <KPICard
              title="Áreas de Atuação"
              value={Object.keys(data.distribuicao_lotacao_agrupada).length}
              icon={Briefcase}
              description="Grupos de Estruturas"
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-white text-center">
            Análise Demográfica
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SexDistributionChart data={data.distribuicao_sexo} />
            <AgeDistributionChart data={data.sexo_por_idade} />
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-white text-center">
            Perfil Educacional
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <ScholarshipChart data={data.distribuicao_escolaridade} />
          </div>
        </section>

        {/* Geographic Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-white text-center">
            Cobertura Territorial
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <CRASDistributionChart data={data.distribuicao_cras} />
          </div>
        </section>

        {/* Allocation Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-white text-center">
            Alocação Profissional
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AllocationChart data={data.distribuicao_lotacao_agrupada} />
            <SexAllocationChart data={data.sexo_por_categoria_lotacao} />
          </div>
        </section>

        {/* Summary Section */}
        <section className="mb-12 p-6 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-100 border border-gray-100">
          <h2 className="text-xl font-bold text-foreground mb-4 text-white text-center">
            Resumo Executivo
          </h2>
          <div className="grid grid-cols-1  gap-6 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-2 text-white">
                Perfil Educacional
              </p>
              <p className="text-white">
                O perfil educacional dos {data.total_participantes}{" "}
                participantes do Programa Operação Trabalho (POT) revela uma
                forte concentração no Ensino Médio Completo, que abrange{" "}
                {(
                  (data.distribuicao_escolaridade["Médio Completo"] /
                    data.total_participantes) *
                  100
                ).toFixed(1)}
                % do público total (
                {data.distribuicao_escolaridade["Médio Completo"]} indivíduos).
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2 text-white">
                Distribuição Geográfica
              </p>
              <p className="text-white">
                O programa atende {Object.keys(data.distribuicao_cras).length}{" "}
                CRAS diferentes, com maior concentração em CRAS ALTO (
                {data.distribuicao_cras["CRAS ALTO"]} beneficiários), seguido
                por CRAS SÃO PEDRO ({data.distribuicao_cras["CRAS SÃO PEDRO"]}{" "}
                beneficiários).
              </p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-2 text-white">
                Alocação Profissional
              </p>
              <p className="text-white">
                A maioria dos beneficiários estão alocados em Escolas e Centros
                Educacionais (
                {
                  data.distribuicao_lotacao_agrupada[
                    "Escolas e Centros Educacionais"
                  ]
                }{" "}
                beneficiários), com distribuição complementar em{" "}
                {Object.keys(data.distribuicao_lotacao_agrupada).length - 1}{" "}
                outras áreas da administração pública.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2 text-white">
                Equilíbrio de Gênero
              </p>
              <p className="text-white">
                O programa mantém uma distribuição de{" "}
                {(
                  (data.distribuicao_sexo.Masculino /
                    data.total_participantes) *
                  100
                ).toFixed(1)}
                % de beneficiários masculinos e{" "}
                {(
                  (data.distribuicao_sexo.Feminino / data.total_participantes) *
                  100
                ).toFixed(1)}
                % femininos.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Dashboard POT © 2025 - Prefeitura Municipal de Teresópolis</p>
          <p className="text-xs mt-2">
            Dados mantidos e atualizados pela Secretaria Municipal de Ciência e
            Tecnologia - Departamento de Governança de Dados
          </p>
        </div>
      </footer>
    </div>
  );
}
