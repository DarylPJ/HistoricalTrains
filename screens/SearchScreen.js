import React, { Component } from "react";
import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import SearchableDropdown from "react-native-searchable-dropdown";

export default class SearchScreen extends Component {
  state = {};

  async componentDidMount() {
    var stations = await fetch(
      "https://historical-train-api.herokuapp.com/StationCodes"
    );

    const stationData = await stations.json();
    const station = Object.keys(stationData).map((i) => ({
      id: stationData[i],
      name: i,
    }));

    this.setState({
      stations: station,
    });
  }

  render() {
    if (!this.state.stations) {
      return (
        <View style={[styles.container, { justifyContent: "center" }]}>
          <ActivityIndicator size="large" color="white"></ActivityIndicator>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Historic Train Times</Text>
        </View>
        <View>
          <SearchableDropdown
            style={{ innerWidth: 1000 }}
            onItemSelect={(item) => {}}
            containerStyle={{ padding: 5 }}
            onRemoveItem={(item, index) => {}}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: "black",
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{ color: "white" }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={this.state.stations}
            resetValue={false}
            textInputProps={{
              placeholder: "Start",
              style: {
                padding: 12,
                borderWidth: 1,
                backgroundColor: "gray",
                fontSize: 20,
                fontWeight: "bold",
                borderRadius: 5,
                color: "red",
              },
              onTextChange: (text) => alert(text),
            }}
            listProps={{
              nestedScrollEnabled: true,
            }}
          />
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
  },
  header: {
    color: "white",
    fontSize: 40,
  },
});
