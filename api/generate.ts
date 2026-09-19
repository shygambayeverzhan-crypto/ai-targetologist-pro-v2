declare const process: {
  env: Record<string, string | undefined>;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { product, audience, goal, style, mode = "ad" } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY не настроен в Vercel",
      });
    }

    if (mode === "ad" && (!product || !audience || !goal || !style)) {
      return res.status(400).json({ error: "Заполнены не все поля" });
    }

    let prompt = "";

    if (mode === "funnel") {
      prompt = `Ты senior-маркетолог. Составь пошаговую архитектуру воронки для бизнеса "${product}".
Цель: ${goal || "лидогенерация"}.
Целевая аудитория: ${audience || "не указана"}.
Выведи этапы от первого контакта до оплаты, с каналом, сообщением и CTA.`;
    } else if (mode === "offer") {
      prompt = `Ты эксперт по маркетингу. Проанализируй оффер бизнеса "${product}" для аудитории "${audience}".
Цель: ${goal || "рост продаж"}.
Дай: 3 сильных оффера, 3 боли ЦА, 3 триггера и 3 CTA. Не выдумывай факты.`;
    } else if (mode === "consultant") {
      prompt = `Ты AI-консультант по маркетингу. Для бизнеса "${product}" и аудитории "${audience}" подготовь практический план действий.
Цель: ${goal || "получать больше заявок"}.
Дай 5 конкретных действий, 3 метрики контроля и 3 теста на ближайшие 7 дней.`;
    } else {
      prompt = `Ты профессиональный AI-таргетолог и рекламный копирайтер.

Создай готовый рекламный текст на русском языке.

ПРОДУКТ / УСЛУГА:
${product}

ЦЕЛЕВАЯ АУДИТОРИЯ:
${audience}

ЦЕЛЬ РЕКЛАМЫ:
${goal}

СТИЛЬ:
${style}

Формат:
ЗАГОЛОВОК:
ОФФЕР:
ОСНОВНОЙ ТЕКСТ:
ПРИЗЫВ К ДЕЙСТВИЮ:

Пиши естественно и конкретно. Не придумывай факты.`;
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        input: prompt,
        max_output_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Ошибка при обращении к OpenAI",
      });
    }

    const text =
      data?.output_text ||
      data?.output
        ?.flatMap((item: any) => item.content || [])
        ?.filter((item: any) => item.type === "output_text")
        ?.map((item: any) => item.text)
        ?.join("\n") ||
      "";

    if (!text) {
      return res.status(500).json({ error: "AI не вернул текст" });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
