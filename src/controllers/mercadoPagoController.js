import { Country } from '../models/Country.js';
import {
  newPreferentialPaymentService,
  getPaymentByIdService,
  getPaymentsService,
} from "../services/PaymentService.js";

export const createPreferentialPayment = async (req, res) => {
  // #swagger.tags = ['MERCADOPAGO']
  try {

    // capturar el body del front

    const {
      items,
      payer,
      metadata
    } = req.body;

    const currency = await Country.findByPk(metadata.fromUser.country, {
      raw: true
    });

    const body = {
      items: items.map(item => {
        return {
          ...item,
          currency_id: currency?.country?.id
            ? currency?.country?.id
            : "PEN" // Por defecto
        }
      }),
      payer,
      metadata
    };
    console.log(body);
    const urlPreferentialPayment = await newPreferentialPaymentService(body);
    return res.status(201).json({
      urlPreferentialPayment,
      message: "preferential payment url generated successfully"
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ error: true, msg: "Failed to create payment" });
  }
}

export const getAllPayments = async (req, res) => {
  // #swagger.tags = ['MERCADOPAGO']
  try {
    const payments = await getPaymentsService();
    return res.json(payments);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, msg: "Failed to get payments" });
  }
}

export const getPaymentById = async (req, res) => {
  // #swagger.tags = ['MERCADOPAGO']
  try {
    const { idPayment } = req.params;
    const payments = await getPaymentByIdService(idPayment);
    return res.json(payments);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, msg: "Failed to get payment" });
  }
}