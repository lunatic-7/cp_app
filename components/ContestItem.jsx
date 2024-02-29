import React from 'react';
import { View, Text } from 'react-native';

const ContestItem = ({ item }) => {

    const rateChange = (newRating, oldRating) => {
        if (newRating - oldRating > 0) {
            return <Text className="text-green-500">   (+{newRating - oldRating})</Text>;
        } else if (newRating - oldRating < 0) {
            return <Text className="text-red-500">   ({newRating - oldRating})</Text>;
        } else {
            return <Text>   ({newRating - oldRating})</Text>;
        }
    }

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

    return (
        <View className="mb-5 border-2 border-gray-200 p-3 rounded-xl">
            <Text className="text-lg font-bold mb-3">{item.contestName}</Text>
            <Text className="text-gray-500">Contest ID: <Text className="text-gray-700">{item.contestId}</Text></Text>
            <Text className="text-gray-500">When: <Text className="text-gray-700">{formatTime(item.ratingUpdateTimeSeconds)}</Text></Text>
            <Text className="text-gray-500">Rank: <Text className="text-gray-700">{item.rank}</Text></Text>
            <Text className="text-gray-500">Rating Change: <Text className="text-gray-700">{item.oldRating} → {item.newRating} {rateChange(item.newRating, item.oldRating)}</Text></Text>
        </View>
    );
};

export default ContestItem;
