import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import AssignmentsListScreen from "../screens/AssignmentsListScreen";
import AssignmentDetailScreen from "../screens/AssignmentDetailScreen";
import AcademyListScreen from "../screens/AcademyListScreen";
import AcademyModuleScreen from "../screens/AcademyModuleScreen";
import KsbMatrixScreen from "../screens/KsbMatrixScreen";
import DocumentsScreen from "../screens/DocumentsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CourseSelectScreen from "../screens/CourseSelectScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONS = {
  Home: "🏠",
  Assignments: "📝",
  Academy: "🎓",
  "KSB Matrix": "🧩",
  Documents: "📁",
  Settings: "⚙️",
};

function AssignmentsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AssignmentsList" component={AssignmentsListScreen} options={{ title: "Assignments" }} />
      <Stack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} options={{ title: "Assignment" }} />
    </Stack.Navigator>
  );
}

function AcademyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AcademyList" component={AcademyListScreen} options={{ title: "Academy" }} />
      <Stack.Screen name="AcademyModule" component={AcademyModuleScreen} options={{ title: "Module" }} />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} options={{ title: "Settings" }} />
      <Stack.Screen name="CourseSelect" component={CourseSelectScreen} options={{ title: "Courses" }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: route.name === "Home",
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>{ICONS[route.name]}</Text>,
          tabBarActiveTintColor: "#0F1C2E",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Assignments" component={AssignmentsStack} options={{ headerShown: false }} />
        <Tab.Screen name="Academy" component={AcademyStack} options={{ headerShown: false }} />
        <Tab.Screen name="KSB Matrix" component={KsbMatrixScreen} />
        <Tab.Screen name="Documents" component={DocumentsScreen} />
        <Tab.Screen name="Settings" component={SettingsStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
