// app/profile/index.jsx
import { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [savedName, setSavedName] = useState("Your Name");
  const [savedBio, setSavedBio] = useState("This is your bio...");
  const [isEditing, setIsEditing] = useState(true);

  const achievements = [
  { title: "Kernel Tweaker", desc: "Optimized CPU & GPU performance", progress: 80 },
  { title: "UI Modder", desc: "Customized Android UI elements", progress: 100 },
  { title: "Magisk Master", desc: "Flashed 50+ modules", progress: 65 },
  { title: "Bug Hunter", desc: "Reported & fixed system issues", progress: 40 },
];


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    setSavedName(name || "Your Name");
    setSavedBio(bio || "This is your bio...");
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.imageWrapper}>
        <TouchableOpacity onPress={pickImage} activeOpacity={0.8} disabled={!isEditing}>
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.addPhotoText}>+</Text>
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.editPhotoText}>
          {isEditing ? "Change Photo" : "Profile Photo"}
        </Text>
      </View>

      {isEditing ? (
        <>
          {/* Name Input */}
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#666"
          />

          {/* Bio Input */}
          <TextInput
            style={[styles.input, styles.bio]}
            value={bio}
            onChangeText={setBio}
            placeholder="Enter your bio"
            placeholderTextColor="#666"
            multiline
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Display Mode */}
          <Text style={styles.displayName}>{savedName}</Text>
          <Text style={styles.displayBio}>{savedBio}</Text>

          {/* Achievements */}
          <View style={styles.achievementsContainer}>
  <Text style={styles.achievementsTitle}>Achievements</Text>
  <View style={styles.cardsWrapper}>
    {achievements.map((ach, index) => (
      <View key={index} style={styles.achievementCard}>
        {/* Badge Icon or Rank */}
        <View style={styles.badgeTop}>
          <Text style={styles.rankText}>{index + 1}</Text>
        </View>

        {/* Main Title */}
        <Text style={styles.achievementTitle}>{ach.title}</Text>

        {/* Description */}
        <Text style={styles.achievementDesc}>{ach.desc}</Text>

        {/* Optional Progress */}
        <View style={styles.progressBarWrapper}>
          <View style={[styles.progressBar, { width: `${ach.progress}%` }]} />
        </View>

        <Text style={styles.progressText}>{ach.progress}%</Text>
      </View>
    ))}
  </View>
</View>

          {/* Edit Button */}
          <TouchableOpacity style={styles.editButton} onPress={handleEdit} activeOpacity={0.8}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    backgroundColor: "#121212",
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#1e1e1e",
    borderWidth: 3,
    borderColor: "#21cc8d",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  addPhotoText: {
    color: "#21cc8d",
    fontSize: 32,
    fontWeight: "bold",
  },
  editPhotoText: {
    color: "#21cc8d",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    width: "85%",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    color: "#fff",
  },
  bio: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#21cc8d",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 4,
  },
  saveButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  displayName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  displayBio: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 20,
    textAlign: "center",
    width: "80%",
  },
  achievementsContainer: {
    width: "90%",
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#21cc8d",
    marginBottom: 10,
  },
  badgesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    backgroundColor: "#21cc8d20", // transparent accent
    borderWidth: 1,
    borderColor: "#21cc8d",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  badgeText: {
    color: "#21cc8d",
    fontWeight: "600",
    fontSize: 14,
  },
  editButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#21cc8d",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
  },
  editButtonText: {
    color: "#21cc8d",
    fontSize: 16,
    fontWeight: "600",
  },
  achievementsContainer: {
  width: "90%",
  backgroundColor: "#1e1e1e",
  borderRadius: 16,
  padding: 15,
  marginBottom: 20,
},
achievementsTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#21cc8d",
  marginBottom: 12,
},
cardsWrapper: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},
card: {
  width: "48%", // two cards per row
  backgroundColor: "#121212",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#21cc8d",
  padding: 16,
  marginBottom: 12,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#21cc8d",
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 5,
},
cardText: {
  color: "#21cc8d",
  fontWeight: "600",
  fontSize: 14,
  textAlign: "center",
},
achievementsContainer: {
  width: "100%",
  padding: 10,
},
achievementsTitle: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#fff",
  marginBottom: 15,
},
cardsWrapper: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},
achievementCard: {
  width: "48%",
  backgroundColor: "#121524",
  borderRadius: 18,
  padding: 15,
  marginBottom: 15,
  alignItems: "center",
  shadowColor: "#21cc8d",
  shadowOpacity: 0.4,
  shadowRadius: 10,
  elevation: 6,
  borderWidth: 1,
  borderColor: "#21cc8d",
},
badgeTop: {
  backgroundColor: "#21cc8d",
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 12,
  marginBottom: 10,
},
rankText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 12,
},
achievementTitle: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#fff",
  marginBottom: 6,
  textAlign: "center",
},
achievementDesc: {
  fontSize: 13,
  color: "#aaa",
  textAlign: "center",
  marginBottom: 10,
},
progressBarWrapper: {
  width: "100%",
  height: 6,
  backgroundColor: "#333",
  borderRadius: 3,
  overflow: "hidden",
  marginTop: 5,
},
progressBar: {
  height: "100%",
  backgroundColor: "#21cc8d",
},
progressText: {
  marginTop: 4,
  fontSize: 12,
  color: "#21cc8d",
  fontWeight: "600",
},

});
