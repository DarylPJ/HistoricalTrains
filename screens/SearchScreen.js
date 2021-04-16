import React, { Component } from "react";
import {
  ActivityIndicator,
  Text,
  Button,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.navigation = props.navigation;
  }

  state = {};

  async componentDidMount() {
    let stations;
    try {
      stations = await fetch(
        "https://historical-train-api.herokuapp.com/StationCodes"
      );
    } catch {
      Alert.alert(
        "Error fetching tations",
        "Ensure you are connected to the internet and try again."
      );
    }

    const stationData = await stations.json();
    const station = Object.keys(stationData).map((i) => ({
      id: i,
      name: stationData[i],
      search: stationData[i].split(" ").map((i) => i.toLowerCase()),
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

  handleDatePress = () => {
    this.setState({ showDate: true });
  };

  handleDateSelection = (event, selectedDate) => {
    if (!selectedDate) {
      this.setState({
        showDate: false,
      });
      return;
    }

    this.setState({
      selectedDate: selectedDate,
      showTime: true,
      showDate: false,
    });
  };

  handleTimeSelection = (event, selectedTime) => {
    const date = this.state.selectedDate;
    if (selectedTime) {
      date.setHours(selectedTime.getHours());
      date.setMinutes(selectedTime.getMinutes());
    } else {
      date.setHours(0);
      date.setMinutes(0);
    }

    date.setSeconds(0);
    this.setState({ selectedDateTime: date, showTime: false });
  };

  handleSearch = () => {
    const isStartValid =
      this.state.stations.find((i) => i.id === this.state.startStation) !==
      undefined;

    const isEndValid =
      this.state.stations.find((i) => i.id === this.state.endStation) !==
      undefined;
    const istimeValid = this.state.selectedDateTime !== undefined;

    let errorMessage = "";
    if (!isStartValid) {
      errorMessage += "Select a Start Station.\n";
    }

    if (!isEndValid) {
      errorMessage += "Select an End Station.\n";
    }

    if (!istimeValid) {
      errorMessage += "Select a Date.";
    }

    if (errorMessage !== "") {
      Alert.alert("Validation Error", errorMessage);
      return;
    }

    this.navigation.navigate("Results", {
      startStation: this.state.startStation,
      endStation: this.state.endStation,
      time: this.state.selectedDateTime.toString(),
      stationCodes: this.state.stations,
    });
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
      const splitSearch = this.state.startSearch
        .split(" ")
        .map((i) => i.toLowerCase());

      startStations = this.state.stations
        .filter((i) =>
          splitSearch.every((j) => i.search.some((k) => k.startsWith(j)))
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
      const splitSearch = this.state.endSearch
        .split(" ")
        .map((i) => i.toLowerCase());

      endStations = this.state.stations
        .filter((i) =>
          splitSearch.every((j) => i.search.some((k) => k.startsWith(j)))
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

    let dateTimePicker = <View></View>;

    if (this.state.showDate) {
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() - 1);

      const minDate = new Date();
      minDate.setMonth(minDate.getMonth() - 12);

      dateTimePicker = (
        <DateTimePicker
          maximumDate={maxDate}
          minimumDate={minDate}
          value={maxDate}
          mode={"date"}
          onChange={this.handleDateSelection}
        ></DateTimePicker>
      );
    }

    if (this.state.showTime) {
      dateTimePicker = (
        <DateTimePicker
          value={new Date()}
          mode={"time"}
          onChange={this.handleTimeSelection}
        ></DateTimePicker>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Past Train Times</Text>
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
        <Text
          style={[styles.textInput, { marginBottom: 5 }]}
          onPress={() => this.handleDatePress()}
        >
          {this.state.selectedDateTime?.toString().slice(0, 24) ?? "Date"}
        </Text>
        <Button title="Find Trains" onPress={this.handleSearch}></Button>
        {dateTimePicker}
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
    backgroundColor: "white",
    borderRadius: 5,
    height: 40,
  },
  stationScroll: {
    maxHeight: 150,
    marginBottom: 5,
  },
});
