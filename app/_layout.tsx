import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput } from 'react-native';

// Globally apply SF Pro (system font) to all Text and TextInput
const defaultTextStyle = { fontFamily: 'System' } as const;
// @ts-ignore
Text.defaultProps = { ...(Text.defaultProps || {}), style: defaultTextStyle };
// @ts-ignore
TextInput.defaultProps = { ...(TextInput.defaultProps || {}), style: defaultTextStyle };

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="record/emotion"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  );
}
