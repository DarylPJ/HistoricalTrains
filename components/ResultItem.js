import React from "react";
import { Text, StyleSheet } from "react-native";

export default function ResultItem(props) {
  const a = props;

  return (
    <Text style={styles.text}>
      {props.data.originLocation} {"->"} {props.data.destinationLocation}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    color: "white",
  },
});
