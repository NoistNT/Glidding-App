import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Input, Text } from 'react-native-elements'

import { supabase } from '../lib/supabase'
import { validateAuthData } from '../utils/validateAuthData'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [authUserData, setAuthUserData] = useState({
    email: '',
    password: ''
  })

  const signInWithEmail = async () => {
    setLoading(true)

    if (!validateAuthData(authUserData)) {
      setLoading(false)

      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: authUserData.email,
      password: authUserData.password
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const signUpWithEmail = async () => {
    setLoading(true)

    if (!validateAuthData(authUserData)) {
      setLoading(false)

      return
    }

    const {
      data: { session },
      error
    } = await supabase.auth.signUp({
      email: authUserData.email,
      password: authUserData.password
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification')
    setLoading(false)
  }

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    setAuthUserData({ ...authUserData, [name]: value })
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text h2 style={styles.title}>
          Glidding App
        </Text>
        <Text style={styles.subtitle}>
          Please sign in or sign up to continue
        </Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.verticallySpaced}>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            label="Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            placeholder="email@address.com"
            value={authUserData.email}
            onChangeText={(value) => handleChange({ name: 'email', value })}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            label="Password"
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            placeholder="Password"
            value={authUserData.password}
            onChangeText={(value) => handleChange({ name: 'password', value })}
          />
        </View>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          buttonStyle={{
            backgroundColor: 'black',
            paddingVertical: 12,
            marginVertical: 2
          }}
          disabled={loading}
          title="Sign In"
          onPress={() => signInWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          buttonStyle={{
            backgroundColor: 'slateblue',
            paddingVertical: 12,
            marginVertical: 2
          }}
          disabled={loading}
          title="Sign Up"
          onPress={() => signUpWithEmail()}
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
    fontSize: 17,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 12
  },
  formContainer: {
    marginTop: 12,
    width: '100%'
  },
  verticallySpaced: {
    paddingVertical: 4,
    alignSelf: 'stretch'
  }
})
