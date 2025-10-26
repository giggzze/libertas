import { ThemedText } from "@/src/components/themed-text";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { BodyScrollView } from "@/src/components/ui/BodyScrollView";
import Button from "@/src/components/ui/Button";
import TextInput from "@/src/components/ui/TextInput";


export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSingingIn] = useState(false);

    const handleSignIn = async () => {
        if (!isLoaded) return;

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: email,
                password
            });

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace("/");
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <BodyScrollView contentContainerStyle={{ padding: 10, flex: 1 }}>
            <View
                style={{
                    paddingVertical: 60,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10
                }}
            >
                <Text
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 20,
                        fontWeight: "bold",
                        letterSpacing: 10
                    }}
                >
                    Libertas
                </Text>
                <Text
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 14,
                        fontWeight: "700",
                        letterSpacing: 2,
                        textAlign: "center"
                    }}
                >
                    Lets get you back in charge
                </Text>
            </View>
            <View>
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    label="Password"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                    placeholder="Password"
                    autoCapitalize="none"
                    keyboardType="visible-password"
                />
                <Button
                    onPress={handleSignIn}
                    loading={isSingingIn}
                    disabled={isSingingIn || !email || !password}
                >
                    Sign in
                </Button>

                <View style={{ marginTop: 16, alignItems: "center" }}>
                    <ThemedText>Don&#39;t have an account?</ThemedText>
                    <Button variant="ghost" onPress={() => router.push("/SignUpScreen")}>
                        Sign up
                    </Button>
                </View>

                <View style={{ marginTop: 16, alignItems: "center" }}>
                    <ThemedText>Forgot password?</ThemedText>
                    <Button
                        variant="ghost"
                        onPress={() => router.push("/ResetPasswordScreen")}
                    >
                        Reset password
                    </Button>
                </View>
            </View>
        </BodyScrollView>
    );
}
