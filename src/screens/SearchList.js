@@ .. @@
   const renderItem = ({ item }) => {
     const itemInCart = productList.find((i) => i._id === item._id);
   }
-    const totalQty = itemInCart?.volume?.reduce((acc, vol) => acc + vol?.quantity, 0);
+    const totalQty = itemInCart?.volume?.reduce((acc, vol) => acc + (vol?.quantity || 0), 0) || 0;
 
@@ .. @@
         <View style={styles.productInfo}>
           <Text style={styles.productName}>{item.name}</Text>
           <Text style={styles.productPrice}>
-            Rs. {item?.salePrice !== 0 ? item?.salePrice : item?.regularPrice}
+            Rs. {item?.salePrice !== 0 ? item?.salePrice : (item?.regularPrice || item?.price || 0)}
           </Text>
         </View>