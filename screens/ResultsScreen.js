import React, { Component } from "react";
import { Text, View } from "react-native";

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
    const endTime = new Date(this.state.time);
    endTime.setMinutes(endTime.getMinutes() + 30);

    const url = `https://historical-train-api.herokuapp.com/HistoricalData?startDate=${this.formatDate(
      startTime
    )}&endDate=${this.formatDate(endTime)}&startLocation=${
      this.state.startStation
    }&endLocation=${this.state.endStation}`;

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
      return <Text>{JSON.stringify(this.state.data)}</Text>;
    }

    return <View></View>;
  }
}
