import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const Tools = () => {
  const [tools, setTools] = useState([]);
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
        enabled: doc.data().enabled ?? false, // default to false
      }));
      setTools(list);
    });

    return unsubscribe;
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Tool',
      'Are you sure you want to delete this tool?',
      [
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
      ]
    );
  };

  const handleRunTool = (tool) => {
    Alert.alert(`Running ${tool.title}`, 'Tool executed successfully!');
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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Tools</Text>

      <FlatList
        data={tools}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            
            {/* Static info */}
            <Text style={styles.toolName}>{item.title || 'Untitled Tool'}</Text>
            <Text style={styles.statusText}>
              Status: {item.enabled ? 'Running' : 'Idle'}
            </Text>

            {/* Optional progress */}
            {item.progress !== undefined && (
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${item.progress ?? 0}%` },
                  ]}
                />
              </View>
            )}

            {/* Interactive buttons */}
            <View style={styles.actionsContainer}>
              <Pressable
                style={styles.runButton}
                onPress={() => handleRunTool(item)}
              >
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

            {/* Edit/Delete secondary */}
            <View style={styles.secondaryButtons}>
              <Pressable
                style={[styles.button, styles.editButton]}
                onPress={() => router.push(`/goals/edit/${item.id}`)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>

              <Pressable style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(item.id)} > 
                <Text style={styles.buttonText}>Delete</Text> 
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tools yet. Add one!</Text>
        }
      />

      <Pressable style={styles.logoutButton} onPress={() => signOut(auth)}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Tools;

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
  progressBarBackground: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#21cc8d',
    borderRadius: 6,
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
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#21cc8d',
  },
  deleteButton: {
    backgroundColor: '#E53935',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
    color: '#888',
  },
  logoutButton: {
    backgroundColor: '#E53935',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
