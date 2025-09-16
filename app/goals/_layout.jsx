import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { GoalsProvider } from '../../contexts/GoalsContext'
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../firebaseConfig"
import { useRouter } from "expo-router"
import { View, ActivityIndicator } from "react-native"

export default function GoalsLayout() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login")
      }
      setChecking(false)
    })
    return unsub
  }, [])

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <GoalsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1E1E1E",
            borderTopColor: "#333",
          },
          tabBarActiveTintColor: "#21cc8d",
          tabBarInactiveTintColor: "#aaa",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Your Tools",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                size={24}
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Add Tool",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                size={24}
                name={focused ? "construct" : "construct-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="edit/[id]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </GoalsProvider>
  )
}
