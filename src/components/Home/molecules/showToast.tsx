import Toast from "react-native-root-toast";

const showToast = (text: any, color: any) => {
  let backgroundColor, textColor;

  if (color === "Green") {
    backgroundColor = "#EDF9EB";
    textColor = "#008631";
  } else {
    backgroundColor = "#FFE0DF";
    textColor = "#C30010";
  }

  Toast.show(text, {
    duration: Toast.durations.LONG,
    position: Toast.positions.TOP,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: backgroundColor,
    textColor: textColor,
    shadowColor: "#BBBBBB",
    opacity: 1,
    containerStyle: {
      borderRadius: 50,
      padding: 10,
      borderColor: textColor,
      borderWidth: 1,
      top: 20,
    },
  });
};

export default showToast;
