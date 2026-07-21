import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useCourseEngine } from "../context/CourseEngineContext";
import { useProgress } from "../context/ProgressContext";
import { exportAssignmentToPdf, shareFile } from "../utils/pdfExport";
import KsbChip from "../components/KsbChip";

export default function AssignmentDetailScreen({ route }) {
  const { assignmentId } = route.params;
  const { activeCourse } = useCourseEngine();
  const { getProgress, completeAssignment, addDocument } = useProgress();

  const assignment = activeCourse.assignments.find((a) => a.id === assignmentId);
  const progress = getProgress(activeCourse.courseId);
  const existing = progress.assignments?.[assignmentId];

  const [activityStatement, setActivityStatement] = useState(existing?.answers?.activityStatement || "");
  const [ksbAnswers, setKsbAnswers] = useState(existing?.answers?.ksbAnswers || {});
  const [photos, setPhotos] = useState(existing?.answers?.photos || []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setActivityStatement(existing?.answers?.activityStatement || "");
    setKsbAnswers(existing?.answers?.ksbAnswers || {});
    setPhotos(existing?.answers?.photos || []);
  }, [assignmentId]);

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Photo library access is required to attach evidence.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const ksbQuestionActivities = assignment.activities.filter((a) => a.type === "question");

  const handleSave = async (markComplete) => {
    setSaving(true);
    const answers = { activityStatement, ksbAnswers, photos };
    if (markComplete) {
      await completeAssignment(activeCourse.courseId, assignmentId, answers);
      Alert.alert("Saved", "Assignment marked complete and added to your progress.");
    } else {
      await completeAssignment(activeCourse.courseId, assignmentId, answers);
    }
    setSaving(false);
  };

  const handleExport = async () => {
    try {
      const uri = await exportAssignmentToPdf({
        course: activeCourse,
        assignment,
        answers: { activityStatement, ksbAnswers },
        photos,
      });
      await addDocument(activeCourse.courseId, {
        id: `${assignmentId}-${Date.now()}`,
        title: `${assignment.title} — Evidence`,
        type: "assignment_pdf",
        createdAt: new Date().toISOString(),
        uri,
      });
      await shareFile(uri);
    } catch (e) {
      Alert.alert("Export failed", "Could not generate the PDF on this device.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{assignment.title}</Text>
      <View style={styles.chipRow}>
        {assignment.ksbs.map((code) => (
          <KsbChip key={code} code={code} complete={existing?.completed} />
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Photographic Evidence</Text>
        <View style={styles.photoRow}>
          {photos.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.photo} />
          ))}
        </View>
        <TouchableOpacity style={styles.secondaryBtn} onPress={pickPhoto}>
          <Text style={styles.secondaryBtnText}>+ Add Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activity Statement</Text>
        <TextInput
          style={styles.textArea}
          multiline
          placeholder="Describe, in your own words, the activity you carried out..."
          value={activityStatement}
          onChangeText={setActivityStatement}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>KSB Questions</Text>
        {ksbQuestionActivities.map((act) => (
          <View key={act.ksbCode} style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
              <KsbChip code={act.ksbCode} />
              <Text style={styles.questionPrompt}>{act.prompt}</Text>
            </View>
            <TextInput
              style={styles.textAreaSmall}
              multiline
              value={ksbAnswers[act.ksbCode] || ""}
              onChangeText={(text) => setKsbAnswers((prev) => ({ ...prev, [act.ksbCode]: text }))}
              placeholder="Your response..."
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => handleSave(true)} disabled={saving}>
        <Text style={styles.primaryBtnText}>{existing?.completed ? "Update & Keep Complete" : "Save & Mark Complete"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
        <Text style={styles.exportBtnText}>Export as PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FA" },
  title: { fontSize: 20, fontWeight: "800", color: "#0F1C2E", marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontWeight: "700", fontSize: 15, marginBottom: 10, color: "#0F1C2E" },
  photoRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  photo: { width: 80, height: 80, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#2E7D5B",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  secondaryBtnText: { color: "#2E7D5B", fontWeight: "700" },
  textArea: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
  },
  textAreaSmall: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: "top",
  },
  questionPrompt: { flex: 1, marginLeft: 8, color: "#444", fontSize: 13 },
  primaryBtn: {
    backgroundColor: "#0F1C2E",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  exportBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#0F1C2E",
  },
  exportBtnText: { color: "#0F1C2E", fontWeight: "700", fontSize: 15 },
});
