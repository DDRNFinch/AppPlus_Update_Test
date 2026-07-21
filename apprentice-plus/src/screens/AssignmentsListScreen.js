import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useCourseEngine } from "../context/CourseEngineContext";
import { useProgress } from "../context/ProgressContext";
import KsbChip from "../components/KsbChip";

export default function AssignmentsListScreen({ navigation }) {
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
      data={activeCourse.assignments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const done = progress.assignments?.[item.id]?.completed;
        return (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AssignmentDetail", { assignmentId: item.id })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>
                {item.order}. {item.title}
              </Text>
              <View style={styles.chipRow}>
                {item.ksbs.map((code) => (
                  <KsbChip key={code} code={code} complete={done} />
                ))}
              </View>
            </View>
            <Text style={styles.status}>{done ? "✅" : "○"}</Text>
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
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: { fontWeight: "700", fontSize: 15, marginBottom: 8, color: "#0F1C2E" },
  chipRow: { flexDirection: "row", flexWrap: "wrap" },
  status: { fontSize: 18, marginLeft: 8 },
});
