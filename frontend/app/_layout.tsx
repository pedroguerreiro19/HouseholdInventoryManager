import { Router, Slot, Redirect } from "expo-router";
import { useContext } from "react";
import { Text } from "react-native";
import { AuthProvider, AuthContext } from "../contexts/AuthContext";
import "../app/global.css";
import { usePathname } from "expo-router";


function RootLayoutInner() {
  const { userToken, isLoading} = useContext(AuthContext);
  const pathname = usePathname();

  if (isLoading) {
    return (
      <Text className="text-3xl font-semibold mb-6 text-center text-primary"> Loading...</Text>
    );
      
  }

  if (!userToken && pathname !== "/login" && pathname !== "/signup") {
    return <Redirect href="/(auth)/login"/> ;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}