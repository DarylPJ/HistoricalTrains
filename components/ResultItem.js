import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function ResultItem(props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: 20 }]}>
        {props.origin} {"->"} {props.destination}
      </Text>
      <Text style={styles.text}>{GetDetail(props.startStation)}</Text>
      <Text style={styles.text}>{JSON.stringify(props.endStation)}</Text>
    </View>
  );
}

function GetDetail(stationInfo) {
  let detail = "";
  if (stationInfo.timetabledDeparture) {
    detail += `Timetabled Departure: ${stationInfo.timetabledDeparture}`;
  }

  return detail;
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
  },
  text: {
    color: "white",
    marginBottom: 5,
  },
});
