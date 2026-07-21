import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useCourseEngine } from "../context/CourseEngineContext";
import { useProgress } from "../context/ProgressContext";

export default function AcademyListScreen({ navigation }) {
  const { activeCourse } = useCourseEngine();
  const { getProgress } = useProgress();

  if (!activeCourse) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Select a course in Settings first.</Text>
      </View>
    );
  }

  const progress = getProgress(activeCourse.courseId);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      data={activeCourse.academy.modules}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const state = progress.modules?.[item.id];
        return (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AcademyModule", { moduleId: item.id })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.subText}>
                {item.quiz.length} question{item.quiz.length === 1 ? "" : "s"} · {item.resources.length} resource{item.resources.length === 1 ? "" : "s"}
              </Text>
              {state?.completed && <Text style={styles.scoreText}>Score: {state.quizScore} 🎓 Certificate earned</Text>}
            </View>
            <Text style={styles.status}>{state?.completed ? "✅" : "○"}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FA" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyText: { textAlign: "center", color: "#666" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: { fontWeight: "700", fontSize: 15, color: "#0F1C2E", marginBottom: 4 },
  subText: { color: "#888", fontSize: 12 },
  scoreText: { color: "#1F6D3A", fontSize: 12, marginTop: 4, fontWeight: "600" },
  status: { fontSize: 18, marginLeft: 8 },
});
