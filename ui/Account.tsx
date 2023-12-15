import { Session } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Input, Text } from 'react-native-elements'

import { supabase } from '../lib/supabase'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    username: '',
    name: '',
    lastName: '',
    avatarUrl: ''
  })

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    setUserData({ ...userData, [name]: value })
  }

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, name, last_name, avatar_url`)
        .eq('id', session?.user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data)
        setUserData({
          ...userData,
          username: data.username,
          name: data.name,
          lastName: data.last_name,
          avatarUrl: data.avatar_url
        })
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    name,
    last_name,
    avatar_url
  }: {
    username: string
    name: string
    last_name: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        name,
        last_name,
        avatar_url,
        updated_at: new Date()
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      Alert.alert('Success', 'Profile updated!')
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome to My App</Text>
        <Text style={styles.subtitle}>Update your profile info</Text>
      </View>
      <View style={styles.formContainer}>
        <View>
          <Input disabled label="Email" value={session?.user?.email} />
        </View>
        <View>
          <Input
            label="Username"
            value={userData.username || ''}
            onChangeText={(value) => handleChange({ name: 'username', value })}
          />
        </View>
        <View>
          <Input
            label="Name"
            value={userData.name || ''}
            onChangeText={(value) => handleChange({ name: 'name', value })}
          />
        </View>
        <View>
          <Input
            label="Lastname"
            value={userData.lastName || ''}
            onChangeText={(value) => handleChange({ name: 'lastName', value })}
          />
        </View>
      </View>

      <View>
        <Button
          buttonStyle={{
            backgroundColor: 'black',
            paddingVertical: 12,
            marginVertical: 4
          }}
          disabled={loading}
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() =>
            updateProfile({
              username: userData.username,
              name: userData.name,
              last_name: userData.lastName,
              avatar_url: userData.avatarUrl
            })
          }
        />
      </View>

      <View>
        <Button
          buttonStyle={{
            backgroundColor: 'slateblue',
            paddingVertical: 12,
            marginVertical: 4
          }}
          disabled={loading}
          title="Sign Out"
          onPress={() => supabase.auth.signOut()}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 8
  },
  titleContainer: {
    marginBottom: 20
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    paddingVertical: 12
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center'
  },
  formContainer: {
    marginTop: 12,
    width: '100%'
  }
})
