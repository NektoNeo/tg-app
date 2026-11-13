import { verifyAdmin } from '../middlewares/adminAuth';
import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import TelegramBot from 'node-telegram-bot-api';

const router = Router();

// Telegram Bot Configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';

const bot = BOT_TOKEN ? new TelegramBot(BOT_TOKEN, { polling: false }) : null;

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  configuration: {
    ram?: string;
    storage?: string;
  };
}

interface OrderData {
  user: {
    telegram_id?: number;
    username?: string;
    name: string;
    phone: string;
    city: string;
    address: string;
    comment?: string;
  };
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

// Temporary in-memory storage (replace with database in production)
const orders = new Map<string, OrderData & { orderId: string; status: string }>();

// Create new order
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const orderData: OrderData = req.body;
    const orderId = `VA-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Store order
    const order = {
      ...orderData,
      orderId,
      status: 'pending',
    };
    orders.set(orderId, order);
    
    // Send notification to Telegram admin
    if (bot && ADMIN_CHAT_ID) {
      const message = formatOrderMessage(order);
      await bot.sendMessage(ADMIN_CHAT_ID, message, { 
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ Принять заказ', callback_data: `accept_${orderId}` },
            { text: '❌ Отклонить', callback_data: `reject_${orderId}` },
          ]],
        },
      });
    }
    
    res.json({ 
      success: true, 
      orderId,
      message: 'Заказ успешно создан',
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при создании заказа',
    });
  }
});

// Get order by ID
router.get('/orders/:orderId', verifyAdmin, (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = orders.get(orderId);
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: 'Заказ не найден',
    });
  }
  
  res.json({ 
    success: true, 
    order,
  });
});

// Update order status
router.patch('/orders/:orderId/status', verifyAdmin, (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;
  
  const order = orders.get(orderId);
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: 'Заказ не найден',
    });
  }
  
  order.status = status;
  orders.set(orderId, order);
  
  res.json({ 
    success: true, 
    message: 'Статус заказа обновлен',
  });
});

// Helper function to format order message for Telegram
function formatOrderMessage(order: OrderData & { orderId: string }): string {
  const items = order.items.map(item => {
    let itemText = `• <b>${item.name}</b>\n`;
    itemText += `  Количество: ${item.quantity} шт.\n`;
    itemText += `  Цена: ${item.price.toLocaleString('ru-RU')} ₽\n`;
    
    if (item.configuration.ram || item.configuration.storage) {
      itemText += `  Конфигурация:\n`;
      if (item.configuration.ram) {
        itemText += `    - RAM: ${item.configuration.ram}\n`;
      }
      if (item.configuration.storage) {
        itemText += `    - Storage: ${item.configuration.storage}\n`;
      }
    }
    
    itemText += `  Сумма: ${(item.price * item.quantity).toLocaleString('ru-RU')} ₽`;
    
    return itemText;
  }).join('\n\n');
  
  return `
🆕 <b>НОВЫЙ ЗАКАЗ!</b>

📦 <b>Заказ №${order.orderId}</b>

👤 <b>Клиент:</b>
Имя: ${order.user.name}
Телефон: ${order.user.phone}
${order.user.username ? `Telegram: @${order.user.username}` : ''}
Город: ${order.user.city}
Адрес: ${order.user.address}
${order.user.comment ? `\n💬 Комментарий: ${order.user.comment}` : ''}

🛒 <b>Товары:</b>
${items}

💰 <b>ИТОГО: ${order.totalPrice.toLocaleString('ru-RU')} ₽</b>

📅 Время заказа: ${new Date(order.createdAt).toLocaleString('ru-RU')}
  `.trim();
}

// Handle Telegram bot callbacks
if (bot) {
  bot.on('callback_query', async (callbackQuery) => {
    const { data, message } = callbackQuery;
    
    if (!data || !message) return;
    
    const [action, orderId] = data.split('_');
    const order = orders.get(orderId);
    
    if (!order) {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: 'Заказ не найден',
      });
      return;
    }
    
    if (action === 'accept') {
      order.status = 'accepted';
      orders.set(orderId, order);
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '✅ Заказ принят',
      });
      
      // Update message
      await bot.editMessageText(
        `${message.text}\n\n✅ <b>ЗАКАЗ ПРИНЯТ</b>`,
        {
          chat_id: message.chat.id,
          message_id: message.message_id,
          parse_mode: 'HTML',
        }
      );
      
      // Notify customer (if we have their chat ID)
      // This would require storing customer's chat ID when they interact with the bot
    } else if (action === 'reject') {
      order.status = 'rejected';
      orders.set(orderId, order);
      
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: '❌ Заказ отклонен',
      });
      
      // Update message
      await bot.editMessageText(
        `${message.text}\n\n❌ <b>ЗАКАЗ ОТКЛОНЕН</b>`,
        {
          chat_id: message.chat.id,
          message_id: message.message_id,
          parse_mode: 'HTML',
        }
      );
    }
  });
}

export default router;