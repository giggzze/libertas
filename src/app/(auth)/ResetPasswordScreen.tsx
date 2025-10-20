import * as React from "react";
import { useRouter } from "expo-router";
import { ThemedText } from "@/src/components/themed-text";
import { BodyScrollView } from "@/src/components/ui/BodyScrollView";
import Button from "@/src/components/ui/Button";
import TextInput from "@/src/components/ui/TextInput";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import { Text, View } from "react-native";

/**
 * ResetPasswordScreen is the screen for users to reset their password.
 *
 * - Renders a form with email and password fields.
 * - Handles password reset using Clerk's `useSignIn` hook.
 * - On successful password reset, sets the active session and redirects to the home page.
 */
export default function ResetPassword() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);

  const onResetPasswordPress = React.useCallback(async () => {
    if (!isLoaded) return;
    setErrors([]);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });

      setPendingVerification(true);
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, signIn]);

  const onVerifyPress = React.useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, code, password, signIn, setActive, router]);

  if (pendingVerification) {
    return (
      <BodyScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          value={code}
          label={`Enter the verification code we sent to ${emailAddress}`}
          placeholder="Enter your verification code"
          onChangeText={setCode}
        />
        <TextInput
          value={password}
          label="Enter your new password"
          placeholder="Enter your new password"
          secureTextEntry
          onChangeText={setPassword}
        />
        {errors.map((error) => (
          <ThemedText key={error.longMessage} style={{ color: "red" }}>
            {error.longMessage}
          </ThemedText>
        ))}
        <Button onPress={onVerifyPress} disabled={!code || !password}>
          Reset password
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
          value={emailAddress}
          onChangeText={setEmailAddress}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Button onPress={onResetPasswordPress} disabled={!emailAddress}>
          Continue
        </Button>
      </View>
    </BodyScrollView>
  );
}
