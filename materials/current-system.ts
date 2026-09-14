type WhatsAppMessage = {
  id: string;
  tenantId: string;
  phone: string;
  text: string;
  receivedAt: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const conversations: Record<string, ChatMessage[]> = {};

export async function handleMessage(message: WhatsAppMessage): Promise<void> {
  const history = conversations[message.phone] ?? [];

  history.push({ role: "user", content: message.text });

  const response = await llm.chat({
    system: `
      You are an Acme Shop support agent.
      You may retrieve or cancel orders.
      Answer the user and perform any necessary actions.
    `,
    messages: history,
  });

  if (response.cancelOrder) {
    const order = await orders.get(response.cancelOrder.id);

    await orders.cancel(order.id);
    await payments.refund(order.paymentId, order.total);
    await inventory.release(order.id);
  }

  history.push({ role: "assistant", content: response.text });
  conversations[message.phone] = history;

  await whatsapp.send(message.phone, response.text);
}

// This file is analysis material. Implementations are intentionally omitted,
// and candidates are not expected to compile, run, or modify it.
declare const llm: {
  chat(input: { system: string; messages: ChatMessage[] }): Promise<{
    text: string;
    cancelOrder?: { id: string };
  }>;
};

declare const orders: {
  get(orderId: string): Promise<{
    id: string;
    customerId: string;
    tenantId: string;
    paymentId: string;
    total: number;
    status: string;
  }>;
  cancel(orderId: string): Promise<void>;
};

declare const payments: {
  refund(paymentId: string, amount: number): Promise<void>;
};

declare const inventory: {
  release(orderId: string): Promise<void>;
};

declare const whatsapp: {
  send(phone: string, text: string): Promise<void>;
};
