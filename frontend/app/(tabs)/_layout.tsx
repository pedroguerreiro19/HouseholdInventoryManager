import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import  React from "react";
import { Tabs } from "expo-router";

const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#fffffff',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    height: 70,
                    position: 'absolute',
                    shadowColor: '#000',
                    shadowOpacity: 0.05,
                    shadowOffset: { width: 0, height: -3},
                    shadowRadius: 10,
                    elevation: 10,
                },
                tabBarActiveTintColor: '#00796b', 
                tabBarInactiveTintColor: '#b0bec5',
                tabBarLabelStyle: {
                    fontSize: 12,
                    paddingBottom: 4,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{ 
                    headerShown: false,
                    title: "Home",
                    tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> 
                }}
            />
            <Tabs.Screen
                name="familygroup"
                options={{ 
                    headerShown: false,
                    title: "My Family Group",
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-group" size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="account"
                options={{ 
                    headerShown: false,
                    title: "My Account",
                    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle" size={24} color={color} />
                }}
            />
        </Tabs>
    )
}

export default _Layout;