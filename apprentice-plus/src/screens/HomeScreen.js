import React, { useEffect, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useCourseEngine } from "../context/CourseEngineContext";
import { useProgress } from "../context/ProgressContext";
import ProgressBar from "../components/ProgressBar";
import XPBadge from "../components/XPBadge";
import { overallProgressPct, isGatewayReady, ACHIEVEMENTS } from "../utils/xp";

export default function HomeScreen({ navigation }) {
  const { activeCourse } = useCourseEngine();
  const { getProgress, refreshAchievements } = useProgress();

  if (!activeCourse) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No active course selected. Head to Settings to pick one.</Text>
      </View>
    );
  }

  const progress = getProgress(activeCourse.courseId);
  const pct = useMemo(() => overallProgressPct(activeCourse, progress), [activeCourse, progress]);
  const gatewayReady = useMemo(() => isGatewayReady(activeCourse, progress), [activeCourse, progress]);

  useEffect(() => {
    refreshAchievements(activeCourse.courseId, activeCourse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct]);

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => progress.achievements?.includes(a.id));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.eyebrow}>{activeCourse.standardCode} · v{activeCourse.version}{activeCourse.pathway ? ` · ${activeCourse.pathway}` : ""}</Text>
      <Text style={styles.title}>{activeCourse.title}</Text>

      <View style={styles.row}>
        <XPBadge xp={progress.xp} />
        <View
          style={[
            styles.gatewayPill,
            { backgroundColor: gatewayReady ? "#E6F5EA" : "#FBEAEA" },
          ]}
        >
          <Text style={{ color: gatewayReady ? "#1F6D3A" : "#C0392B", fontWeight: "700" }}>
            {gatewayReady ? "EPA Gateway Ready" : "Not Gateway Ready Yet"}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overall Progress</Text>
        <ProgressBar pct={pct} />
        <Text style={styles.pctText}>{pct}% complete</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Goal</Text>
        <Text style={styles.bodyText}>
          Complete one assignment activity or Academy quiz to keep your streak going.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})</Text>
        {ACHIEVEMENTS.map((a) => {
          const unlocked = progress.achievements?.includes(a.id);
          return (
            <View key={a.id} style={styles.achievementRow}>
              <Text style={{ fontSize: 18, marginRight: 10 }}>{unlocked ? "🏆" : "🔒"}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.achTitle, unlocked && { color: "#1F6D3A" }]}>{a.title}</Text>
                <Text style={styles.achDesc}>{a.description}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FA" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyText: { textAlign: "center", color: "#666" },
  eyebrow: { color: "#8A93A3", fontWeight: "600", marginBottom: 4 },
  title: { fontSize: 24, fontWeight: "800", color: "#0F1C2E", marginBottom: 14 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 10 },
  gatewayPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginLeft: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardTitle: { fontWeight: "700", fontSize: 15, marginBottom: 10, color: "#0F1C2E" },
  pctText: { marginTop: 8, color: "#666", fontSize: 13 },
  bodyText: { color: "#444", lineHeight: 20 },
  achievementRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  achTitle: { fontWeight: "700", color: "#333" },
  achDesc: { color: "#777", fontSize: 12 },
});
