import { Image } from "expo-image";

export const CachedImage = (props) => {
  const { uri, style } = props;

  const imageSource = uri
    ? { uri }
    : require("../../assets/images/notFoundDrinkImage.png");

  return <Image source={imageSource} style={style} {...props} />;
};
