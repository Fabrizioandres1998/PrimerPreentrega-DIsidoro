import { Router } from "express";
import fs from "fs";

const router = Router();

const cart = JSON.parse(fs.readFileSync('./data/cart.json', 'utf-8'));
const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

router.post('/', (req, res) => {
    const newId = cart[cart.length - 1].id + 1;
    const newCart = {
        id: newId,
        products: []
    };

    cart.push(newCart);
    fs.writeFileSync('./data/cart.json', JSON.stringify(cart, null, '\t'));
    res.json(cart);
});

router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const findCart = cart.find(cart => cart.id == cid);
    if (!findCart) {
        res.status(400).json(`No se encuentra el carrito con el id solicitado`);
    } else {
        res.json(findCart);
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const findCart = cart.find(cart => cart.id == cid); 
    const product = products.find(product => product.id == pid);
    const cartExists = findCart?.products.find(product => product.product == pid);

    if (!findCart) {
        res.status(400).json(`No se encuentra el carrito con el id solicitado`);
    } else if (!product) {
        res.status(400).json(`No se encuentra el producto con el id solicitado`);
    } else {
        if (cartExists) {
            cartExists.quantity += 1;
        } else {
            findCart.products.push({ product: product.id, quantity: 1 });
        }
        fs.writeFileSync('./data/cart.json', JSON.stringify(cart, null, '\t'));
        res.json(findCart);
    }
});

router.delete('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const findCart = cart.find(cart => cart.id == cid);
    
    if (!findCart) {
        return res.status(400).json(`No se encuentra el carrito con el id solicitado`);
    }

    const productIndex = findCart.products.findIndex(product => product.product == pid);
    
    if (productIndex === -1) {
        return res.status(400).json(`No se encuentra el producto con el id solicitado`);
    }

    findCart.products.splice(productIndex, 1);
    fs.writeFileSync('./data/cart.json', JSON.stringify(cart, null, '\t'));
    res.json(findCart);
});

export default router;
