import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function QuizCard({ question, onAnswered }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const choose = (index) => {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
    onAnswered(index === question.correctIndex);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.stem}>{question.stem}</Text>
      {question.options.map((opt, i) => {
        const isCorrect = revealed && i === question.correctIndex;
        const isWrongPick = revealed && i === selected && i !== question.correctIndex;
        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.option,
              isCorrect && styles.optionCorrect,
              isWrongPick && styles.optionWrong,
            ]}
            onPress={() => choose(i)}
            disabled={revealed}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  stem: { fontSize: 15, fontWeight: "600", marginBottom: 12, color: "#1A1A1A" },
  option: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  optionCorrect: { backgroundColor: "#E6F5EA", borderColor: "#2E7D5B" },
  optionWrong: { backgroundColor: "#FBEAEA", borderColor: "#C0392B" },
  optionText: { fontSize: 14, color: "#333" },
});
