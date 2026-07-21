import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CourseEngineProvider } from "./src/context/CourseEngineContext";
import { ProgressProvider } from "./src/context/ProgressContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <CourseEngineProvider>
        <ProgressProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </ProgressProvider>
      </CourseEngineProvider>
    </SafeAreaProvider>
  );
}
