import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        return null;
    }

    if (isSignedIn) {
        return <Redirect href="/(index)" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="index" options={{ headerTitle: "Log in" }} />
            <Stack.Screen name="SignUpScreen" options={{ headerTitle: "", headerShown: true }} />
            <Stack.Screen name="ResetPasswordScreen" options={{ headerTitle: "", headerShown: true }} />
        </Stack>
    );
}
