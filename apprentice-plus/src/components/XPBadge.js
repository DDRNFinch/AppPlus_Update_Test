import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function XPBadge({ xp = 0 }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.star}>⭐</Text>
      <Text style={styles.text}>{xp} XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4D6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  star: { fontSize: 14, marginRight: 4 },
  text: { fontWeight: "700", color: "#8A6D00" },
});
