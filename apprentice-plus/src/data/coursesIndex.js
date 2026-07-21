// Dynamic course engine entry point.
// Each course is a self-contained JSON file following the shared course schema
// (see README.md -> "Course JSON schema"). Adding a new apprenticeship standard
// means dropping a new JSON file in ./courses and adding one line below —
// no other app code needs to change.

import bricklayer from "./courses/bricklayer-st0095-v1-2.json";
import carpentrySiteCarpenter from "./courses/carpentry-joinery-site-carpenter-st0264-v1-4.json";
import carpentryArchitecturalJoiner from "./courses/carpentry-joinery-architectural-joiner-st0264-v1-4.json";

export const ALL_COURSES = [
  bricklayer,
  carpentrySiteCarpenter,
  carpentryArchitecturalJoiner,
];

export function getCourseById(courseId) {
  return ALL_COURSES.find((c) => c.courseId === courseId) || null;
}
