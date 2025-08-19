import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    if (password != confirmPassword) {
      Alert.alert("Error", "The password don't coincide.");
    }

    try {
      const res = await fetch("http://localhost:4000/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error creating account");

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
      }

      Alert.alert("Account created!", "Please login.");

      router.replace("/login");
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-white">
      <Text className="text-3xl font-extrabold text-primary mb-2 text-center">
        Create your {"\n"} CasaCheia account!
      </Text>

      <Text className="text-5xl mb-2">🏠</Text>
      <TextInput
        placeholder="Name"
        className="border border-gray-300 w-full rounded-xl px-4 py-3 mb-4"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="E-mail"
        className="border border-gray-300 w-full rounded-xl px-4 py-3 mb-4"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        className="border border-gray-300 w-full rounded-xl px-4 py-3 mb-4"
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        className="border border-gray-300 w-full rounded-xl px-4 py-3 mb-4"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        onPress={handleSignUp}
        className="bg-primary w-full py-3 rounded-2xl shadow-md mb-3 items-center justify-center"
      >
        <Text className="text-white text-base font-semibold">
          Create account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
        <Text className="text-primary text-sm font-medium">
          {" "}
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
