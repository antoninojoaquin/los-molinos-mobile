import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";

import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../../assets/images/heroexample-2.webp")}
      style={styles.bg}
      blurRadius={3}
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>
          Bienvenido a{"\n"}Los <Text style={styles.orange}>Molinos</Text>
          {"\n"}Regionales
        </Text>

        <Text style={styles.subtitle}>
          Venta de accesorios para tu{" "}
          <Text style={styles.orange}>parrilla</Text>
          {"\n"}en Dolores y la zona
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/products")}
        >
          <Ionicons name="arrow-forward-circle" size={28} color="#fff" />
          <Text style={styles.btnText}>Explorar Productos</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  content: {
    zIndex: 10,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    lineHeight: 44,
    marginBottom: 16,
  },
  orange: {
    color: "#f97316",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 32,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f97316",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  }
});
