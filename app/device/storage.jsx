import React, { useEffect, useState, useRef } from "react";
import {View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator, Animated,} from "react-native";
import * as FileSystem from "expo-file-system";

const categories = [
  { id: "1", name: "Photos", icon: "📷" },
  { id: "2", name: "Videos", icon: "🎥" },
  { id: "3", name: "Audio", icon: "🎵" },
  { id: "4", name: "Documents", icon: "📄" },
  { id: "5", name: "Apps", icon: "📱" },
  { id: "6", name: "APKs", icon: "📦" },
];

const StorageAnalyzer = () => {
  const [storage, setStorage] = useState({ total: 0, free: 0, used: 0 });
  const [mockData, setMockData] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const progressAnim = useRef(new Animated.Value(0)).current;

  const fetchStorage = async () => {
    try {
      setLoading(true);
      const free = await FileSystem.getFreeDiskStorageAsync();
      const total = await FileSystem.getTotalDiskCapacityAsync();
      const used = total - free;

      setStorage({ total, free, used });
      generateMockData();
    } catch (error) {
      console.log("Error fetching storage info:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const data = categories.map((cat) => ({
      ...cat,
      size: (Math.random() * 2 + 0.2).toFixed(2),
    }));
    setMockData(data);
  };

  useEffect(() => {
    fetchStorage();
  }, []);

  const formatGB = (bytes) => (bytes / 1024 ** 3).toFixed(2);
  const progress = storage.total > 0 ? storage.used / storage.total : 0;

  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Storage Analyzer</Text>

      <View style={styles.card}>
        <Text style={styles.mainLabel}>Overall Storage</Text>

        <View style={styles.progressWrap}>
          <Animated.View
            style={[
              styles.progressFill,
              { flex: progressAnim } 
            ]}
          />
          <View style={{ flex: 1 - progress }} />
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            Used: <Text style={styles.statValue}>{formatGB(storage.used)} GB</Text>
          </Text>
          <Text style={styles.statText}>
            Free: <Text style={styles.statValue}>{formatGB(storage.free)} GB</Text>
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.refreshBtn,
            pressed && { opacity: 0.85 },
            loading && { opacity: 0.8 },
          ]}
          onPress={fetchStorage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#121212" />
          ) : (
            <Text style={styles.refreshText}>Refresh</Text>
          )}
        </Pressable>
      </View>

     
      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <View style={styles.smallCard}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.smallTitle}>{item.name}</Text>
            <Text style={styles.smallSize}>{item.size} GB</Text>
          </View>
        )}
      />
    </View>
  );
};

export default StorageAnalyzer;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    color: "#21cc8d",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 50,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 14,
    padding: 16,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  mainLabel: {
    color: "#e6f9ef",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "600",
  },
  progressWrap: {
    height: 28,
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#232323",
  },
  progressFill: {
    backgroundColor: "#21cc8d",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statText: {
    color: "#cfeede",
    fontSize: 14,
  },
  statValue: {
    color: "#ffffff",
    fontWeight: "700",
  },
  refreshBtn: {
    marginTop: 14,
    backgroundColor: "#21cc8d",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  refreshText: {
    color: "#121212",
    fontWeight: "700",
    fontSize: 15,
  },
  sectionTitle: {
    color: "#cfeede",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 6,
  },
  cardList: {
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 8,
  },
  smallCard: {
    width: "48%",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 26,
    marginBottom: 8,
  },
  smallTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  smallSize: {
    marginTop: 6,
    color: "#21cc8d",
    fontWeight: "700",
  },
});
