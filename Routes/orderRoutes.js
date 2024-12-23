const express = require('express');
const db = require('../db'); // Adjust path as needed
const router = express.Router();

// POST: Create a new order
router.post('/orders', async (req, res) => {
  const { userId, orderDetails, pickupLocation, dropoffLocation, pickupTime, dropoffTime } = req.body;

  try {
    // Create a new order
    const newOrder = await db.orders.create({
      userId, // Foreign key linking to User
      orderDetails,
      pickupLocation,
      dropoffLocation,
      pickupTime,
      dropoffTime,
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to create order', error });
  }
});

router.get('/order/:orderID', async (req, res) => {
  try {
    const orderID = req.params.orderID;
    const order = await db.orders.findOne({ where: { orderID } });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Get all orders for a specific user
router.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find orders by userId
    const orders = await db.orders.findAll({
      where: { userId },
    });
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

// PUT: Update an order (optional)
router.put('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { orderDetails, pickupLocation, dropoffLocation, pickupTime, dropoffTime } = req.body;

  try {
    const order = await db.orders.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order fields
    order.orderDetails = orderDetails || order.orderDetails;
    order.pickupLocation = pickupLocation || order.pickupLocation;
    order.dropoffLocation = dropoffLocation || order.dropoffLocation;
    order.pickupTime = pickupTime || order.pickupTime;
    order.dropoffTime = dropoffTime || order.dropoffTime;

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to update order', error });
  }
});

// DELETE: Delete an order
router.delete('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await db.orders.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.destroy();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete order', error });
  }
});

module.exports = router;
