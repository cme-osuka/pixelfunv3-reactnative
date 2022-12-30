import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { io } from "socket.io-client";

let socket;

function Box(props) {
  function changeColor() {
    socket.emit("update", {
      color: props.selectedColor,
      position: {
        x: props.x,
        y: props.y,
      },
    });
  }

  return (
    <Pressable
      onPress={changeColor}
      style={{
        backgroundColor: props.color,
        width: 18,
        height: 18,
        margin: 1,
      }}
    />
  );
}

export default function App() {
  const [grid, setGrid] = useState(null);
  const [color, setColor] = useState("#cc00cc");

  useEffect(() => {
    socket = io("https://pixelfunv4.osuka.dev/");

    socket.on("connect", () => {
      socket.emit("ready");
    });

    socket.on("initial_state", (data) => {
      setGrid(data);
    });

    socket.on("updated_state", (data) => {
      console.log("updated state");
      setGrid(data);
    });
  }, []);

  if (!grid)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );

    console.log(grid);

  return (
    <View style={styles.container}>
      {grid.map((y, yPos) => {
          return (
            <View key={yPos} style={{ display: "flex", flexDirection: "row" }}>
              {y.map((x, xPos) => {
                return (
                  <Box
                    key={x.id}
                    color={x.color}
                    x={xPos}
                    y={yPos}
                    selectedColor={color}
                  />
                );
              })}
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
