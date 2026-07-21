export const XP_PER_ASSIGNMENT = 50;
export const XP_PER_QUIZ_PASS = 30;
export const XP_PER_PRACTICAL = 80;

export const ACHIEVEMENTS = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first assignment.",
    check: (p) => Object.values(p.assignments || {}).filter((a) => a.completed).length >= 1,
  },
  {
    id: "quiz-whiz",
    title: "Quiz Whiz",
    description: "Pass 3 Academy quizzes.",
    check: (p) => Object.values(p.modules || {}).filter((m) => m.completed).length >= 3,
  },
  {
    id: "halfway-there",
    title: "Halfway There",
    description: "Reach 50% overall course progress.",
    check: (p, pct) => pct >= 50,
  },
  {
    id: "gateway-ready",
    title: "Gateway Ready",
    description: "Complete every assignment and Academy module for this course.",
    check: (p, pct) => pct >= 100,
  },
  {
    id: "xp-500",
    title: "500 XP Club",
    description: "Earn 500 total XP on this course.",
    check: (p) => (p.xp || 0) >= 500,
  },
];

export function computeAchievements(progress, overallPct) {
  return ACHIEVEMENTS.filter((a) => a.check(progress, overallPct)).map((a) => a.id);
}

export function overallProgressPct(course, progress) {
  const totalItems =
    (course.assignments?.length || 0) +
    (course.academy?.modules?.length || 0) +
    (course.practicalAssessments?.length || 0);
  if (totalItems === 0) return 0;

  const doneAssignments = Object.values(progress.assignments || {}).filter((a) => a.completed).length;
  const doneModules = Object.values(progress.modules || {}).filter((m) => m.completed).length;
  const donePracticals = Object.values(progress.practicals || {}).filter((p) => p.completed).length;

  const done = doneAssignments + doneModules + donePracticals;
  return Math.round((done / totalItems) * 100);
}

export function isGatewayReady(course, progress) {
  const { requiredAssignments = [], requiredAcademyModules = [], requiredPracticalAssessments = [] } =
    course.gatewayReadiness || {};

  const assignmentsDone = requiredAssignments.every((id) => progress.assignments?.[id]?.completed);
  const modulesDone = requiredAcademyModules.every((id) => progress.modules?.[id]?.completed);
  const practicalsDone = requiredPracticalAssessments.every((id) => progress.practicals?.[id]?.completed);

  return assignmentsDone && modulesDone && practicalsDone;
}
