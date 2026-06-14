import { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { storage } from "../hooks/useStorage";
import Ionicons from "@expo/vector-icons/Ionicons";
import LottieView from "lottie-react-native";

const FAVORITES_KEY = "favorites";
const CART_KEY = "cart";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
};

export default function FavoritesScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [cooldownId, setCooldownId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      storage.get<string[]>(FAVORITES_KEY).then((val) => setFavorites(val ?? []));
      storage.get<any[]>(CART_KEY).then((val) => setCart(val ?? []));
      const fetchProducts = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "products"));
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Product[];
          setProducts(data);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }, [])
  );

  const addToCart = async (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    const updatedCart = existing
      ? cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      : [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    await storage.set(CART_KEY, updatedCart);
  };

  const toggleFavorite = async (productId: string) => {
    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];
    setFavorites(updatedFavorites);
    await storage.set(FAVORITES_KEY, updatedFavorites);
  };

  const displayedProducts = products.filter((p) => favorites.includes(p.id));

  if (loading) {
    return (
      <View style={styles.centered}>
        <LottieView
          source={require("../../assets/loading.json")}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
          colorFilters={[{ keypath: "*", color: "#f97316" }]}
        />
      </View>
    );
  }
  if (displayedProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="heart-dislike-outline" size={86} color="#f97316" />
        <Text style={styles.emptyText}>No tenés nada en favoritos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={StyleSheet.absoluteFill} />
            <View style={styles.overlay} />
            <TouchableOpacity
              style={styles.heartBtn}
              onPress={() => toggleFavorite(item.id)}
            >
              <Ionicons
                name={favorites.includes(item.id) ? "heart" : "heart-outline"}
                size={22}
                color={favorites.includes(item.id) ? "#f97316" : "#fff"}
              />
            </TouchableOpacity>
            {item.stock > 0 && item.stock <= 3 && (
              <View style={styles.stockBadge}>
                <Text style={styles.stockBadgeText}>¡Quedan {item.stock}!</Text>
              </View>
            )}
            <View style={styles.cardBottom}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>${item.price}</Text>
                <TouchableOpacity
                  disabled={cooldownId === item.id || item.stock === 0}
                  style={[
                    styles.cartBtn,
                    (cooldownId === item.id || item.stock === 0) && styles.cartBtnDisabled,
                  ]}
                  onPress={() => {
                    addToCart(item);
                    setCooldownId(item.id);
                    setTimeout(() => setCooldownId(null), 2000);
                  }}
                >
                  <Text style={styles.cartBtnText}>
                    {item.stock === 0 ? "Sin stock" : cooldownId === item.id ? "✓" : "Agregar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030712" },
  centered: { flex: 1, backgroundColor: "#030712", justifyContent: "center", alignItems: "center" },
  emptyIcon: { fontSize: 64, marginBottom: 12 },
  emptyText: { color: "rgba(255,255,255,0.4)", fontSize: 24, fontWeight: "600" },
  list: { padding: 12, marginTop: 64, paddingBottom: 86 },
  row: { justifyContent: "space-between", marginBottom: 12 },
  card: { width: "48%", height: 220, borderRadius: 20, overflow: "hidden", backgroundColor: "#1f2937" },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.45)" },
  heartBtn: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 20, padding: 6 },
  cardBottom: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 10 },
  category: { color: "#fdba74", fontSize: 10, textTransform: "uppercase", marginBottom: 2 },
  name: { color: "#fff", fontWeight: "bold", fontSize: 13, marginBottom: 6 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { color: "#fff", backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, fontSize: 13 },
  cartBtn: { backgroundColor: "#f97316", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  cartBtnDisabled: { backgroundColor: "#6b7280" },
  cartBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  stockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 10,
  },
  stockBadgeText: {
    color: "#ffb84d",
    fontSize: 10,
    fontWeight: "700",
  },
});