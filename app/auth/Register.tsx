import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading, error } = useAuthStore();
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Get theme colors
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");
  const isDark = colorScheme === "dark";

	const handleRegister = async () => {
    // Add password confirmation validation
    if (password !== confirmPassword) {
      // You would need to add a way to show this error
      console.error("Passwords do not match");
      return;
    }
    
    await register(email, password);
    // If registration is successful, Zustand will update user state
  };

	return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <View
        style={[
          styles.backgroundContainer,
          { backgroundColor: backgroundColor },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.container}>
            <View
              style={[styles.formCard, { backgroundColor: backgroundColor }]}
            >
              <Text style={[styles.title, { color: textColor }]}>
                Create Account
              </Text>
              <Text style={[styles.subtitle, { color: iconColor }]}>
                Sign up to start managing your finances
              </Text>

              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark ? "#2d3748" : "#f8fafc",
                    borderColor: isDark ? "#4a5568" : "#e2e8f0",
                  },
                ]}
              >
                <View style={styles.inputIconContainer}>
                  <IconSymbol name="envelope" size={20} color={iconColor} />
                </View>
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Email Address"
                  placeholderTextColor={iconColor}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark ? "#2d3748" : "#f8fafc",
                    borderColor: isDark ? "#4a5568" : "#e2e8f0",
                  },
                ]}
              >
                <View style={styles.inputIconContainer}>
                  <IconSymbol name="lock" size={20} color={iconColor} />
                </View>
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Password"
                  placeholderTextColor={iconColor}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <IconSymbol
                    name={showPassword ? "eye.slash" : "eye"}
                    size={20}
                    color={iconColor}
                  />
                </TouchableOpacity>
              </View>
              
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark ? "#2d3748" : "#f8fafc",
                    borderColor: isDark ? "#4a5568" : "#e2e8f0",
                  },
                ]}
              >
                <View style={styles.inputIconContainer}>
                  <IconSymbol name="lock.shield" size={20} color={iconColor} />
                </View>
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Confirm Password"
                  placeholderTextColor={iconColor}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <IconSymbol
                    name={showConfirmPassword ? "eye.slash" : "eye"}
                    size={20}
                    color={iconColor}
                  />
                </TouchableOpacity>
              </View>

              {error && (
                <View style={styles.errorContainer}>
                  <IconSymbol
                    name="exclamationmark.triangle"
                    size={18}
                    color="#ef4444"
                  />
                  <Text style={styles.error}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: tintColor },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    color={isDark ? "#000" : "#fff"}
                    size="small"
                  />
                ) : (
                  <View style={styles.buttonContent}>
                    <Text
                      style={[
                        styles.buttonText,
                        { color: isDark ? "#000" : "#fff" },
                      ]}
                    >
                      Create Account
                    </Text>
                    <IconSymbol
                      name="arrow.right"
                      size={18}
                      color={isDark ? "#000" : "#fff"}
                    />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: isDark ? "#4a5568" : "#e2e8f0" },
                  ]}
                />
                <Text style={[styles.dividerText, { color: iconColor }]}>
                  OR
                </Text>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: isDark ? "#4a5568" : "#e2e8f0" },
                  ]}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  {
                    backgroundColor: isDark ? "#2d3748" : "#f8fafc",
                    borderColor: isDark ? "#4a5568" : "#e2e8f0",
                  },
                ]}
                onPress={() => router.replace("/auth/Login")}
              >
                <Text style={[styles.loginButtonText, { color: textColor }]}>
                  Sign In to Existing Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: "100%",
  },
  formCard: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    position: "relative",
  },
  inputIconContainer: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 12,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: "100%",
  },
  error: {
    color: "#ef4444",
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  button: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
  },
  loginButton: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  loginButtonText: {
    fontWeight: "500",
    fontSize: 16,
  },
});
