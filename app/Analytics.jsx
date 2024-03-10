import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import moment from 'moment';
import {
    LineChart,
    ProgressChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const Analytics = () => {

    const [submissions, setSubmissions] = useState(null);
    const [avgSub, setAvgSub] = useState(-1)
    const [maxSub, setMaxSub] = useState(-1)
    const [minSub, setMinSub] = useState(-1)
    const [bbarData, setBbarData] = useState(null)
    const [pgData, setPgData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const params = useLocalSearchParams();
    const { sub_handle } = params;


    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(
                    `https://codeforces.com/api/user.status?handle=${sub_handle}&from=1&count=350`
                );

                if (response.data.status === 'OK') {
                    setSubmissions(response.data.result);
                    setIsLoading(false);
                } else {
                    console.error('Failed to fetch submissions');
                }
            } catch (error) {
                console.error('Error fetching submissions', error);
            }
        };

        fetchSubmissions();
    }, [sub_handle]);

    // Function to format a timestamp to a specific date
    const formatDate = (timestamp) => {
        const date = moment.unix(timestamp);
        return date.format('D MMM');
    };

    // Step 1: Extract relevant information and filter submissions with "OK" verdict
    if (submissions && !bbarData) {

        // Step 1: Extract relevant information and filter submissions with "OK" verdict
        const filteredSubmissions = submissions
            .filter(submission => submission.verdict === 'OK')
            .filter(submission => {
                const submissionDate = moment.unix(submission.creationTimeSeconds);
                const today = moment().endOf('day');
                const sevenDaysAgo = moment().subtract(6, 'days').startOf('day');
                return submissionDate.isBetween(sevenDaysAgo, today, 'day', '[]'); // '[]' includes both endpoints
            })
            .map(submission => ({
                date: formatDate(submission.creationTimeSeconds),
                id: submission.id,
            }));

        // Step 2: Group submissions by date
        const groupedSubmissions = {};
        filteredSubmissions.forEach(submission => {
            if (!groupedSubmissions[submission.date]) {
                groupedSubmissions[submission.date] = [];
            }
            groupedSubmissions[submission.date].push(submission);
        });

        // Step 3: Create an array of all dates within the range
        const allDates = [];
        for (let i = 6; i >= 0; i--) {
            const date = moment().subtract(i, 'days').format('D MMM');
            allDates.push(date);
        }

        // Step 4: Count the number of submissions with "OK" verdict for each date
        const barData = allDates.map(date => groupedSubmissions[date]?.length || 0);

        // Step 5: Calculate the average number of "OK" verdict submissions
        const totalSubmissions = filteredSubmissions.length;
        const averageSubmissions = (totalSubmissions / 7).toFixed(2);
        const minSubmissions = Math.min(...barData);
        const maxSubmissions = Math.max(...barData);

        setAvgSub(averageSubmissions)
        setMinSub(minSubmissions)
        setMaxSub(maxSubmissions)

        // Step 5: Reverse the barData array to start from today
        const reversedBarData = barData.reverse();
        const reversedAllDates = allDates.reverse();

        // Step 6: Create the desired format for your bar graph
        const data = {
            labels: reversedAllDates,
            datasets: [
                {
                    data: reversedBarData,
                }
            ],
            // legend: ["Accepted submissions (7 Days)"] // optional
        };

        setBbarData(data);
    }

    if (submissions && !pgData) {
        // Function to get submissions for a specific verdict and within the last 7 days
        const getSubmissionsForVerdictAndLast7Days = (verdict, submissions) => {
            const today = moment().endOf('day');
            const sevenDaysAgo = moment().subtract(7, 'days').startOf('day');

            return submissions.filter(submission => (
                submission.verdict === verdict &&
                moment.unix(submission.creationTimeSeconds).isBetween(sevenDaysAgo, today, 'day', '[]')
            ));
        };

        // Verdicts and their abbreviated labels and colors
        const verdicts = [
            { full: "WRONG_ANSWER", abbreviated: "WA", color: "#F44336" }, // Red
            { full: "TIME_LIMIT_EXCEEDED", abbreviated: "TLE", color: "#FFC107" }, // Yellow
            { full: "OK", abbreviated: "OK", color: "#4CAF50" }, // Green
        ];

        // Get submissions for each verdict within the last 7 days
        const submissionsForVerdicts = verdicts.map(verdict => ({
            verdict: verdict.full,
            abbreviatedVerdict: verdict.abbreviated,
            color: verdict.color,
            count: getSubmissionsForVerdictAndLast7Days(verdict.full, submissions).length,
        }));

        // Calculate percentages
        const totalSubmissions = submissionsForVerdicts.reduce((total, submission) => total + submission.count, 0);
        const percentages = submissionsForVerdicts.map(submission => ({
            abbreviatedVerdict: submission.abbreviatedVerdict,
            percentage: totalSubmissions === 0 ? 0 : (submission.count / totalSubmissions),
            color: submission.color,
        }));

        // Prepare the data for the progress chart
        const data = {
            labels: percentages.map(submission => submission.abbreviatedVerdict),
            data: percentages.map(submission => submission.percentage),
            color: percentages.map(submission => submission.color),
        };

        setPgData(data);
    }

    const chartConfig = {
        // backgroundGradientFrom: "#000",
        backgroundGradientFromOpacity: 0,
        // backgroundGradientTo: "#222",
        backgroundGradientToOpacity: 0.1,
        color: (opacity = 1) => `rgba(34, 100, 34, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#AFE1AF',
        },
        strokeWidth: 2, // optional, default 3
        decimalPlaces: 2, // optional, defaults to 2dp
        useShadowColorFromDataset: false // optional
    };

    const chartConfig2 = {
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(10, 50, 23, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#AFE1AF',
        },
        strokeWidth: 2, // optional, default 3
        decimalPlaces: 0, // optional, defaults to 2dp
        useShadowColorFromDataset: false // optional
    };

    // each value represents a goal ring in Progress chart
    const ringData = {
        labels: ["Swim", "Bike", "Run"], // optional
        data: [0.4, 0.6, 0.8]
    };

    return (
        <View className="flex-1 p-3">
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: "#E5F2F0" },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Text className="font-semibold pt-2 text-xl text-gray-700">7D Analysis 🧐</Text>
                    ),
                    headerTitle: "",
                }}
            />

            {!isLoading ? (
                <View>
                    <Text className="text-xl font-semibold text-gray-700 my-5 mt-7">✅ Submissions Analysis</Text>
                    <View className="flex flex-row justify-between">
                        <Text>Min: <Text className="text-lg font-bold text-red-500">{minSub}</Text></Text>
                        <Text>Avg: <Text className="text-lg font-bold text-orange-500">{avgSub}</Text></Text>
                        <Text>Max: <Text className="text-lg font-bold text-green-500">{maxSub}</Text></Text>
                    </View>
                    <LineChart
                        data={bbarData}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                        fromZero={true}
                        bezier
                        style={{
                            marginVertical: 8,
                            marginRight: 21,
                        }}
                    />
                    <Text className="text-xl font-semibold text-gray-700 my-5 mt-7">🏹 Accuracy Analysis</Text>
                    <ProgressChart
                        data={pgData}
                        width={screenWidth}
                        height={240}
                        strokeWidth={18}
                        radius={36}
                        chartConfig={chartConfig2}
                        hideLegend={false}
                    />
                </View>
            ) : (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                </View>
            )}

            <Text className="text-gray-500 text-center mt-[15%]">These are last 7 days ✔ submissions and accuracy analysis for the user: {sub_handle}</Text>

        </View>
    )
}

export default Analytics