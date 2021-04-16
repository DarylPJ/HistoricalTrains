import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Dimensions,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import ResultItem from "../components/ResultItem";

export default class ResultsScreen extends Component {
  state = {};

  constructor(props) {
    super(props);

    this.state.startStation = props?.route?.params?.startStation;
    this.state.endStation = props?.route?.params?.endStation;
    this.state.stationCodes = props?.route?.params?.stationCodes;

    if (props?.route?.params?.time) {
      this.state.time = props.route.params.time;
    }
  }

  async componentDidMount() {
    const startTime = new Date(this.state.time);

    if (startTime.getHours() === 0 && startTime.getMinutes() <= 15) {
      startTime.setMinutes(0);
    }

    if (startTime.getHours() === 23 && startTime.getMinutes() >= 30) {
      startTime.setMinutes(30);
    }

    const endTime = new Date(startTime);

    if (endTime.getHours() === 23 && endTime.getMinutes() >= 30) {
      endTime.setMinutes(59);
    } else {
      endTime.setMinutes(endTime.getMinutes() + 30);
    }

    const url = `https://historical-train-api.herokuapp.com/HistoricalData?startDate=${this.formatDate(
      startTime
    )}&endDate=${this.formatDate(endTime)}&startLocation=${
      this.state.startStation
    }&endLocation=${this.state.endStation}`;

    console.log(url);

    let rawData;
    try {
      rawData = await fetch(url);
    } catch {
      Alert.alert(
        "Error fetching tations",
        "Ensure you are connected to the internet and try again."
      );
    }

    const data = await rawData.json();

    this.setState({
      startTime: startTime,
      endTme: endTime,
      data: data,
    });
  }

  formatDate(date) {
    return `${date.getFullYear()}-${this.padDate(
      date.getMonth() + 1
    )}-${this.padDate(date.getDate())} ${this.padDate(
      date.getHours()
    )}:${this.padDate(date.getMinutes())}:00`;
  }

  padDate(numberToPad) {
    if (numberToPad < 10) {
      return "0" + numberToPad;
    }

    return numberToPad;
  }

  render() {
    if (this.state.data) {
      if (this.state.data.length === 0) {
        return (
          <View style={[styles.container]}>
            <Text style={styles.text}>
              No direct train services found between{" "}
              {
                this.state.stationCodes.find(
                  (j) => j.id === this.state.startStation
                ).name
              }{" "}
              and{" "}
              {
                this.state.stationCodes.find(
                  (j) => j.id === this.state.endStation
                ).name
              }{" "}
              on {this.state.time.toString().slice(0, 24)}
            </Text>
          </View>
        );
      }

      let key = 0;
      var results = this.state.data.map((i) => {
        key++;

        const a = this.state.stationCodes;

        return (
          <ResultItem
            key={key}
            destination={
              this.state.stationCodes.find(
                (j) => j.id === i.destinationLocation
              ).name
            }
            origin={
              this.state.stationCodes.find((j) => j.id === i.originLocation)
                .name
            }
            startStation={i.locationData[this.state.startStation]}
            startStationName={
              this.state.stationCodes.find(
                (j) => j.id === this.state.startStation
              ).name
            }
            endStation={i.locationData[this.state.endStation]}
            endStationName={
              this.state.stationCodes.find(
                (j) => j.id === this.state.endStation
              ).name
            }
          ></ResultItem>
        );
      });

      return (
        <View style={styles.container}>
          <ScrollView>{results}</ScrollView>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://www.nationalrail.co.uk/")}
          >
            <Image
              style={styles.logo}
              source={require("../assets/NRE_Powered_logo.png")}
            ></Image>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="white"></ActivityIndicator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "black",
    alignItems: "stretch",
  },
  text: {
    color: "white",
    fontSize: 15,
  },
  logo: {
    width: Dimensions.get("window").width,
    height: 150,
    resizeMode: "contain",
  },
});
