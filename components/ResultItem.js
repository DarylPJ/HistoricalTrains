import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function ResultItem(props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: 25 }]}>
        {props.startStationName} {"->"} {props.endStationName}
      </Text>
      <Text style={styles.text}>{GetDetail(props.startStation)}</Text>
      <Text style={styles.text}>{GetDetail(props.endStation)}</Text>
    </View>
  );
}

function GetDetail(stationInfo) {
  let detail = "";
  if (stationInfo.timetabledDeparture) {
    detail += `Timetabled Departure: ${stationInfo.timetabledDeparture}\n`;
  }

  if (stationInfo.timetabledArrival) {
    detail += `Timetabled Arrival: ${stationInfo.timetabledArrival}\n`;
  }

  if (stationInfo.actualDeparture) {
    detail += `Actual Departure: ${stationInfo.actualDeparture}\n`;
  }

  if (stationInfo.actualArrival) {
    detail += `Actual Arrival: ${stationInfo.actualArrival}\n`;
  }

  if (stationInfo.delayReason) {
    detail += `Delay Reason: ${stationInfo.delayReason}\n`;
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
    fontSize: 15,
  },
});
