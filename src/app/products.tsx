import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
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
};

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [cooldownId, setCooldownId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(data);
      } catch (error) {
        console.error("Error al traer productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      storage.get<string[]>(FAVORITES_KEY).then((val) => setFavorites(val ?? []));
      storage.get<any[]>(CART_KEY).then((val) => setCart(val ?? []));
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

  const categories = [...new Set(products.map((p) => p.category))];

  const displayedProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => !selectedCategory || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

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

  return (
    <View style={styles.container}>
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos..."
              placeholderTextColor="#4b5563"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
            <TouchableOpacity
              style={[styles.chip, !selectedCategory && styles.chipActive]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>
                Todos
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, selectedCategory === cat && styles.chipActive]}
                onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              >
                <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Ordenar por precio:</Text>
            <TouchableOpacity
              style={[styles.sortBtn, sortOrder === "asc" && styles.sortBtnActive]}
              onPress={() => setSortOrder(sortOrder === "asc" ? null : "asc")}
            >
              <Text style={[styles.sortBtnText, sortOrder === "asc" && styles.sortBtnTextActive]}>
                Menor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortBtn, sortOrder === "desc" && styles.sortBtnActive]}
              onPress={() => setSortOrder(sortOrder === "desc" ? null : "desc")}
            >
              <Text style={[styles.sortBtnText, sortOrder === "desc" && styles.sortBtnTextActive]}>
                Mayor
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      <FlatList
        data={displayedProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
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

            <View style={styles.cardBottom}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.name}>{item.name}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>${item.price}</Text>

                <TouchableOpacity
                  disabled={cooldownId === item.id}
                  style={[
                    styles.cartBtn,
                    cooldownId === item.id && styles.cartBtnDisabled,
                  ]}
                  onPress={() => {
                    addToCart(item);
                    setCooldownId(item.id);
                    setTimeout(() => setCooldownId(null), 2000);
                  }}
                >
                  <Text style={styles.cartBtnText}>
                    {cooldownId === item.id ? "✓" : "Agregar"}
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#030712" },
  list: { padding: 12, paddingBottom: 86 },
  row: { justifyContent: "space-between", marginBottom: 12 },
  card: {
    width: "48%",
    height: 220,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1f2937",
  },
  image: { ...StyleSheet.absoluteFill, width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.45)" },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
  cardBottom: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 10 },
  category: { color: "#fdba74", fontSize: 10, textTransform: "uppercase", marginBottom: 2 },
  name: { color: "#fff", fontWeight: "bold", fontSize: 13, marginBottom: 6 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: {
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 13,
  },
  cartBtn: {
    backgroundColor: "#f97316",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cartBtnDisabled: { backgroundColor: "#6b7280" },
  cartBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  header: { paddingHorizontal: 12, paddingTop: 64, paddingBottom: 8, gap: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f2937",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 15 },
  categories: { flexDirection: "row" },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#1f2937",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  chipActive: { backgroundColor: "#f97316", borderColor: "#f97316" },
  chipText: { color: "#9ca3af", fontSize: 13 },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  sortRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sortLabel: { color: "#6b7280", fontSize: 13, flex: 1 },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
  },
  sortBtnActive: { backgroundColor: "#f97316", borderColor: "#f97316" },
  sortBtnText: { color: "#9ca3af", fontSize: 13 },
  sortBtnTextActive: { color: "#fff", fontWeight: "600" },
},
);