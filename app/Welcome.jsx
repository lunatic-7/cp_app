import { View, Text, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import { icons } from '../constants';
import { Stack, useRouter } from 'expo-router';

const Welcome = ({ userInfo, getRankColor, isLoading }) => {
  const router = useRouter();
  const formatTime = (timeSeconds) => {
    const now = Math.floor(Date.now() / 1000);
    const elapsedSeconds = now - timeSeconds;

    if (elapsedSeconds < 60) {
      return 'online';
    } else if (elapsedSeconds < 3600) {
      const mins = Math.floor(elapsedSeconds / 60);
      return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
    } else if (elapsedSeconds < 86400) {
      const hours = Math.floor(elapsedSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (elapsedSeconds < 2592000) {
      const days = Math.floor(elapsedSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (elapsedSeconds < 31536000) {
      const months = Math.floor(elapsedSeconds / 2592000);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(elapsedSeconds / 31536000);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  };

  const openLink = () => {
    const googleUrl = 'https://github.com/lunatic-7/Cp';
    Linking.openURL(googleUrl);
  };


  return (
    <View className='flex-1 bg-white my-10'>
      {userInfo ? (
        <View className="flex flex-row justify-around">
          {/* Left box */}
          <View>
            <Image
              source={{ uri: userInfo.titlePhoto }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text className={`${getRankColor()} text-xl my-2 underline`}>{userInfo.firstName} {userInfo.lastName}</Text>
            <Text className="text-md text-gray-500">Rating: <Text className={`${getRankColor()}`}>{userInfo.rating}</Text></Text>
            {userInfo.handle === "wasif1607" && (
              <TouchableOpacity onPress={openLink} className="my-2">
                <Image
                  source={icons.github}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => router.push({ pathname: "SubmissionsScreen", params: { handle: userInfo.handle } })}>
              <Text className="text-cyan-500 font-semibold py-2">Submissions ✍🏻</Text>
            </TouchableOpacity>
          </View>
          {/* Right box */}
          <View className="w-[55%] flex flex-col justify-center gap-1">
            <Text className="text-lg text-gray-500">Username: <Text className="text-gray-700">{userInfo.handle}</Text></Text>
            <Text className="text-md text-gray-500">Country: <Text className="text-gray-700">{userInfo.country}</Text></Text>
            <Text className="text-md text-gray-500">City: <Text className="text-gray-700">{userInfo.city}</Text></Text>
            <Text className="text-md text-gray-500">Friends Count: <Text className="text-gray-700">{userInfo.friendOfCount}</Text></Text>
            <Text className="text-md text-gray-500">Contribution: <Text className="text-gray-700">{userInfo.contribution}</Text></Text>
            <Text className="text-md text-gray-500">Organization: <Text className="text-gray-700">{userInfo.organization}</Text></Text>
            <Text className="text-md text-gray-500">Last seen: <Text className="text-gray-700">{formatTime(userInfo.lastOnlineTimeSeconds)}</Text></Text>
            <Text className="text-md text-gray-500">Max Rating: <Text className="text-gray-700">{userInfo.maxRating}</Text></Text>
            <Text className="text-md text-gray-500">Max Rank: <Text className="text-gray-700">{userInfo.maxRank}</Text></Text>
            <Text className="text-md text-gray-500">Registered: <Text className="text-gray-700">{formatTime(userInfo.registrationTimeSeconds)}</Text></Text>
          </View>
        </View>
      ) : isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View>
          <Image source={icons.bhai_kya} resizeMode="contain" className="w-80 ml-10"/>
          <Text className="text-gray-500 text-center text-sm">- Enter a valid CF Handle</Text>
        </View>
      )}

    </View>
  )
}

export default Welcome