require('dotenv').config()
const { db } = require('./firebase.js')

const express = require('express')
const cors = require('cors')

const mercadopago = require('mercadopago')
const PORT = process.env.PORT || 3001

const app = express()

// Agrega credenciales
mercadopago.configure({
  access_token: process.env.MERCADO_LIBRE_API_KEY
})

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

app.use(cors(corsOptions)) // Use this after the variable declaration

// Retrieve all products
app.get('/api', async (req, res) => {
  try {
    const itemsCollection = db.collection('products')
    const productsRequest = await itemsCollection.get()
    const products = productsRequest.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    res.status(200).send(products)
  } catch (err) {
    console.error(err)
    res.status(500).send()
  }
})

// Retrieve all products from a given category
app.get('/api/:category', async (req, res) => {
  const { category } = req.params
  if (!category) {
    return res.sendStatus(404)
  }

  const itemsListRef = db.collection('products')
  const snapshot = await itemsListRef
    .where('category', '==', category)
    .get()

  if (snapshot.empty) {
    return res.status(404).send('bad request')
  } else {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    res.status(200).send(products)
  }
})

// Retrieve a single product given the id of it
app.get('/api/product/:productId', async (req, res) => {
  const { productId } = req.params
  if (!productId) {
    return res.sendStatus(404)
  }

  const productRef = db
    .collection('products')
    .doc(productId)
  const doc = await productRef.get()

  if (!doc.exists) {
    return res.status(404).send('not such product!')
  } else {
    return res.status(200).send(doc.data())
  }
})

app.use(express.json())

// Create a preference
app.post('/api/createPreference', async (req, res) => {
  const body = req.body

  let preference = {
    items: [],
    init_point: 'modal',
    back_urls: {
      success: 'http://localhost:3000/success'
    }
  }

  // await db.collection('orders').doc(req.body.id).set(body);

  body.items.forEach(product => {
    preference.items.push({
      title: product.name,
      unit_price: product.price,
      quantity: product.quantity
    })
  })

  const response =
    mercadopago.preferences.create(preference)
  const preferenceId = (await response).body.id

  res.status(201).json(preferenceId)
})

// Create a order
app.post('/api/createOrder', async (req, res) => {
  const body = req.body

  try {
    await db.collection('orders').doc(req.body.id).set(body)
    res.status(201).json()
  } catch {
    res.status(501).json()
  }
})

app.use(express.json({ limit: '25mb' }))

// Create a product
app.post('/api/createProduct', async (req, res) => {
  const body = req.body

  try {
    await db
      .collection('products')
      .doc(req.body.id)
      .set(body)
    res.status(201).json()
  } catch {
    res.status(501).json()
  }
})

// Add destacado
app.post('/api/addDestacado', async (req, res) => {
  const body = req.body

  try {
    await db.collection('destacados').add({
      product: db.doc(`products/${body.id}`)
    })
    res.status(201).json()
  } catch {
    res.status(501).json()
  }
})

app.post('/api/addSuperDestacado', async (req, res) => {
  const body = req.body

  try {
    await db.collection('superDestacados').add({
      product: db.doc(`products/${body.id}`)
    })
    res.status(201).json()
  } catch {
    res.status(501).json()
  }
})

// Edit a product
app.patch(
  '/api/editProduct/:productId',
  async (req, res) => {
    const body = req.body
    const { productId } = req.params

    try {
      await db
        .collection('products')
        .doc(productId)
        .set(body)
      res.status(201).json()
    } catch {
      res.status(501).json()
    }
  }
)

// Delete a product
app.delete(
  '/api/deleteProduct/:productId',
  async (req, res) => {
    const { productId } = req.params

    try {
      await db
        .collection('products')
        .doc(productId)
        .delete()
      res.status(201).json()
    } catch {
      res.status(501).json()
    }
  }
)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
