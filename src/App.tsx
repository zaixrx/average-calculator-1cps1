import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface T_Module {
  readonly name: string;
  readonly coeffecient: number;
  gradeTD: number;
  gradeExam: number;
  totalGrade: number;
}

function getInteractionColor(grade: number, active = true): string {
  if (!active) return "transparent";

  if (grade <= 5) return "rgb(239, 68, 68)";
  if (grade <= 10) return "rgb(234, 179, 8)";
  if (grade <= 15) return "rgb(34, 197, 94)";
  return "rgb(59, 130, 246)";
}

function clamp(value: number, min: number, max: number): number {
  if (max < value) return max;
  if (min > value) return min;
  return value;
}

function App() {
  const [modules, setModules] = useState<T_Module[]>([]);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    fetch("./data.json")
      .then((resp) => resp.json())
      .then((modulesData) => {
        const modules: T_Module[] = [];

        for (const module in modulesData) {
          modules.push({
            gradeTD: 0,
            gradeExam: 0,
            totalGrade: 0,
            name: module,
            coeffecient: modulesData[module],
          });
        }

        setModules(modules);
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

    let _result = result - module.totalGrade / modules.length;

    module.gradeTD = gradeTD;
    module.gradeExam = gradeExam;
    module.totalGrade = clamp((2 * gradeExam) / 3 + gradeTD / 3, 0, 20);

    _result += module.totalGrade / modules.length;

    setResult(_result);
    setModules(_modules);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white py-10">
      <div className="container mx-auto px-3">
        <h1 className="text-3xl font-bold mb-10">Average Calculator</h1>
        <Table>
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

type ModuleProps = {
  module: T_Module;
  onModuleGradeChange: (
    name: string,
    gradeTD: number,
    gradeExam: number
  ) => void;
};

function Module({ module, onModuleGradeChange }: ModuleProps) {
  const [tdActive, setTDActive] = useState<boolean>(false);
  const [examActive, setExamActive] = useState<boolean>(false);

  return (
    <TableRow className="border-b border-[#2A2A2A] hover:bg-[#1e1e1e]">
      <TableCell>{module.name}</TableCell>
      <TableCell>
        <Input
          type="number"
          value={module.gradeTD || ""}
          placeholder="Tuto"
          className="w-20 bg-[#2A2A2A] text-white focus:ring-2"
          style={{
            appearance: "textfield",
            borderColor: getInteractionColor(module.gradeTD, tdActive),
          }}
          onFocus={() => {
            if (!tdActive) setTDActive(true);
          }}
          onChange={({ target }) => {
            onModuleGradeChange(
              module.name,
              Number(target.value),
              module.gradeExam
            );
          }}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={module.gradeExam || ""}
          placeholder="Exam"
          className="w-20 bg-[#2A2A2A] text-white focus:ring-2"
          style={{
            appearance: "textfield",
            borderColor: getInteractionColor(module.gradeExam, examActive),
          }}
          onFocus={() => {
            if (!examActive) setExamActive(true);
          }}
          onChange={({ target }) => {
            onModuleGradeChange(
              module.name,
              module.gradeTD,
              Number(target.value)
            );
          }}
        />
      </TableCell>
      <TableCell>{module.totalGrade.toFixed(2)}</TableCell>
      <TableCell>{module.coeffecient}</TableCell>
    </TableRow>
  );
}

export default App;
