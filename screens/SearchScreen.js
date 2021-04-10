import React, { Component } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";

export default class SearchScreen extends Component {
  state = {};

  async componentDidMount() {
    var stations = await fetch(
      "https://historical-train-api.herokuapp.com/StationCodes"
    );

    const stationData = await stations.json();
    const station = Object.keys(stationData).map((i) => ({
      id: i,
      name: stationData[i],
    }));

    this.setState({
      stations: station,
    });
  }

  updateStartSearch = (startSearch) => {
    this.setState({ startSearch, startStation: "" });
  };

  handleStartStationPress = (id) => {
    this.setState({ startStation: id, startSearch: "" });
    Keyboard.dismiss();
  };

  updateEndSearch = (endSearch) => {
    this.setState({ endSearch, endStation: "" });
  };

  handleEndStationPress = (id) => {
    this.setState({ endStation: id, endSearch: "" });
    Keyboard.dismiss();
  };

  render() {
    if (!this.state.stations) {
      return (
        <View style={[styles.container, { justifyContent: "center" }]}>
          <ActivityIndicator size="large" color="white"></ActivityIndicator>
        </View>
      );
    }

    let startStations = [];

    if (this.state.startSearch) {
      startStations = this.state.stations
        .filter((i) =>
          i.name.toLowerCase().startsWith(this.state.startSearch.toLowerCase())
        )
        .map((i) => (
          <Text
            key={i.id}
            style={styles.textDropdown}
            onPress={() => this.handleStartStationPress(i.id)}
          >
            {i.name}
          </Text>
        ));
    }

    let endStations = [];
    if (this.state.endSearch) {
      endStations = this.state.stations
        .filter((i) =>
          i.name.toLowerCase().startsWith(this.state.endSearch.toLowerCase())
        )
        .map((i) => (
          <Text
            key={i.id}
            style={styles.textDropdown}
            onPress={() => this.handleEndStationPress(i.id)}
          >
            {i.name}
          </Text>
        ));
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Historic Train Times</Text>
        </View>
        <TextInput
          style={styles.textInput}
          placeholderTextColor="black"
          backgroundColor="white"
          placeholder="Start"
          onChangeText={this.updateStartSearch}
          value={
            this.state.startSearch ||
            this.state.stations.find((i) => i.id === this.state.startStation)
              ?.name
          }
        ></TextInput>
        <View>
          <ScrollView
            style={styles.stationScroll}
            keyboardShouldPersistTaps="always"
          >
            {startStations}
          </ScrollView>
        </View>
        <TextInput
          style={styles.textInput}
          placeholderTextColor="black"
          backgroundColor="white"
          placeholder="End"
          onChangeText={this.updateEndSearch}
          value={
            this.state.endSearch ||
            this.state.stations.find((i) => i.id === this.state.endStation)
              ?.name
          }
        ></TextInput>
        <View>
          <ScrollView
            style={styles.stationScroll}
            keyboardShouldPersistTaps="always"
          >
            {endStations}
          </ScrollView>
        </View>
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
  headerContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  textDropdown: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "black",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    color: "white",
  },
  header: {
    color: "white",
    fontSize: 40,
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    backgroundColor: "gray",
    borderRadius: 5,
    height: 40,
  },
  stationScroll: {
    maxHeight: 150,
    marginBottom: 5,
  },
});
