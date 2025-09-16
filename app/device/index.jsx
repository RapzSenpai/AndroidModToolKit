import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  PixelRatio,
  Pressable,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Device from "expo-device";

const DeviceInfoChecker = () => {
  const [info, setInfo] = useState({
    deviceName: "",
    deviceType: "",
    osVersion: "",
    manufacturer: "",
    resolution: "",
    ram: "",
    cpu: "",
    refreshRate: "",
  });

  const [rrChecking, setRrChecking] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [rootChecking, setRootChecking] = useState(false);
  const [rootResult, setRootResult] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const { width, height } = Dimensions.get("window");
        const pixelRatio = PixelRatio.get();
        const realWidth = Math.round(width * pixelRatio);
        const realHeight = Math.round(height * pixelRatio);

        const manufacturer = Device.manufacturer ?? "Unknown";
        const osVersion = Device.osVersion ?? "Unknown";
        const modelName = Device.modelName ?? "Unknown";
        const supportedAbis = Device.supportedCpuArchitectures ?? [];

        setInfo((prev) => ({
          ...prev,
          deviceName: modelName,
          deviceType:
            Device.deviceType === Device.DeviceType.PHONE
              ? "Phone"
              : Device.deviceType === Device.DeviceType.TABLET
              ? "Tablet"
              : "Unknown",
          osVersion,
          manufacturer,
          resolution: `${realWidth}x${realHeight}`,
          ram: "8GB",
          cpu: supportedAbis[0] || "Unknown",
        }));
      } catch (err) {
        console.log("Error fetching device info: ", err);
      }
    };

    fetchInfo();
  }, []);

  const checkRefreshRate = () => {
    setRrChecking(true);
    let frames = 0;
    let start = performance.now();

    const countFrames = (time) => {
      frames++;
      if (time - start < 1000) {
        requestAnimationFrame(countFrames);
      } else {
        const fps = Math.round((frames * 1000) / (time - start));
        setInfo((prev) => ({ ...prev, refreshRate: `${fps} Hz` }));
        setRrChecking(false);
      }
    };

    requestAnimationFrame(countFrames);
  };

  const heuristicRootCheck = async () => {
    try {
      if (!Device.isDevice) {
        return { status: "not_rooted", reason: "Emulator/Simulator detected" };
      }
      const devManufacturers = ["Unknown", "Genymotion", "generic"];
      const man = (Device.manufacturer || "").toLowerCase();
      if (devManufacturers.some((d) => man.includes(d.toLowerCase()))) {
        return { status: "unknown", reason: "Manufacturer suggests non-standard device" };
      }
      return { status: "unknown", reason: "Kindly turn on Demo Mode" };
    } catch (e) {
      return { status: "unknown", reason: "Error during heuristic check" };
    }
  };

  const checkRoot = async () => {
    setRootChecking(true);
    setRootResult(null);

    await new Promise((r) => setTimeout(r, 900));

    if (demoMode) {
      setRootResult({ status: "not_rooted", simulated: true, reason: "" });
      setRootChecking(false);
      return;
    }

    const res = await heuristicRootCheck();
    if (res.status === "not_rooted") {
      setRootResult({ status: "not_rooted", simulated: false, reason: res.reason });
    } else if (res.status === "rooted") {
      setRootResult({ status: "rooted", simulated: false, reason: res.reason });
    } else {
      setRootResult({ status: "unknown", simulated: false, reason: res.reason });
    }
    setRootChecking(false);
  };

  const renderRootText = () => {
    if (!rootResult) return "Checking..";
    const { status, reason } = rootResult;
    if (status === "not_rooted") return `Not Rooted${reason ? ` — ${reason}` : ""}`;
    if (status === "rooted") return `Rooted${reason ? ` — ${reason}` : ""}`;
    return `Unknown${reason ? ` — ${reason}` : ""}`;
  };

  // Static device info keys
  const staticInfo = [
    { label: "Device Name", value: info.deviceName },
    { label: "Device Type", value: info.deviceType },
    { label: "Manufacturer", value: info.manufacturer },
    { label: "Screen Resolution", value: info.resolution },
    { label: "RAM", value: info.ram },
    { label: "CPU", value: info.cpu },
    { label: "OS Version", value: info.osVersion },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Device</Text>

      {/* Static Info Grid */}
      <View style={styles.staticGrid}>
        {staticInfo.map((item) => (
          <View style={styles.staticCard} key={item.label}>
            <Text style={styles.staticLabel}>{item.label}</Text>
            <Text style={styles.staticValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Interactive Cards */}
      <View style={styles.interactiveCard}>
        <Text style={styles.interactiveLabel}>Refresh Rate</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.primaryBtn} onPress={checkRefreshRate}>
            {rrChecking ? <ActivityIndicator color="#121212" /> : <Text style={styles.primaryBtnText}>Check</Text>}
          </TouchableOpacity>
          <Text style={[styles.interactiveValue, { marginLeft: 12 }]}>{info.refreshRate || "—"}</Text>
        </View>
      </View>

      <View style={styles.interactiveCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.interactiveLabel}>Root / Jailbreak Checker</Text>
          <View style={{ alignItems: "flex-end" }}>
      
          </View>
        </View>
        <Text style={[styles.interactiveValue, { marginTop: 8 }]}>{renderRootText()}</Text>
        <Pressable style={styles.secondaryBtn} onPress={checkRoot} disabled={rootChecking}>
          {rootChecking ? (
            <ActivityIndicator color="#121212" />
          ) : (
            <Text style={styles.secondaryBtnText}>Check Root</Text>
          )}
        </Pressable>
        <Text style={styles.note}>Note: This is just a Demo Mode made by Rapzz</Text>
      </View>
    </ScrollView>
  );
};

export default DeviceInfoChecker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 40,
    color: "#21cc8d",
  },
  staticGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  staticCard: {
    width: "48%",
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  staticLabel: {
    fontSize: 14,
    color: "#9fbfa8",
    fontWeight: "600",
  },
  staticValue: {
    fontSize: 15,
    color: "#e6f9ef",
    marginTop: 4,
  },
  interactiveCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
  },
  interactiveLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#21cc8d",
  },
  interactiveValue: {
    fontSize: 16,
    color: "#e6f9ef",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  note: {
    fontSize: 12,
    color: "#9aa498",
    marginTop: 6,
  },
  primaryBtn: {
    backgroundColor: "#21cc8d",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: "#e6f9ef",
    fontWeight: "700",
  },
  secondaryBtn: {
    marginTop: 12,
    backgroundColor: "#21cc8d",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#e6f9ef",
    fontWeight: "700",
    fontSize: 15,
  },
});
