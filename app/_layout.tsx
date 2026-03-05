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
        <Stack.Screen
          name="record/reason"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="record/event"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="record/thought"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="record/desire"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="record/analyzing"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="record/summary"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'fade',
          }}
        />
      </Stack>
    </>
  );
}
