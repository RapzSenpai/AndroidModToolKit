import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Android Mod Toolkit</Text>

      <View style={styles.grid}>
        <Link href="/goals" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="list-circle" size={36} color="white" />
            <Text style={styles.tileText}>View Tool</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/goals/create" asChild>
          <TouchableOpacity style={styles.tile}>
            <Ionicons name="add-circle" size={36} color="white" />
            <Text style={styles.tileText}>Add Tool</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/device" asChild>
          <TouchableOpacity style={styles.tile}>
            <MaterialIcons name="info" size={36} color="white" />
            <Text style={styles.tileText}>Device Info</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/device/storage" asChild>
          <TouchableOpacity style={styles.tile}>
            <MaterialIcons name="storage" size={36} color="white" />
            <Text style={styles.tileText}>Storage</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    marginBottom: 30,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  tile: {
    width: 140,
    height: 140,
    backgroundColor: "#21cc8d",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    elevation: 4,
  },
  tileText: {
    marginTop: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Home;
