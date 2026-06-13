import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons"

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

const [enviado, setEnviado] = useState(false);

const handleSubmit = async () => {
  const res = await fetch("https://formspree.io/f/xbdlygko", {
    method: "POST",
    headers: { "Content-Type": "aplicattion/json" },
    body: JSON.stringify(formData),
  });


  if (res.ok) {
    setEnviado(true);
    setFormData({ nombre: "", email: "", mensaje: "" });
  } else {
    alert("Hubo un error al enviar el mensaje.");
  }
};

if (enviado) {
  return (
    <View style={styles.successContainer}>
      <Ionicons name="checkmark-circle" size={12} color="#22c55e" />
      <Text style={styles.successTitle}>¡Mensaje enviado!</Text>
      <Text style={styles.successText}>
        Gracias por escribirnos. Nos pondremos en contacto con vos a la brevedad.
      </Text>
      <TouchableOpacity
        onPress={() => {
          setEnviado(false);
          setFormData({ nombre: "", email: "", mensaje: "" });
        }}
      >
        <Text style={styles.resendText}>Enviar otro mensaje</Text>
      </TouchableOpacity>
    </View>
  );
}

return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <View style={styles.container}>
      <Text style={styles.label}>HABLEMOS</Text>
      <Text style={styles.title}>¿Tenés alguna duda?</Text>
      <Text style={styles.description}>
        Ya sea que busques un accesorio específico para tu parrilla, quieras
        consultar precios mayoristas o simplemente saludarnos. Estamos para
        asesorarte en lo que necesites.
      </Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            placeholder="Ingresá tu nombre..."
            placeholderTextColor={"#4b5563"}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email de contacto</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Ingresá tu correo..."
            placeholderTextColor={"#4b5563"}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Tu mensaje</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={formData.mensaje}
            onChangeText={(text) => setFormData({ ...formData, mensaje: text })}
            placeholder="Ingresá tu mensaje..."
            placeholderTextColor={"#4b5563"}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Enviar Mensaje</Text>
        </TouchableOpacity>
      </View>
    </View>
  </KeyboardAvoidingView>
);
}
const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 96 },
  label: {
    color: "#f97316",
    fontWeight: "600",
    letterSpacing: 1.5,
    fontSize: 13,
    marginBottom: 8,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    color: "#9ca3af",
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 32,
  },
  form: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 20,
    padding: 24,
    gap: 20,
  },
  field: { gap: 8 },
  fieldLabel: { color: "#9ca3af", fontSize: 13, fontWeight: "500" },
  input: {
    backgroundColor: "#030712",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 15,
  },
  textarea: { height: 110, textAlignVertical: "top" },
  btn: {
    backgroundColor: "#f97316",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  successContainer: {
    padding: 40,
    alignItems: "center",
    gap: 16,
  },
  successTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  successText: {
    color: "#9ca3af",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  resendText: {
    color: "#f97316",
    fontWeight: "600",
    fontSize: 15,
    marginTop: 8,
  },
});