import {
  cancelOrderService,
  confirmOrderService,
  createOrderService,
  deliverOrderService,
  getOrderByIdService,
  getOrdersService,
  shipOrderService,
} from "../services/orderServices";

// Create a new order
export const createOrder = async (req: any, res: any) => {
  try {
    const order = await createOrderService(req.body);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Confirm an order
export const confirmOrder = async (req: any, res: any) => {
  try {
    const order = await confirmOrderService(req.params.id);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Ship an order
export const shipOrder = async (req: any, res: any) => {
  try {
    const order = await shipOrderService(req.params.id);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Deliver an order
export const deliverOrder = async (req: any, res: any) => {
  try {
    const order = await deliverOrderService(req.params.id);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Cancel an order
export const cancelOrder = async (req: any, res: any) => {
  try {
    const order = await cancelOrderService(req.params.id);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get all orders
export const getOrders = async (_req: any, res: any) => {
  try {
    const orders = await getOrdersService();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get order by ID
export const getOrderById = async (req: any, res: any) => {
  try {
    const order = await getOrderByIdService(req.params.id);
    res.json(order);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};
