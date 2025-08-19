import { router } from "expo-router";
import { useState, useContext } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("http://192.168.1.108:4000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      if (!res.ok) {
        if (res.status === 401) {
          setErrorMessage("E-mail and/or password are incorrect.");
        } else {
          setErrorMessage(data.message || "Error on login.");
        }
        return;
      }

      if (!data.token) {
        setErrorMessage("Invalid response from server.");
      }

      console.log("Token loaded from backend:", data.token);
      console.log("Backend answer:", data);
      await login(data.token, data.user);

      router.replace("/");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-4xl font-extrabold text-primary tracking-wide mb-2 text-center ">
        {" "}
        Welcome to CasaCheia!
      </Text>
      <Text className="text-5xl text-primary text-center mb-8">🏠</Text>
      <Text className="text-3xl font-semibold mb-6 text-center text-primary">
        {" "}
        Enter in your account to continue{" "}
      </Text>
      <TextInput
        placeholder="E-mail"
        className="border border-gray-300 w-full rounded-xl px-4 py-3 mb-4"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="border border-gray-300 w-full rounded-xl px-4 py-3 mb-6"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-500 w-full py-3 rounded-2xl active:opacity-80 shadow-md"
      >
        <Text className="text-2xl text-white text-center items-center justify-center font-bold">
          {" "}
          Login
        </Text>
      </TouchableOpacity>

      {errorMessage ? (
        <Text className="text-red-500 text-center mt-4"> {errorMessage}</Text>
      ) : null}

      <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
        <Text className="text-blue-600 font-medium text-center mb-3">
          {" "}
          Don't have an account yet? Sign up!
        </Text>
      </TouchableOpacity>
    </View>
  );
}
