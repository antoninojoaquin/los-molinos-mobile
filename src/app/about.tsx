import { ScrollView } from "react-native";
import ContactSection from "../components/ContactSection";
import UbicationSection from "../components/UbicationSection";
import { useRef, useCallback } from "react";
import { useFocusEffect } from "expo-router";

export default function AboutScreen() {
   const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return (
    <ScrollView ref={scrollRef} style={{flex: 1, backgroundColor: "#030712"}}>
      <UbicationSection />
      <ContactSection />
    </ScrollView>
  );
}