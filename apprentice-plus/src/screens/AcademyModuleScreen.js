import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useCourseEngine } from "../context/CourseEngineContext";
import { useProgress } from "../context/ProgressContext";
import QuizCard from "../components/QuizCard";

export default function AcademyModuleScreen({ route }) {
  const { moduleId } = route.params;
  const { activeCourse } = useCourseEngine();
  const { getProgress, completeModuleQuiz } = useProgress();

  const courseModule = activeCourse.academy.modules.find((m) => m.id === moduleId);
  const progress = getProgress(activeCourse.courseId);
  const state = progress.modules?.[moduleId];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = Object.keys(answers).length === courseModule.quiz.length;
  const score = Object.values(answers).filter(Boolean).length;

  const handleSubmit = async () => {
    await completeModuleQuiz(activeCourse.courseId, moduleId, score, courseModule.quiz.length);
    setSubmitted(true);
    const passed = courseModule.quiz.length === 0 || score / courseModule.quiz.length >= 0.7;
    Alert.alert(
      passed ? "Module complete 🎉" : "Not quite there",
      passed
        ? `You scored ${score}/${courseModule.quiz.length}. A certificate has been added to Documents.`
        : `You scored ${score}/${courseModule.quiz.length}. You need 70% to pass — feel free to retry.`
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{courseModule.title}</Text>
      {state?.completed && <Text style={styles.badge}>🎓 Certificate earned — Score {state.quizScore}</Text>}

      <Text style={styles.sectionHeading}>Resources</Text>
      {courseModule.resources.map((r) => (
        <View key={r.id} style={styles.resourceRow}>
          <Text style={styles.resourceIcon}>{r.type === "video" ? "▶️" : "📄"}</Text>
          <Text style={styles.resourceTitle}>{r.title}</Text>
        </View>
      ))}

      <Text style={styles.sectionHeading}>Quiz</Text>
      {courseModule.quiz.map((q, idx) => (
        <QuizCard
          key={q.id}
          question={q}
          onAnswered={(correct) => setAnswers((prev) => ({ ...prev, [q.id]: correct }))}
        />
      ))}

      {courseModule.quiz.length > 0 && (
        <TouchableOpacity
          style={[styles.submitBtn, !allAnswered && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!allAnswered}
        >
          <Text style={styles.submitBtnText}>
            {allAnswered ? `Submit (${score}/${courseModule.quiz.length})` : "Answer all questions to submit"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FA" },
  title: { fontSize: 20, fontWeight: "800", color: "#0F1C2E", marginBottom: 8 },
  badge: { color: "#1F6D3A", fontWeight: "700", marginBottom: 16 },
  sectionHeading: { fontWeight: "700", fontSize: 15, marginTop: 8, marginBottom: 10, color: "#0F1C2E" },
  resourceRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 8 },
  resourceIcon: { marginRight: 10, fontSize: 16 },
  resourceTitle: { flex: 1, color: "#333" },
  submitBtn: { backgroundColor: "#0F1C2E", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 8, marginBottom: 30 },
  submitBtnDisabled: { backgroundColor: "#A9B3C1" },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
