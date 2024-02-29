import { Image, TouchableOpacity, Linking } from "react-native";


const ScreenHeaderBtn = ({ iconUrl }) => {

  const openLink = () => {
    const googleUrl = 'https://codeforces.com/profile/wasif1607';
    Linking.openURL(googleUrl);
  };

  return (
    <TouchableOpacity onPress={openLink}>
      <Image
        source={iconUrl}
        resizeMode='cover'
      />
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;