import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clamp, getInteractionColor } from "@/lib/utils";
import Module from "./Module";
import PresetManager from "./PresetsManager";

export interface T_Module {
  readonly name: string;
  readonly coeffecient: number;
  gradeTD: number;
  gradeExam: number;
  totalGrade: number;
}

function App() {
  const [result, setAverage] = useState<number>(0);
  const [modules, setModules] = useState<T_Module[]>([]);

  useEffect(() => {
    fetch("./data.json")
      .then((resp) => resp.json())
      .then((modulesData) => {
        const _modules = [...modules];

        for (const module in modulesData) {
          _modules.push({
            gradeTD: 0,
            gradeExam: 0,
            totalGrade: 0,
            name: module,
            coeffecient: modulesData[module],
          });
        }

        setModules(_modules);
      });
  }, []);

  function handleModuleGradeChange(
    name: string,
    gradeTD: number,
    gradeExam: number
  ): void {
    const _modules = [...modules];
    const module = _modules.find((m) => m.name === name);
    if (!module) return;

    let _result = result;
    module.gradeTD = gradeTD;
    module.gradeExam = gradeExam;
    _result -= module.totalGrade;
    module.totalGrade = clamp(gradeExam * (2 / 3) + gradeTD * (1 / 3), 0, 20);
    _result += module.totalGrade * (module.coeffecient / 26);

    console.log(module, _modules);

    setAverage(_result);
    setModules(_modules);
  }

  return (
    <main className="min-h-screen bg-[#070708] text-white py-10">
      <div className="container mx-auto px-3">
        <h1 className="text-3xl font-bold mb-5">Average Calculator</h1>
        <div className="flex gap-2">
          <PresetManager
            setModules={(_modules: T_Module[]) => {
              let average = 0;

              _modules.forEach((m) => {
                average += m.totalGrade * m.coeffecient;
              });

              average /= 26;

              setAverage(average);
              setModules(_modules);
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
          <TableBody>
            {modules.map((m) => (
              <Module
                module={m}
                key={m.name}
                onModuleGradeChange={handleModuleGradeChange}
              />
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 rounded-lg p-6 border border-[#2A2A2A] shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Overall Average</h2>
            <div
              className="text-4xl font-bold"
              style={{ color: result ? getInteractionColor(result) : "white" }}
            >
              {result.toFixed(2)}
            </div>
          </div>
          <div className="mt-4 bg-[#2A2A2A] h-2 rounded-full">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(result / 20) * 100}%`,
                backgroundColor: getInteractionColor(result),
              }}
            ></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
