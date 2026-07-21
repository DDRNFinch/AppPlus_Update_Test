import React, { useMemo, useState } from "react";
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from "react-native";
import { useCourseEngine } from "../context/CourseEngineContext";
import { useProgress } from "../context/ProgressContext";
import KsbChip from "../components/KsbChip";

const FILTERS = ["All", "Gaps only"];

export default function KsbMatrixScreen({ navigation }) {
  const { activeCourse } = useCourseEngine();
  const { getProgress } = useProgress();
  const [filter, setFilter] = useState("All");

  if (!activeCourse) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Select a course in Settings first.</Text>
      </View>
    );
  }

  const progress = getProgress(activeCourse.courseId);

  const rows = useMemo(() => {
    const allKsbs = [
      ...activeCourse.ksbs.knowledge,
      ...activeCourse.ksbs.skills,
      ...activeCourse.ksbs.behaviours,
    ];
    return allKsbs.map((k) => {
      const matrix = activeCourse.ksbMatrix[k.code] || { assignments: [], academyModules: [] };
      const assignmentsComplete = matrix.assignments.every((id) => progress.assignments?.[id]?.completed);
      const modulesComplete = matrix.academyModules.every((id) => progress.modules?.[id]?.completed);
      const evidenced = matrix.assignments.length + matrix.academyModules.length > 0 && assignmentsComplete && modulesComplete;
      return { ...k, matrix, evidenced };
    });
  }, [activeCourse, progress]);

  const filtered = filter === "Gaps only" ? rows.filter((r) => !r.evidenced) : rows;

  const sections = [
    { title: "Knowledge", data: filtered.filter((r) => r.code.startsWith("K")) },
    { title: "Skills", data: filtered.filter((r) => r.code.startsWith("S")) },
    { title: "Behaviours", data: filtered.filter((r) => r.code.startsWith("B")) },
  ].filter((s) => s.data.length > 0);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <SectionList
        contentContainerStyle={{ padding: 16 }}
        sections={sections}
        keyExtractor={(item) => item.code}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <KsbChip code={item.code} complete={item.evidenced} />
            <Text style={styles.rowText} numberOfLines={2}>{item.text}</Text>
            <Text style={styles.rowStatus}>{item.evidenced ? "✅" : "○"}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No gaps — nice work!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FA" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyText: { textAlign: "center", color: "#666", padding: 20 },
  filterRow: { flexDirection: "row", padding: 16, paddingBottom: 0, gap: 8 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#E9ECF1", marginRight: 8 },
  filterBtnActive: { backgroundColor: "#0F1C2E" },
  filterText: { color: "#444", fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  sectionHeader: { fontWeight: "800", fontSize: 14, color: "#8A93A3", marginTop: 16, marginBottom: 8, textTransform: "uppercase" },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 8 },
  rowText: { flex: 1, color: "#333", fontSize: 13, marginLeft: 6 },
  rowStatus: { marginLeft: 6, fontSize: 16 },
});
