import express from "express";
import cartRoutes from "./routes/cart.routes.js"
import productsRoutes from "./routes/products.routes.js"

const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', productsRoutes)
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);

app.listen((PORT), () => {
    console.log(`Server running on port http://localhost:${PORT}`);
})
