import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Module } from "./App";
import { useState } from "react";
import { getInteractionColor } from "@/lib/utils";

interface ModuleProps {
  name: string;
  module: Module;
  onModuleGradeChange: (
    name: string,
    gradeTD: number,
    gradeExam: number
  ) => void;
}

function ModuleWrapper({ name, module, onModuleGradeChange }: ModuleProps) {
  const [tdActive, setTDActive] = useState<boolean>(false);
  const [examActive, setExamActive] = useState<boolean>(false);

  return (
    <TableRow className="border-b border-[#2A2A2A] hover:bg-[#1e1e1e]">
      <TableCell>{name}</TableCell>
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
            onModuleGradeChange(name, Number(target.value), module.gradeExam);
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
            onModuleGradeChange(name, module.gradeTD, Number(target.value));
          }}
        />
      </TableCell>
      <TableCell>{module.totalGrade.toFixed(2)}</TableCell>
      <TableCell>{module.coeffecient}</TableCell>
    </TableRow>
  );
}

export default ModuleWrapper;
