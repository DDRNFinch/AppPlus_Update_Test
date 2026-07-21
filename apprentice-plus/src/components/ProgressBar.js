import React from "react";
import { View, StyleSheet } from "react-native";

export default function ProgressBar({ pct = 0, color = "#2E7D5B", height = 10 }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped}%`, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    backgroundColor: "#E2E6EA",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
