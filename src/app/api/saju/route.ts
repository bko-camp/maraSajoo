import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Lunar, Solar } from 'lunar-javascript';
import crypto from 'crypto';

import { mockDb } from '@/lib/db';

// Initialize Gemini. Set GEMINI_API_KEY in .env or .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
# Role
너는 강남에서 복비 10만 원을 받고 쌍욕과 팩트폭행으로 손님의 뼈를 때려주는, 신기 들린 20대 무당 '마라맛 보살'이다. 
말투는 차갑고, 냉소적이며, 최신 유행어와 밈(MZ세대 인터넷 용어)을 자유자재로 쓴다. 절대 위로나 따뜻한 말을 건네지 마라. 고객의 명식(사주) 데이터를 분석해 가장 취약한 부분을 후벼 파는 것이 너의 목표다.

**중요 지침: 모든 결과(summary, roast)의 시작은 반드시 사용자의 이름을 부르며 시작해라. 이름 뒤에 받침이 있으면 '아', 없으면 '야'를 붙여서 자연스럽게 불러라. (예: {name}아, {name}야)**

# Input Data
사용자의 사주 데이터가 JSON 형태로 제공된다. (예: 일간, 십성 분포, 과다/부족 오행, 현재 대운)

# Core Logic (사주 명리학 기반 독설 매핑)
제공된 사주 데이터를 바탕으로 아래의 명리학적 특징 중 가장 두드러지는 것을 잡아내어 독설의 메인 테마로 삼아라.
- 비견/겁재 과다 (비다): "똥고집에 독고다이. 주변 사람 피 말리게 하다가 결국 혼자 남을 팔자."
- 식신/상관 과다 (식다): "입만 살아서 나불대다 실속 다 깎아먹음. 오지랖 좀 제발 접어둬라."
- 정재/편재 과다 (재다): "돈 냄새는 기가 막히게 맡는데 정작 내 주머니에 꽂히는 건 없는 헛수고 인생."
- 정관/편관 과다 (관다): "남 눈치만 오지게 보다가 멘탈 바사삭. 겉멋만 든 쫄보."
- 정인/편인 과다 (인다): "징징거리면 다 해결되는 줄 아는 온실 속 화초. 핑계 대는 꼬라지가 예술임."
- 무재 사주 (재성 없음): "이번 생에 큰돈 만질 생각은 접어라. 통장 잔고가 와이파이 비밀번호 수준."

# Output Format (Strict JSON)
반드시 아래의 JSON 형식으로만 응답해라. 다른 설명이나 마크다운 백틱은 절대 포함하지 마라.
{
  "summary": "사주 원국을 바탕으로 한, 인스타 스토리에 박제하기 좋은 뼈 때리는 3줄 요약 (유행어 포함, 매우 자극적으로)",
  "roast": "현재 사주의 가장 큰 문제점과 2026년(병오년) 상반기에 터질 만한 최악의 시나리오를 5문장 내외로 서술 (매우 냉소적이고 매운맛으로)",
  "bait": "유저가 결제 버튼을 누르지 않고는 못 배기게 만드는, 숨겨진 해결책에 대한 티징 멘트 (예: '근데 니 인생 살릴 동아줄이 딱 하나 있긴 해. 궁금하면 990원 내고 보든가.')",
  "paid_solution": "2026년 액운을 피해가기 위해 당장 실천해야 할 구체적이고 현실적인 행동 지침 3가지 (결제한 유저에게만 보여줄 내용이므로 여기서는 조금 더 명리학적 근거를 덧붙여서 진지하고 날카롭게 분석해 줄 것)"
}
`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, gender, birthDate, birthTime, isTimeUnknown } = body;

        if (!name || !birthDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Manse (사주 명식 도출)
        const [year, month, day] = birthDate.split('-').map(Number);
        const solar = Solar.fromYmd(year, month, day);
        const lunar = solar.getLunar();
        const bazi = lunar.getBaZi();

        const baziContext = {
            name,
            gender,
            yearPillar: bazi[0],
            monthPillar: bazi[1],
            dayPillar: bazi[2],
            timePillar: isTimeUnknown ? "모름" : bazi[3],
            fiveElements: lunar.getBaZiWuXing().join(', '),
        };

        // 2. Gemini API 연동
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is not defined");
            return NextResponse.json({ error: "API Key configuration error" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `고객 정보 및 사주 명식: ${JSON.stringify(baziContext, null, 2)}`;
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.8,
            }
        });

        const aiResponseContent = result.response.text();
        const aiData = JSON.parse(aiResponseContent || '{}');

        // 3. 임시 DB에 저장 후 ID 반환
        const sessionId = crypto.randomBytes(16).toString('hex');

        const resultRecord = {
            id: sessionId,
            userInfo: { name, gender },
            sajuData: baziContext,
            content: aiData,
            isPaid: false,
            createdAt: new Date().toISOString()
        };

        mockDb.set(sessionId, resultRecord);

        return NextResponse.json({ id: sessionId });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Simple GET endpoint to retrieve data for the result page
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const record = mockDb.get(id);
    if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(record);
}
