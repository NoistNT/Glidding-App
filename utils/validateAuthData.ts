import { Alert } from 'react-native'

import { AuthUserData } from '../types'

export const validateAuthData = (userDataAuth: AuthUserData) => {
  if (!userDataAuth.email) {
    Alert.alert('Email is required')

    return
  }

  if (!userDataAuth.password) {
    Alert.alert('Password is required')

    return
  }

  return true
}
