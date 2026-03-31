import {
  cancelOrderService,
  confirmOrderService,
  createOrderService,
  getOrderByIdService,
  getOrdersService,
} from "../services/order";

// CREATE
export const createOrder = async (req: any, res: any) => {
  try {
    const order = await createOrderService(req.body);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// CONFIRM
export const confirmOrder = async (req: any, res: any) => {
  try {
    const order = await confirmOrderService(req.params.id);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// CANCEL
export const cancelOrder = async (req: any, res: any) => {
  try {
    const order = await cancelOrderService(req.params.id);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
export const getOrders = async (_req: any, res: any) => {
  try {
    const orders = await getOrdersService();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
export const getOrderById = async (req: any, res: any) => {
  try {
    const order = await getOrderByIdService(req.params.id);
    res.json(order);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};
