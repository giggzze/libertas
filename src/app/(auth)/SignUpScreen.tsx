import Button from "@/src/components/ui/Button";
import TextInput from "@/src/components/ui/TextInput";
import { useRouter } from "expo-router";
import { useState } from "react";
import { BodyScrollView } from "@/src/components/ui/BodyScrollView";
import { useSignUp } from "@clerk/clerk-expo";
import Toast from "@/src/components/ui/Toast";
import { ClerkAPIError } from "@clerk/types";
import { DatabaseService } from "@/src/services/database";
import { ThemedText } from "@/src/components/themed-text";
import { Text, View } from "react-native";

/**
 * SignUpScreen is the screen for users to sign up.
 *
 * - Renders a form with email and password fields.
 * - Handles sign-up using Clerk's `useSignUp` hook.
 * - On successful sign-up, sets the active session and redirects to the home page.
 */
export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ClerkAPIError[]>([]);

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleSignup = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    setErrors([]);

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      setErrors(error.errors);
      if (error?.errors?.[0]?.longMessage) {
		    console.log(error)
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    setErrors([]);

    try {
      const signupAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signupAttempt.status === "complete") {
        await setActive({ session: signupAttempt.createdSessionId });

        // Create profile after user is fully verified and session is active
        if (signupAttempt.createdUserId) {
          await DatabaseService.createProfile(signupAttempt.createdUserId);
        }
        router.replace("/(tabs)");
      } else {
        console.log(JSON.stringify(signupAttempt, null, 2));
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      setErrors(error.errors);
      if (error?.errors?.[0]?.longMessage) {
		    console.log(error)
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <BodyScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          value={code}
          label={`Enter the verification code we sent to ${email}`}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <Button
          onPress={onVerifyPress}
          disabled={!code || isLoading}
          loading={isLoading}
        >
          Verify
        </Button>
      </BodyScrollView>
    );
  }

  return (
    <BodyScrollView contentContainerStyle={{ padding: 10, flex: 1 }}>
      <View
        style={{
          paddingVertical: 60,
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text
          style={{
            justifyContent: "center",
            alignItems: "center",
            fontSize: 20,
            fontWeight: "bold",
            letterSpacing: 10,
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
            textAlign: "center",
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
          onChangeText={setPassword}
          placeholder="Password"
          autoCapitalize="none"
          keyboardType="visible-password"
        />
        <Button
          onPress={handleSignup}
          loading={isLoading}
          disabled={ !email || !password}
        >
          Sign up
        </Button>
      </View>
    </BodyScrollView>
  );
}
