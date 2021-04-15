import React, { Component } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import ResultItem from "../components/ResultItem";

export default class ResultsScreen extends Component {
  state = {};

  constructor(props) {
    super(props);

    this.state.startStation = props?.route?.params?.startStation;
    this.state.endStation = props?.route?.params?.endStation;

    if (props?.route?.params?.time) {
      this.state.time = props.route.params.time;
    }
  }

  async componentDidMount() {
    const startTime = new Date(this.state.time);
    startTime.setMinutes(startTime.getMinutes() - 15);
    const endTime = new Date(this.state.time);
    endTime.setMinutes(endTime.getMinutes() + 15);

    const url = `https://historical-train-api.herokuapp.com/HistoricalData?startDate=${this.formatDate(
      startTime
    )}&endDate=${this.formatDate(endTime)}&startLocation=${
      this.state.startStation
    }&endLocation=${this.state.endStation}`;

    console.log(url);
    const rawData = await fetch(url);
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
      let key = 0;
      return this.state.data.map((i) => {
        key++;
        return <ResultItem key={key} data={i}></ResultItem>;
      });
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
    paddingTop: 40,
    flex: 1,
    backgroundColor: "black",
    alignItems: "stretch",
  },
});
