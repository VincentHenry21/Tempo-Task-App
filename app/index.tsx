import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '../src/context/AuthContext';

export default function Index(): React.JSX.Element {
  const { isReady, isSignedIn } = useAuth();
  if (!isReady) {
    return <></>;
  }
  if (isSignedIn) {
    return <Redirect href="/(tabs)/home" />;
  }
  return <Redirect href="/welcome" />;
}
