import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useCourseEngine } from "../context/CourseEngineContext";
import { loadJSON, saveJSON } from "../utils/storage";

export default function SettingsScreen({ navigation }) {
  const { activeCourse } = useCourseEngine();
  const [name, setName] = useState("");
  const [employer, setEmployer] = useState("");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    (async () => {
      const profile = await loadJSON("profile", { name: "", employer: "" });
      const notif = await loadJSON("notificationsEnabled", true);
      setName(profile.name);
      setEmployer(profile.employer);
      setNotifications(notif);
    })();
  }, []);

  const saveProfile = async (next) => {
    await saveJSON("profile", next);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.sectionHeading}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(t) => {
            setName(t);
            saveProfile({ name: t, employer });
          }}
          placeholder="Your name"
        />
        <Text style={styles.label}>Employer</Text>
        <TextInput
          style={styles.input}
          value={employer}
          onChangeText={(t) => {
            setEmployer(t);
            saveProfile({ name, employer: t });
          }}
          placeholder="Your employer"
        />
      </View>

      <Text style={styles.sectionHeading}>Course</Text>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("CourseSelect")}>
        <Text style={styles.label}>Active course</Text>
        <Text style={styles.activeCourseText}>{activeCourse ? activeCourse.title : "None selected"}</Text>
        <Text style={styles.linkText}>Manage courses →</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeading}>Notifications</Text>
      <View style={[styles.card, styles.row]}>
        <Text style={styles.label}>Daily goal reminders</Text>
        <Switch
          value={notifications}
          onValueChange={(v) => {
            setNotifications(v);
            saveJSON("notificationsEnabled", v);
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FA" },
  sectionHeading: { fontWeight: "800", fontSize: 14, color: "#8A93A3", marginTop: 8, marginBottom: 10, textTransform: "uppercase" },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { color: "#666", fontSize: 13, marginBottom: 4, marginTop: 8 },
  input: { borderWidth: 1, borderColor: "#DDD", borderRadius: 8, padding: 10, fontSize: 15 },
  activeCourseText: { fontSize: 16, fontWeight: "700", color: "#0F1C2E", marginBottom: 8 },
  linkText: { color: "#2E7D5B", fontWeight: "600" },
});
