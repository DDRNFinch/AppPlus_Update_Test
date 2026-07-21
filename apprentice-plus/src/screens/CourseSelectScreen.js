import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useCourseEngine } from "../context/CourseEngineContext";

export default function CourseSelectScreen() {
  const {
    allCourses,
    enrolledCourses,
    activeCourseId,
    setActiveCourse,
    enrollInCourse,
    unenrollFromCourse,
  } = useCourseEngine();

  const enrolledIds = enrolledCourses.map((c) => c.courseId);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      data={allCourses}
      keyExtractor={(item) => item.courseId}
      ListHeaderComponent={<Text style={styles.heading}>All apprenticeship standards</Text>}
      renderItem={({ item }) => {
        const enrolled = enrolledIds.includes(item.courseId);
        const active = activeCourseId === item.courseId;
        return (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.standardCode} · v{item.version} · Level {item.level}</Text>
            </View>
            {enrolled ? (
              <View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                  style={[styles.actionBtn, active && styles.actionBtnActive]}
                  onPress={() => setActiveCourse(item.courseId)}
                >
                  <Text style={[styles.actionBtnText, active && styles.actionBtnTextActive]}>
                    {active ? "Active" : "Set active"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => unenrollFromCourse(item.courseId)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.actionBtn} onPress={() => enrollInCourse(item.courseId)}>
                <Text style={styles.actionBtnText}>Enroll</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FA" },
  heading: { fontWeight: "800", fontSize: 14, color: "#8A93A3", marginBottom: 10, textTransform: "uppercase" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 12 },
  title: { fontWeight: "700", color: "#0F1C2E", marginBottom: 4 },
  subtitle: { color: "#888", fontSize: 12 },
  actionBtn: { borderWidth: 1, borderColor: "#0F1C2E", borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginBottom: 6 },
  actionBtnActive: { backgroundColor: "#0F1C2E" },
  actionBtnText: { color: "#0F1C2E", fontWeight: "700", fontSize: 12 },
  actionBtnTextActive: { color: "#fff" },
  removeText: { color: "#C0392B", fontSize: 12 },
});
