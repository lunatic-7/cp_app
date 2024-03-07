// SubmissionsScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

const SubmissionsScreen = () => {
    const [submissions, setSubmissions] = useState(null);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('today');
    const [items, setItems] = useState([
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Yesterday - 1', value: 'dayBeforeYesterday' },
    ]);

    const params = useLocalSearchParams();
    const { handle } = params;

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(
                    `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=150`
                );

                if (response.data.status === 'OK') {
                    setSubmissions(response.data.result);
                } else {
                    console.error('Failed to fetch submissions');
                }
            } catch (error) {
                console.error('Error fetching submissions', error);
            }
        };

        fetchSubmissions();
    }, [handle]);

    const getProblemLink = (contestId, index) => {
        return `https://codeforces.com/problemset/problem/${contestId}/${index}`;
    };

    const getFilteredSubmissions = () => {
        const today = new Date().toLocaleDateString();
        const yesterday = new Date(Date.now() - 864e5).toLocaleDateString();
        const dayBeforeYesterday = new Date(Date.now() - 2 * 864e5).toLocaleDateString();

        switch (value) {
            case 'today':
                return submissions.filter((submission) => new Date(submission.creationTimeSeconds * 1000).toLocaleDateString() === today);
            case 'yesterday':
                return submissions.filter((submission) => new Date(submission.creationTimeSeconds * 1000).toLocaleDateString() === yesterday);
            case 'dayBeforeYesterday':
                return submissions.filter((submission) => new Date(submission.creationTimeSeconds * 1000).toLocaleDateString() === dayBeforeYesterday);
            default:
                return [];
        }
    };

    const countVerdicts = () => {
        const todaySubmissions = getFilteredSubmissions();
        const verdictCounts = {
            OK: 0,
            TIME_LIMIT_EXCEEDED: 0,
            WRONG_ANSWER: 0,
        };

        todaySubmissions.forEach((submission) => {
            verdictCounts[submission.verdict] += 1;
        });

        return verdictCounts;
    };

    const getVerdictColor = (verdict) => {
        switch (verdict) {
            case 'OK':
                return 'text-green-700';
            case 'WRONG_ANSWER':
                return 'text-red-600';
            case 'TIME_LIMIT_EXCEEDED':
                return 'text-orange-500';
            default:
                return 'black'; // You can set a default color
        }
    };

    const getVerdictBgColor = (verdict) => {
        switch (verdict) {
            case 'OK':
                return 'bg-green-100';
            case 'WRONG_ANSWER':
                return 'bg-red-100';
            case 'TIME_LIMIT_EXCEEDED':
                return 'bg-orange-100';
            default:
                return 'bg-white'; // You can set a default color
        }
    };

    const formatTime = (timeSeconds) => {
        const now = Math.floor(Date.now() / 1000);
        const elapsedSeconds = now - timeSeconds;

        if (elapsedSeconds < 60) {
            // return 'online';
            const secs = Math.floor(elapsedSeconds);
            return `${secs} seconds ago`;
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

    return (
        <View className="flex-1 p-4">
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: "#E5F2F0" },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Text className="font-semibold pt-2 text-xl text-gray-700">Submissions ✍🏻</Text>
                    ),
                    // headerRight: () => (
                    //     // <ScreenHeaderBtn iconUrl={icons.cf_icon} />
                    // ),
                    headerTitle: "",
                }}
            />
            {submissions ? (
                <View>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder={'Today'}
                        className="w-32 self-end my-3 bg-gray-100"
                    />
                    <View className="flex flex-row justify-between items-center p-2">
                        <Text>Submissions: <Text className="text-lg">{getFilteredSubmissions().length}</Text></Text>
                        <Text className={` ${getVerdictColor("OK")}`}>AC: <Text className="text-lg">{countVerdicts().OK}</Text></Text>
                        <Text className={` ${getVerdictColor("TIME_LIMIT_EXCEEDED")}`}>TLE: <Text className="text-lg">{countVerdicts().TIME_LIMIT_EXCEEDED}</Text></Text>
                        <Text className={` ${getVerdictColor("WRONG_ANSWER")}`}>WA: <Text className="text-lg">{countVerdicts().WRONG_ANSWER}</Text></Text>
                    </View>
                    <FlatList
                        data={getFilteredSubmissions()}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        className="mb-24"
                        renderItem={({ item }) => (
                            <View className={`${getVerdictBgColor(item.verdict)} mb-4 border border-gray-200 p-4 rounded-xl`}>
                                <View className="flex flex-row justify-between">
                                    <View className="flex flex-row items-center gap-2">
                                        <Text className="font-semibold text-md text-">{item.problem.name}</Text>
                                        <Text
                                            className="text-blue-500 underline mt-2"
                                            onPress={() => Linking.openURL(getProblemLink(item.problem.contestId, item.problem.index))}
                                        >
                                            {item.problem.contestId + item.problem.index}
                                        </Text>
                                    </View>
                                    <Text className={` ${getVerdictColor(item.verdict)}`}>{item.verdict}</Text>
                                </View>
                                <Text className="text-gray-500">Rating: <Text className="text-gray-800 font-semibold">{item.problem.rating}</Text></Text>
                                <Text className="text-gray-500">When: <Text className="text-gray-700">{formatTime(item.creationTimeSeconds)}</Text></Text>
                                <View className="mt-2 flex-row items-center">
                                    <Text className="mr-2 font-bold">Tags:</Text>
                                    <FlatList
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        data={item.problem.tags}
                                        keyExtractor={(tag) => tag}
                                        renderItem={({ item: tag }) => (
                                            <View className="mr-2 p-1 border border-gray-300 rounded-lg">
                                                <Text>{tag}</Text>
                                            </View>
                                        )}
                                    />
                                </View>
                                {/* Add more information as needed */}
                            </View>
                        )}
                    />
                </View>
            ) : (
                <ActivityIndicator className="flex-1 justify-center items-center" size="large" />
            )}
        </View>
    );
};

export default SubmissionsScreen;
