"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Title } from "@/components/ui/text";
import { cn, toFixed } from "@/lib/utils";
import { InvoiceStudentT } from "../types";

const VISIBLE_ROWS = 6;

interface StudentsTableProps {
  title: string;
  students: InvoiceStudentT[];
  bordered?: boolean;
}

const StudentsTable = ({
  title,
  students,
  bordered = true,
}: StudentsTableProps) => {
  const [showAll, setShowAll] = useState(false);
  const rows = showAll ? students : students.slice(0, VISIBLE_ROWS);

  return (
    <div
      className={cn(
        "space-y-4",
        bordered && "rounded-2xl border border-gray-200 shadow-sm p-6"
      )}
    >
      <div className="flex items-center gap-2">
        <Title className="text-base">{title}</Title>
        <Badge variant="flat" color="primary">
          {students.length} Students
        </Badge>
      </div>

      {students.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-10 text-center">
          <span className="text-gray-500">No students registered yet.</span>
        </div>
      ) : (
        <>
          <div className="rounded-t-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">#</TableHead>
                  <TableHead className="text-white">
                    Student Account ID
                  </TableHead>
                  <TableHead className="text-white">Student Name</TableHead>
                  <TableHead className="text-white">Licence Type</TableHead>
                  <TableHead className="text-white">Existing Class</TableHead>
                  <TableHead className="text-white">
                    Learning For Class(es)
                  </TableHead>
                  <TableHead className="text-white">Exam Lang.</TableHead>
                  <TableHead className="text-white">Learning Lang.</TableHead>
                  <TableHead className="text-white">Created On</TableHead>
                  <TableHead className="text-white">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((student, index) => (
                  <TableRow key={student.accountId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {student.accountId}
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      {student.licenceType === "EXTENSION"
                        ? "Extension"
                        : "New"}
                    </TableCell>
                    <TableCell>
                      {student.licenceType === "EXTENSION" &&
                      student.existingClasses?.length
                        ? student.existingClasses.join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {student.learningForClasses?.length
                        ? student.learningForClasses.join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell>{student.examLanguage || "-"}</TableCell>
                    <TableCell>{student.learningLanguage || "-"}</TableCell>
                    <TableCell>
                      {new Date(student.createdOn).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )}
                    </TableCell>
                    <TableCell>€ {toFixed(student.price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {students.length > VISIBLE_ROWS && !showAll && (
            <button
              type="button"
              className="text-primary text-sm font-medium hover:underline"
              onClick={() => setShowAll(true)}
            >
              View all {students.length} students
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default StudentsTable;
