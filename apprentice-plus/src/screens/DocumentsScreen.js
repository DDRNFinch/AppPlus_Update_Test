import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useCourseEngine } from "../context/CourseEngineContext";
import { useProgress } from "../context/ProgressContext";
import { shareFile } from "../utils/pdfExport";

export default function DocumentsScreen() {
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
  const documents = [...(progress.documents || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      data={documents}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No documents yet. Export an assignment as a PDF to see it here.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => shareFile(item.uri)}>
          <Text style={styles.icon}>📄</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FA" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  emptyText: { textAlign: "center", color: "#666" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 10 },
  icon: { fontSize: 22, marginRight: 12 },
  cardTitle: { fontWeight: "700", color: "#0F1C2E" },
  cardSub: { color: "#888", fontSize: 12, marginTop: 2 },
});
