import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
} from "react-native";
import { storage } from "../hooks/useStorage";
import Ionicons from "@expo/vector-icons/Ionicons";

const CART_KEY = "cart";

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
};

export default function CartScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      storage.get<CartItem[]>(CART_KEY).then((val) => setCart(val ?? []));
    }, [])
  );

  const updateCart = async (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    await storage.set(CART_KEY, updatedCart);
  };

  const increaseQty = (id: string) => {
    updateCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
        : item
    ));
  };

  const decreaseQty = (id: string) => {
    updateCart(
      cart
        .map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item)
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    updateCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    const productList = cart.map(item => `• ${item.name} x${item.quantity}`).join("\n");
    const message = "¡Hola! estoy interesado en:\n${productList}\n\nPrecio total: $${total}\n¿Podemos coordinar los detalles?";
    const phone = "542245502977"

    const whatsappUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    const webUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    const supported = await Linking.canOpenURL(whatsappUrl);

    if (supported) {
      Linking.openURL(whatsappUrl);
    } else {
      Linking.openURL(webUrl);
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="cart-outline" size={86} color="#f97316" />
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>

            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => decreaseQty(item.id)}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, item.quantity >= item.stock && styles.qtyBtnDisabled]}
                disabled={item.quantity >= item.stock}
                onPress={() => increaseQty(item.id)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.right}>
              <Text style={styles.subtotal}>${item.price * item.quantity}</Text>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Ionicons name="trash-outline" size={24} color="#f97316" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>${total}</Text>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Continuar por WhatsApp</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030712" },
  centered: { flex: 1, backgroundColor: "#030712", justifyContent: "center", alignItems: "center" },
  emptyIcon: { fontSize: 64, marginBottom: 12 },
  emptyText: { color: "rgba(255,255,255,0.4)", fontSize: 24, fontWeight: "600" },
  list: { padding: 16, gap: 12, marginTop: 64, paddingBottom: 86 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  image: { width: 72, height: 72, borderRadius: 8 },
  info: { flex: 1 },
  name: { color: "#e5e7eb", fontSize: 13, fontWeight: "500", marginBottom: 4 },
  price: { color: "#9ca3af", fontSize: 13 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: { backgroundColor: "#374151", borderRadius: 20, width: 28, height: 28, justifyContent: "center", alignItems: "center" },
  qtyBtnText: { color: "#fff", fontSize: 16, lineHeight: 20 },
  qty: { color: "#fff", fontWeight: "600", minWidth: 20, textAlign: "center" },
  right: { alignItems: "center", gap: 6 },
  subtotal: { color: "#fff", fontWeight: "600", fontSize: 15 },
  trash: { fontSize: 18 },
  footer: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  totalLabel: { color: "#9ca3af", marginBottom: 4 },
  total: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  checkoutBtn: { backgroundColor: "#f97316", borderRadius: 12, padding: 16, alignItems: "center" },
  checkoutText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  qtyBtnDisabled: { backgroundColor: "#1f2937", opacity: 0.4 },
});
