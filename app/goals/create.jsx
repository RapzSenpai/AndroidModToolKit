import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGoals } from '../../hooks/useGoals'
import { useRouter } from 'expo-router'
import { auth } from '../../firebaseConfig'
import { Picker } from '@react-native-picker/picker'

const Create = () => {
  const [goal, setGoal] = useState('')
  const [category, setCategory] = useState('Performance')
  const [description, setDescription] = useState('')
  const { createGoal } = useGoals()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!goal.trim()) return

    await createGoal({
      title: goal,
      category,
      description,
      progress: 0,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    })

    setGoal('')
    setCategory('Performance')
    setDescription('')
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

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            dropdownIconColor="#21cc8d"
            style={styles.picker}
          >
            <Picker.Item label="Performance" value="Performance" />
            <Picker.Item label="Battery" value="Battery" />
            <Picker.Item label="Debugging" value="Debugging" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Enter description (optional)"
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
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
    marginBottom: 20,
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    color: '#fff',
    height: 50,
    width: '100%',
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
