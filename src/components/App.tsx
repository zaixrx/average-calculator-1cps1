import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clamp, getInteractionColor } from "@/lib/utils";
import ModuleWrapper from "./Module";
import ArchiveManager from "./ArchiveManager";

export interface Module {
  readonly coeffecient: number;
  gradeTD: number;
  gradeExam: number;
  totalGrade: number;
}

function App() {
  const [result, setAverage] = useState<number>(0);
  const [modules, setModules] = useState<Record<string, Module> | null>();

  useEffect(() => {
    fetch("./data.json")
      .then((resp) => resp.json())
      .then((modulesData) => {
        const modules: Record<string, Module> = {};

        for (const module in modulesData) {
          modules[module] = {
            coeffecient: modulesData[module],
            gradeTD: 0,
            gradeExam: 0,
            totalGrade: 0,
          };
        }

        setModules(modules);
      });
  }, []);

  function handleModuleGradeChange(
    name: string,
    gradeTD: number,
    gradeExam: number
  ): void {
    const _modules = { ...modules };
    const module = _modules[name];
    module.gradeTD = gradeTD;
    module.gradeExam = gradeExam;

    let average = result;
    average -= module.totalGrade * (module.coeffecient / 26);
    module.totalGrade = clamp(gradeExam * (2 / 3) + gradeTD * (1 / 3), 0, 20);
    average += module.totalGrade * (module.coeffecient / 26);

    setAverage(average);
    setModules(_modules);
  }

  function renderModules(): React.ReactNode[] {
    const nodes: React.ReactNode[] = [];

    for (const name in modules) {
      const module = modules[name];
      nodes.push(
        <ModuleWrapper
          key={name}
          name={name}
          module={module}
          onModuleGradeChange={handleModuleGradeChange}
        />
      );
    }

    return nodes;
  }

  return (
    modules && (
      <main className="min-h-screen bg-[#070708] text-white py-10">
        <div className="container mx-auto px-3">
          <h1 className="text-3xl font-bold mb-5">Average Calculator</h1>
          <div className="flex gap-2">
            <ArchiveManager
              setModules={(modules: Record<string, Module>) => {
                let average = 0;

                for (const name in modules) {
                  const module = modules[name];
                  average += module.totalGrade * module.coeffecient;
                }

                average /= 26;

                setAverage(average);
                setModules(modules);
              }}
              modules={modules}
            />
          </div>
          <Table className="mt-2">
            <TableHeader>
              <TableRow className="border-b border-[#2A2A2A] font-bold">
                <TableHead>Module</TableHead>
                <TableHead>Tutorial Grade</TableHead>
                <TableHead>Exam Grade</TableHead>
                <TableHead>Total Grade</TableHead>
                <TableHead>Coefficient</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderModules()}</TableBody>
          </Table>
          <AverageShowcase average={result} />
        </div>
      </main>
    )
  );
}

function AverageShowcase({ average }: { average: number }) {
  return (
    <div className="mt-5 p-5 rounded border border-[#2A2A2A] shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Overall Average</h2>
        <div
          className="text-4xl font-bold"
          style={{ color: average ? getInteractionColor(average) : "white" }}
        >
          {average.toFixed(2)}
        </div>
      </div>
      <div className="mt-4 bg-[#2A2A2A] h-2 rounded-full">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${(average / 20) * 100}%`,
            backgroundColor: getInteractionColor(average),
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;
