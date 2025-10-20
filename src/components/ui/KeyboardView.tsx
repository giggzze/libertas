import { forwardRef } from "react";
import { KeyboardAvoidingView, KeyboardAvoidingViewProps, Platform } from "react-native";

export const KeyboardView = forwardRef<any, KeyboardAvoidingViewProps>((props, ref) => {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            {...props}
            ref={ref}
        />
    );
});
