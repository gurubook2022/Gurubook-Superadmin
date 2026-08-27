// License class dependency rules, ported from the Gurubook-User payment
// flow (src/lib/utils.ts) so admin-created students go through the same
// class-selection rules as self-service signups.

// Left side is disabled once the right side classes are selected as exam
// classes (a higher class already covers the lower ones).
const classDependencies: Record<string, string[]> = {
  AM: ["MOFA"],
  A2: ["AM", "A1", "MOFA"],
  A1: ["AM", "MOFA"],
  A: ["A1", "A2", "AM", "MOFA"],
  B: ["AM", "L", "MOFA"],
  CE: ["AM", "C1", "L", "T", "MOFA"],
  C1: ["AM", "L", "MOFA"],
  C: ["AM", "C1", "L", "MOFA"],
  D1: ["AM", "L", "MOFA"],
  D: ["AM", "D1", "L"],
  L: ["MOFA"],
  T: ["AM", "L", "MOFA"],
};

export const getDisabledClasses = (classLabel: string): string[] =>
  classDependencies[classLabel] ?? [];

export const getClassesToRemove = (value: string): string[] =>
  classDependencies[value] ?? [];

// Classes an extension learner no longer needs to take, given one class they
// already hold. Deliberately distinct from classDependencies above: holding
// C or D only rules out the sub-class (C1 / D1), not AM and L.
const acquiredClassDependencies: Record<string, string[]> = {
  A: ["A1", "A2", "AM", "MOFA"],
  A1: ["AM", "MOFA"],
  A2: ["A1", "AM", "MOFA"],
  AM: ["MOFA"],
  B: ["AM", "L", "MOFA"],
  C: ["C1", "MOFA"],
  C1: ["MOFA"],
  CE: ["C1", "T", "AM", "L", "MOFA"],
  D: ["D1", "MOFA"],
  D1: ["MOFA"],
  L: ["MOFA"],
  T: ["AM", "L", "MOFA"],
};

export const getDisabledClassesByAcquired = (acquiredClass: string): string[] =>
  acquiredClassDependencies[acquiredClass] ?? [];

// Exam classes an extension learner should not be offered: the ones they
// already hold, plus everything those imply.
export const getDisabledClassesFromAcquired = (acquired: string[]): string[] => [
  ...(acquired ?? []),
  ...(acquired?.flatMap(getDisabledClassesByAcquired) ?? []),
];
