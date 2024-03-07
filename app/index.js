import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { icons } from "../constants";
import axios from 'axios';
import { useState, useEffect } from 'react'


import Welcome from "./Welcome";
import Contests from "./Contests";
import SubmissionsScreen from "./SubmissionsScreen";
import ScreenHeaderBtn from "../components/ScreenHeaderBtn.jsx";
import SearchComponent from "../components/SearchComponent.jsx";
import FrontScreen from "./FrontScreen.jsx";

const Home = () => {

  const [userInfo, setUserInfo] = useState(null);
  const [defaultHandle, setDefaultHandle] = useState("bokka777");
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData(defaultHandle);
  }, [defaultHandle]);

  const fetchData = async (handle) => {
    if (defaultHandle !== "bokka777") {
      try {
        const response = await axios.get(
          `https://codeforces.com/api/user.info?handles=${handle}&checkHistoricHandles=false`
        );

        if (response.data.status === 'OK') {
          setUserInfo(response.data.result[0]);
          setIsLoading(false);
        } else {
          console.error('Failed to fetch user info');
          setUserInfo(null);
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching user info', error);
        setUserInfo(null);
        setIsLoading(false)
      }
    }
  };

  const handleSearch = (newHandle) => {
    setDefaultHandle(newHandle);
  };


  const getRankColor = () => {
    switch (userInfo.rank) {
      case 'newbie':
        return 'text-gray-500 font-bold text-lg';
      case 'pupil':
        return 'text-green-500 font-bold text-lg';
      case 'specialist':
        return 'text-cyan-600 font-bold text-lg';
      case 'expert':
        return 'text-blue-500 font-bold text-lg';
      case 'candidate master':
        return 'text-violet-500 font-bold text-lg';
      case 'master':
        return 'text-orange-500 font-bold text-lg';
      case 'international master':
        return 'text-orange-700 font-bold text-lg';
      case 'grandmaster':
        return 'text-red-400 font-bold text-lg';
      case 'international grandmaster':
        return 'text-red-600 font-bold text-lg';
      case 'legendary grandmaster':
        return 'text-red-900 font-bold text-lg';
      default:
        return 'text-black'; // Default color
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#E5F2F0" },
          headerShadowVisible: false,
          headerLeft: () => (
            userInfo && <Text className={getRankColor()}>{userInfo.rank}</Text>
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.cf_icon} defaultHandle={defaultHandle} />
          ),
          headerTitle: "",
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {defaultHandle !== "bokka777" ? (
            <View>
              <Welcome userInfo={userInfo} getRankColor={getRankColor} isLoading={isLoading} />
              <SearchComponent onSearch={handleSearch} setDefaultHandle={setDefaultHandle} />
              <Contests handle={defaultHandle} />
            </View>
          ) : (
            <FrontScreen setDefaultHandle={setDefaultHandle} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home