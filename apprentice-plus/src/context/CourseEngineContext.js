import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ALL_COURSES, getCourseById } from "../data/coursesIndex";
import { loadJSON, saveJSON } from "../utils/storage";

const CourseEngineContext = createContext(null);

export function CourseEngineProvider({ children }) {
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const enrolled = await loadJSON("enrolledCourseIds", [ALL_COURSES[0].courseId]);
      const active = await loadJSON("activeCourseId", enrolled[0]);
      setEnrolledCourseIds(enrolled);
      setActiveCourseId(active);
      setLoaded(true);
    })();
  }, []);

  const enrollInCourse = useCallback(async (courseId) => {
    setEnrolledCourseIds((prev) => {
      const next = prev.includes(courseId) ? prev : [...prev, courseId];
      saveJSON("enrolledCourseIds", next);
      return next;
    });
  }, []);

  const unenrollFromCourse = useCallback(async (courseId) => {
    setEnrolledCourseIds((prev) => {
      const next = prev.filter((id) => id !== courseId);
      saveJSON("enrolledCourseIds", next);
      return next;
    });
  }, []);

  const setActiveCourse = useCallback(async (courseId) => {
    setActiveCourseId(courseId);
    await saveJSON("activeCourseId", courseId);
  }, []);

  const activeCourse = activeCourseId ? getCourseById(activeCourseId) : null;
  const enrolledCourses = enrolledCourseIds.map(getCourseById).filter(Boolean);
  const availableCourses = ALL_COURSES.filter((c) => !enrolledCourseIds.includes(c.courseId));

  return (
    <CourseEngineContext.Provider
      value={{
        loaded,
        allCourses: ALL_COURSES,
        enrolledCourses,
        availableCourses,
        activeCourse,
        activeCourseId,
        setActiveCourse,
        enrollInCourse,
        unenrollFromCourse,
      }}
    >
      {children}
    </CourseEngineContext.Provider>
  );
}

export function useCourseEngine() {
  const ctx = useContext(CourseEngineContext);
  if (!ctx) throw new Error("useCourseEngine must be used within CourseEngineProvider");
  return ctx;
}
