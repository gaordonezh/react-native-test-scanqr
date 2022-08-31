import { useEffect, useState } from "react";
import { Button, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function TabOneScreen({ navigation }: RootTabScreenProps<"TabOne">) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCode = ({ type, data }: any) => {
    setScanned(true);
    setText(data);
    console.log(type, data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>REQUESTING FOR CAMERA PERMISSION</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CAMERA PERMISSION WAS DENIED</Text>
        <Button title="Allow Camera" onPress={askForCameraPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCode}
          style={{ height: 400, width: 400 }}
        />

        <Text style={styles.maintext}>{text}</Text>

        {scanned && <Button title="Scan again" onPress={() => setScanned(false)} color="tomato" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: "auto",
    width: 227,
    overflow: "hidden",
    borderRadius: 30,
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
});
