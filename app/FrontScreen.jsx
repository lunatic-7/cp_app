import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from '../constants';


const FrontScreen = ({ setDefaultHandle }) => {
    const [inputHandle, setInputHandle] = useState('');
    const [storedHandle, setStoredHandle] = useState(null);

    const router = useRouter();


    useEffect(() => {
        // Load stored handle from AsyncStorage on component mount
        loadStoredHandle();
    }, []);

    const loadStoredHandle = async () => {
        try {
            const handle = await AsyncStorage.getItem('storedHandle');
            if (handle !== null) {
                setStoredHandle(handle);
            }
        } catch (error) {
            console.error('Error loading stored handle:', error);
        }
    };

    const saveHandle = async () => {
        try {
            // Save the new handle to AsyncStorage
            await AsyncStorage.setItem('storedHandle', inputHandle);

            // Update the displayed handle
            setStoredHandle(inputHandle);

            // Clear the input field
            setInputHandle('');
            setDefaultHandle(inputHandle)
            //   router.push({ pathname: "Welcome", params: { handle: inputHandle } })
        } catch (error) {
            console.error('Error saving handle:', error);
        }
    };

    const clearStorage = async () => {
        try {
            // Clear the stored handle from AsyncStorage
            await AsyncStorage.removeItem('storedHandle');

            // Update the displayed handle
            setStoredHandle(null);
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    const accessHandle = () => {
        // Implement the logic to access the stored handle (e.g., navigate to another screen)
        if (storedHandle) {
            setDefaultHandle(storedHandle)
            console.log('Accessing handle:', storedHandle);
        } else {
            console.log('No stored handle found.');
        }
    };

    return (
        <View className="flex-1 p-4 justify-center">
            {/* <Text className="text-2xl font-bold mb-3 text-center">Enter Codeforces Handle</Text> */}
            <Image
                source={icons.cp_wall}
                resizeMode='contain'
                className="w-80 h-60 ml-5"
            />
            <Text className="text-center italic text-slate-500 mb-3">- Every FALL is a chance to RISE</Text>
            <View className="p-5">
                <View className="flex flex-row mb-5">
                    <TextInput
                        placeholder="Enter your CF handle"
                        value={inputHandle}
                        onChangeText={(text) => setInputHandle(text)}
                        className="border-b-2 border-slate-500 flex-1"
                    />
                    <TouchableOpacity onPress={saveHandle} className="ml-3 p-2 px-3 border-2 border-gray-300 rounded-xl bg-slate-50">
                        <Text >Search</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex flex-row items-center gap-2">
                    <TouchableOpacity onPress={accessHandle} className="p-2 px-3 border-2 border-slate-300 rounded-xl justify-center items-center">
                        <Text className="text-slate-700">{storedHandle || 'No handle stored'}</Text>
                    </TouchableOpacity>
                    {storedHandle &&
                        <TouchableOpacity onPress={clearStorage}>
                            <Image
                                source={icons.deleteIcon}
                                resizeMode='cover'
                            />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View>
    );
};

export default FrontScreen;
