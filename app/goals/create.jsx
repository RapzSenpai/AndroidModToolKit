import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGoals } from '../../hooks/useGoals'
import { useRouter } from 'expo-router'
import { auth } from '../../firebaseConfig'

const Create = () => {
  const [goal, setGoal] = useState('')
  const { createGoal } = useGoals()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!goal.trim()) return

    await createGoal({
      title: goal,
      progress: 0,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    })

    setGoal('')
    Keyboard.dismiss()
    router.push('/goals')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Add New Tool</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter tool name"
          placeholderTextColor="#888"
          value={goal}
          onChangeText={setGoal}
        />

        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Add Tool</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#21cc8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 25,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#21cc8d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
})
