import { SafeAreaView, ScrollView, View, Text } from "react-native";
import axios from 'axios';
import { useState, useEffect } from 'react'


import Welcome from "../Welcome";
import Contests from "../Contests";
import SubmissionsScreen from "../SubmissionsScreen";
import SearchComponent from "../../components/SearchComponent.jsx";
import FrontScreen from "../FrontScreen.jsx";
import ThemeToggle from "../../components/ThemeToggle.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";

const Codeforces = () => {
  const { colors } = useTheme();

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
    if (!userInfo) return 'text-black';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ height: 64, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <ThemeToggle />
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>Codeforces</Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>{userInfo ? `${userInfo.handle} · ${userInfo.rank}` : "Profile & contests"}</Text>
        </View>
      </View>

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

export default Codeforces;
