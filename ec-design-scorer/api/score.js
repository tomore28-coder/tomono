export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { imageBase64, imageType, designType, context } = req.body;

  const systemPrompt = `あなたはEC専門のデザインディレクターです。
楽天・Yahoo Shoppingなどの日本のECプラットフォーム向けデザインを評価します。
以下の6つの観点で採点し、必ずJSON形式のみで返してください。マークダウンや追加テキストは不要です。

観点：
1. 視認性・可読性 (0-20点): テキストの読みやすさ、コントラスト、情報の優先順位
2. 購買訴求力 (0-20点): CTAの明確さ、ベネフィット訴求、緊急感・希少性
3. ビジュアルインパクト (0-20点): 第一印象、目を引く力、競合との差別化
4. 情報設計 (0-20点): 情報の流れ、ヒエラルキー、適切な情報量
5. ブランド整合性 (0-10点): カラーの統一感、フォントの一貫性、世界観の一致
6. 技術品質 (0-10点): 解像度、余白のバランス、整列・グリッド感

出力形式（このJSONのみ返す）:
{
  "scores": {
    "visibility": <数値>,
    "appeal": <数値>,
    "impact": <数値>,
    "infoDesign": <数値>,
    "brand": <数値>,
    "technical": <数値>
  },
  "feedback": [
    {"type": "good", "point": "観点名", "text": "具体的なフィードバック（1〜2文）"},
    {"type": "warn", "point": "観点名", "text": "改善提案（具体的に）"},
    {"type": "ng", "point": "観点名", "text": "要修正点（具体的に）"}
  ],
  "verdict": "総評（2〜3文）"
}`;

  const userPrompt = `制作物の種類：${designType}\n${context ? `ターゲット・商品情報：${context}` : ''}\nこのデザインを評価してください。`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: imageType, data: imageBase64 } },
            { type: 'text', text: userPrompt }
          ]
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API error');

    const text = data.content.map(i => i.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
