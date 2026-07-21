import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loadJSON, saveJSON } from "../utils/storage";
import { XP_PER_ASSIGNMENT, XP_PER_QUIZ_PASS, XP_PER_PRACTICAL, computeAchievements, overallProgressPct } from "../utils/xp";

const ProgressContext = createContext(null);

const emptyCourseProgress = () => ({
  assignments: {}, // { [assignmentId]: { completed, answers, completedAt } }
  modules: {}, // { [moduleId]: { completed, quizScore, completedAt } }
  practicals: {}, // { [practicalId]: { completed, completedAt } }
  documents: [], // { id, title, type, createdAt, uri }
  xp: 0,
  achievements: [],
});

export function ProgressProvider({ children }) {
  const [progressByCourse, setProgressByCourse] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await loadJSON("progressByCourse", {});
      setProgressByCourse(stored);
      setLoaded(true);
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setProgressByCourse(next);
    await saveJSON("progressByCourse", next);
  }, []);

  const getProgress = useCallback(
    (courseId) => progressByCourse[courseId] || emptyCourseProgress(),
    [progressByCourse]
  );

  const updateCourseProgress = useCallback(
    async (courseId, updaterFn) => {
      const current = progressByCourse[courseId] || emptyCourseProgress();
      const updated = updaterFn({ ...current });
      const next = { ...progressByCourse, [courseId]: updated };
      await persist(next);
      return updated;
    },
    [progressByCourse, persist]
  );

  const completeAssignment = useCallback(
    (courseId, assignmentId, answers) =>
      updateCourseProgress(courseId, (p) => {
        const alreadyDone = p.assignments[assignmentId]?.completed;
        return {
          ...p,
          assignments: {
            ...p.assignments,
            [assignmentId]: { completed: true, answers, completedAt: new Date().toISOString() },
          },
          xp: p.xp + (alreadyDone ? 0 : XP_PER_ASSIGNMENT),
        };
      }),
    [updateCourseProgress]
  );

  const completeModuleQuiz = useCallback(
    (courseId, moduleId, score, total) =>
      updateCourseProgress(courseId, (p) => {
        const passed = total === 0 || score / total >= 0.7;
        const alreadyDone = p.modules[moduleId]?.completed;
        return {
          ...p,
          modules: {
            ...p.modules,
            [moduleId]: {
              completed: passed,
              quizScore: `${score}/${total}`,
              completedAt: new Date().toISOString(),
            },
          },
          xp: p.xp + (passed && !alreadyDone ? XP_PER_QUIZ_PASS : 0),
        };
      }),
    [updateCourseProgress]
  );

  const completePractical = useCallback(
    (courseId, practicalId) =>
      updateCourseProgress(courseId, (p) => {
        const alreadyDone = p.practicals[practicalId]?.completed;
        return {
          ...p,
          practicals: {
            ...p.practicals,
            [practicalId]: { completed: true, completedAt: new Date().toISOString() },
          },
          xp: p.xp + (alreadyDone ? 0 : XP_PER_PRACTICAL),
        };
      }),
    [updateCourseProgress]
  );

  const addDocument = useCallback(
    (courseId, doc) =>
      updateCourseProgress(courseId, (p) => ({
        ...p,
        documents: [...p.documents, doc],
      })),
    [updateCourseProgress]
  );

  const refreshAchievements = useCallback(
    (courseId, course) =>
      updateCourseProgress(courseId, (p) => {
        const pct = overallProgressPct(course, p);
        return { ...p, achievements: computeAchievements(p, pct) };
      }),
    [updateCourseProgress]
  );

  return (
    <ProgressContext.Provider
      value={{
        loaded,
        getProgress,
        completeAssignment,
        completeModuleQuiz,
        completePractical,
        addDocument,
        refreshAchievements,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
