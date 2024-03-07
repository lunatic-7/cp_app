// SearchComponent.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { icons } from '../constants';

const SearchComponent = ({ onSearch }) => {
  const [handle, setHandle] = useState('');

  const handleSearch = () => {
    onSearch(handle);
  };

  return (

    <View className="mx-2">
      <TextInput
        placeholder="Enter a valid Codeforces handle"
        value={handle}
        onChangeText={(text) => setHandle(text)}
        autoCapitalize='none'
        autoCorrect={false}
        className="border-b-2 border-gray-300 p-2 rounded-md relative"
      />
      <TouchableOpacity onPress={handleSearch} className="absolute right-1 top-2">
        <Image source={icons.search}/>
      </TouchableOpacity>
    </View>
  );
};

export default SearchComponent;
