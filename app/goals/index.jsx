// Tools.jsx (with floating logout)
import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [runningTool, setRunningTool] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // logout state
  const [showLogout, setShowLogout] = useState(false);
  const logoutAnim = useRef(new Animated.Value(0)).current;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'goals'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        enabled: doc.data().enabled ?? false,
      }));
      setTools(list);
    });

    return unsubscribe;
  }, []);

  const handleDelete = (id) => {
    Alert.alert('Delete Tool', 'Are you sure you want to delete this tool?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const docRef = doc(db, 'goals', id);
            await deleteDoc(docRef);
          } catch (error) {
            console.log('Error deleting tool:', error);
          }
        },
      },
    ]);
  };

  // RUN flow: show spinner -> show animated check -> auto close
  const handleRunTool = (tool) => {
    setRunningTool(tool);
    setShowSuccess(false);
    // reset animation values
    scaleAnim.setValue(0);
    textOpacity.setValue(0);

    // simulate running process (2s)
    setTimeout(() => {
      setShowSuccess(true);
      // animate check mark scale
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
      }).start();
      // fade in "Done!" text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // after showing success, close modal
      setTimeout(() => {
        // fade out text quickly
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();

        // small delay to let fade-out run then close
        setTimeout(() => {
          setRunningTool(null);
          setShowSuccess(false);
        }, 220);
      }, 1200);
    }, 2000);
  };

  const toggleEnable = async (tool) => {
    try {
      const updatedTools = tools.map((t) => {
        if (t.id === tool.id) {
          return { ...t, enabled: !t.enabled };
        }
        return t;
      });
      setTools(updatedTools);

      const docRef = doc(db, 'goals', tool.id);
      await updateDoc(docRef, { enabled: !tool.enabled });
    } catch (error) {
      console.log('Error toggling tool:', error);
    }
  };

  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <Pressable
        style={[styles.swipeButton, styles.editButton]}
        onPress={() => router.push(`/goals/edit/${item.id}`)}
      >
        <Ionicons name="create-outline" size={24} color="#fff" />
        <Text style={styles.swipeText}>Edit</Text>
      </Pressable>
    );

    const renderLeftActions = () => (
      <Pressable
        style={[styles.swipeButton, styles.deleteButton]}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.swipeText}>Delete</Text>
      </Pressable>
    );

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
      >
        <View style={styles.card}>
          {/* Category badge & status */}
          <View style={styles.headerRow}>
            <Text style={styles.categoryBadge}>
              {item.category || 'Uncategorized'}
            </Text>
            <Text style={styles.statusText}>
              {item.enabled ? '🟢 Running' : '⚪ Idle'}
            </Text>
          </View>

          {/* Tool name & description */}
          <Text style={styles.toolName}>{item.title || 'Untitled Tool'}</Text>
          {item.description ? (
            <Text style={styles.description}>{item.description}</Text>
          ) : null}

          {/* Run & Enable buttons */}
          <View style={styles.actionsContainer}>
            <Pressable style={styles.runButton} onPress={() => handleRunTool(item)}>
              <Text style={styles.actionText}>Run</Text>
            </Pressable>

            <Pressable
              style={[
                styles.toggleButton,
                { backgroundColor: item.enabled ? '#21cc8d' : '#E53935' },
              ]}
              onPress={() => toggleEnable(item)}
            >
              <Text style={styles.actionText}>
                {item.enabled ? 'Enabled' : 'Disabled'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Your Tools</Text>

        <FlatList
          data={tools}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No tools yet. Add one!</Text>}
        />

        {/* Floating Logout Button */}
        {/* Sliding Logout Popout */}
        <Animated.View
          style={[
            styles.floatingLogoutContainer,
            {
              transform: [
                {
                  translateY: logoutAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0], // slides up
                  }),
                },
                { scale: logoutAnim },
              ],
              opacity: logoutAnim,
            },
          ]}
        >
          {showLogout && (
            <Pressable
              style={styles.logoutPopout}
              onPress={() => signOut(auth)}
            >
              <Text style={styles.logoutPopoutText}>Logout</Text>
            </Pressable>
          )}
        </Animated.View>

        <Pressable
          style={styles.floatingLogoutButton}
          onPress={() => {
            setShowLogout(!showLogout);
            Animated.spring(logoutAnim, {
              toValue: showLogout ? 0 : 1,
              useNativeDriver: true,
              friction: 5,
              tension: 80,
            }).start();
          }}
        >
          <Ionicons name="log-out-outline" size={28} color="#fff" />
        </Pressable>

        {/* Modal for Running Tool */}
        <Modal
          transparent
          animationType="fade"
          visible={!!runningTool}
          onRequestClose={() => {
            setRunningTool(null);
            setShowSuccess(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              {!showSuccess ? (
                <>
                  <ActivityIndicator size="large" color="#21cc8d" />
                  <Text style={styles.modalText}>Running scripts...</Text>
                </>
              ) : (
                <>
                  <Animated.View
                    style={[
                      styles.modalCircle,
                      { transform: [{ scale: scaleAnim }] },
                    ]}
                  >
                    <Ionicons name="checkmark" size={48} color="#fff" />
                  </Animated.View>
                  <Animated.Text style={[styles.modalText, { opacity: textOpacity }]}>
                    Done!
                  </Animated.Text>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Tools;

/* styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#21cc8d',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  toolName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  statusText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  runButton: {
    backgroundColor: '#21cc8d',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 10,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  swipeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 12,
  },
  swipeText: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#21cc8d',
  },
  deleteButton: {
    backgroundColor: '#E53935',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
    color: '#888',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#21cc8d',
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  description: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
    marginBottom: 10,
  },

  /* modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1e1e1e',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#21cc8d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    marginTop: 12,
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  /* floating logout */
  floatingLogoutButton: {
  position: 'absolute',
  bottom: 30,
  right: 30,
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#E53935',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 5,
},
floatingLogoutContainer: {
  position: 'absolute',
  bottom: 100,
  right: 30,
  alignItems: 'center',
},
logoutPopout: {
  backgroundColor: '#E53935',
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 20,
  marginBottom: 8,
  elevation: 5,
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
},
logoutPopoutText: {
  color: '#fff',
  fontWeight: '600',
},
});
