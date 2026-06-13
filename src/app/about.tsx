import { View, Text, ScrollView } from "react-native";
import ContactSection from "../components/ContactSection";
import UbicationSection from "../components/UbicationSection";

export default function AboutScreen() {
  return (
    <ScrollView style={{flex: 1, backgroundColor: "#030712"}}>
      <UbicationSection />
      <ContactSection />
    </ScrollView>
  );
}