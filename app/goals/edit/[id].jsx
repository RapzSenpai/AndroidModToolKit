import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  ActivityIndicator, 
  Keyboard, 
  Switch 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const EditTool = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const docRef = doc(db, "goals", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setDescription(data.description || "");
          setEnabled(data.enabled ?? false);
        }
      } catch (error) {
        console.log("Error fetching tool:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, {
        title,
        description,
        enabled,
      });
      Keyboard.dismiss();
      router.push("/goals");
    } catch (error) {
      console.log("Error updating tool:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#21cc8d" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Tool Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter tool name"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          placeholder="Enter description"
          placeholderTextColor="#888"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.toggleRow}>
          <Text style={styles.label}>Enable Tool</Text>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            thumbColor={enabled ? "#21cc8d" : "#888"}
            trackColor={{ false: "#444", true: "#21cc8d55" }}
          />
        </View>
      </View>

      <Pressable onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Update Tool</Text>
      </Pressable>
    </View>
  );
};

export default EditTool;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
    marginTop: 60,
  },
  label: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#21cc8d",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});
