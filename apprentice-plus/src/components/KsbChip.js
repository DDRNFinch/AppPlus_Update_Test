import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TYPE_COLORS = {
  K: { bg: "#E3EEFB", fg: "#1D4E89" },
  S: { bg: "#E6F5EA", fg: "#1F6D3A" },
  B: { bg: "#F6E9FB", fg: "#6A2A82" },
};

export default function KsbChip({ code, complete }) {
  const type = code?.[0] || "K";
  const colors = TYPE_COLORS[type] || TYPE_COLORS.K;
  return (
    <View
      style={[
        styles.chip,
        { backgroundColor: complete ? colors.fg : colors.bg },
      ]}
    >
      <Text style={[styles.text, { color: complete ? "#fff" : colors.fg }]}>{code}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  text: { fontSize: 12, fontWeight: "700" },
});
