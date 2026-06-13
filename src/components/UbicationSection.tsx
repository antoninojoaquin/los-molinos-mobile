import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";

const MAPS_URL = "https://www.google.com/maps/place/Arist%C3%B3bulo+del+Valle+178,+B7100+Dolores,+Provincia+de+Buenos+Aires/@-36.3166699,-57.6791062,15.5z/data=!4m6!3m5!1s0x95999e42c33ed273:0x59b33785e775e2f8!8m2!3d-36.3172659!4d-57.6767455!16s%2Fg%2F11rg691ghs?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"

const MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5406.603341935121!2d-57.68058441618891!3d-36.317506178602855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95999e42c33ed273%3A0x59b33785e775e2f8!2sArist%C3%B3bulo%20del%20Valle%20178%2C%20B7100%20Dolores%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1766184914228!5m2!1ses!2sar"

export default function UbicationScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>DÓNDE ESTAMOS</Text>
      <Text style={styles.title}>Dolores, Buenos Aires</Text>
      <Text style={styles.description}>
        Nuestro punto de encuentro con la cultura del asado.
        Pasá, conocenos y llevate lo que hace falta para prender el fuego.
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => Linking.openURL(MAPS_URL)}
      >
        <Text style={styles.btnText}>Cómo llegar</Text>
      </TouchableOpacity>

      <View style={styles.mapContainer}>
        <WebView source={{ uri: MAPS_EMBED }} style={styles.map}/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712"
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  label: {
    color: "#f97316",
    fontWeight: "600",
    letterSpacing: 1.5,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 48,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    color: "#9ca3af",
    fontSize: 16,
    lineHeight: 26,
    maxWidth: 360,
  },
  btn: {
    alignSelf: "flex-start",
    marginTop: 24,
    backgroundColor: "f97316",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
  },
  btnText: {
    color: "fff",
    fontWeight: "600",
    fontSize: 15,
  },
  mapContainer: {
    marginTop: 32,
    height: 320,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  map: { flex: 1 }
});