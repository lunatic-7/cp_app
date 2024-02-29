// Contest.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

import ContestItem from '../components/ContestItem';

const Contest = ({ handle }) => {
  const [contestData, setContestData] = useState(null);

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const response = await axios.get(
          `https://codeforces.com/api/user.rating?handle=${handle}`
        );

        if (response.data.status === 'OK') {
          setContestData(response.data.result.reverse());
        } else {
          console.error('Failed to fetch contest data');
        }
      } catch (error) {
        console.error('Error fetching contest data', error);
      }
    };

    fetchContestData();
  }, [handle]);

  const calculateAverageRatingChange = () => {
    if (!contestData) {
      return 0;
    }

    const totalRatingChange = contestData.reduce(
      (sum, item) => sum + (item.newRating - item.oldRating),
      0
    );

    return totalRatingChange / contestData.length;
  };

  const renderContestItem = ({ item }) => <ContestItem item={item} />;

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-semibold mb-4">Contest History</Text>
      {contestData && (
        <View>
          <View className="flex flex-row justify-between items-center">
            <Text>Total: {contestData.length}</Text>
            <Text className={`${calculateAverageRatingChange > 0 ? "text-red-600" : "text-green-600"}`}>
              ARC: {calculateAverageRatingChange().toFixed(2)}
            </Text>
          </View>
          <FlatList
            data={contestData}
            keyExtractor={(item) => item.contestId.toString()}
            renderItem={renderContestItem}
          />
        </View>
      )}
    </View>
  );
};

export default Contest;
