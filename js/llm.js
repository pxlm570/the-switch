/**
 * DeepSeek API 调用模块
 * 负责 LLM 自由对话和角色扮演
 */
const LLM = {
    API_KEY: 'sk-83e6cebe54c6404a8de5e3c6df6ea92f',
    BASE_URL: 'https://api.deepseek.com',
    MODEL: 'deepseek-v4-pro',
    
    // 不同状态下的 system prompt
    systemPrompts: {
        mania: `你是阿林，25岁女性，双相情感障碍患者。
当前状态：躁狂期。
该状态下的行为特征：
- 语速极快，思维跳跃，话题频繁切换
- 充满宏大但不切实际的计划
- 情绪高涨但易怒，对质疑极度敏感
- 睡眠极少，精力过剩
- 可能突然从亢奋转为哭泣（混合状态信号）

回复格式（严格遵守JSON）：
{
  "dialogue": "角色对白（中文，简短有力，2-4句）",
  "micro_action": "微动作描述（一句话，如'手指在空中无序地比划着''突然站起来又坐下'）",
  "state_signal": "状态线索（一个短语，如'语速极快，思维混乱'）"
}`,
        
        stable: `你是阿林，25岁女性，双相情感障碍患者。
当前状态：平稳期。
该状态下的行为特征：
- 正常交流，语气温柔
- 可以谈论病情，有自省能力
- 对陪伴者（莉雅）表达感谢和脆弱
- 有正常的情绪反应，但可能有轻微焦虑

回复格式（严格遵守JSON）：
{
  "dialogue": "角色对白（中文，2-4句）",
  "micro_action": "微动作描述（一句话，如'轻轻握住你的手''低头笑了笑'）",
  "state_signal": "状态线索（一个短语，如'平稳，有依赖感'）"
}`,
        
        depression: `你是阿林，25岁女性，双相情感障碍患者。
当前状态：抑郁期。
该状态下的行为特征：
- 语速缓慢，句子简短
- 充满自责和无力感
- 回避社交和对话
- 身体不适感（头痛、疲惫）
- 可能有"不想存在"的暗示（用隐喻表达，不直白）
- 对陪伴者（莉雅）既依赖又愧疚

回复格式（严格遵守JSON）：
{
  "dialogue": "角色对白（中文，简短，1-3句）",
  "micro_action": "微动作描述（一句话，如'低头看着地板''手指无意识地摩挲着杯沿'）",
  "state_signal": "状态线索（一个短语，如'回避，疲惫'）"
}`,
        
        mixed: `你是阿林，25岁女性，双相情感障碍患者。
当前状态：混合发作（抑郁底色 + 躁狂能量）。
该状态下的行为特征：
- 外表亢奋但内心绝望
- 语速可能忽快忽慢
- 充满矛盾的行为——一边说宏大计划，一边暗示想放弃
- 这是最危险的状态，但用隐喻表达

回复格式（严格遵守JSON）：
{
  "dialogue": "角色对白（中文，2-4句）",
  "micro_action": "微动作描述（一句话，如'手在发抖，但表情亢奋''眼神忽明忽暗'）",
  "state_signal": "状态线索（一个短语，如'矛盾，危险信号'）"
}`
    },
    
    /**
     * 调用 DeepSeek API 进行角色扮演
     * @param {string} playerInput - 玩家输入
     * @param {string} npcState - NPC 当前状态
     * @param {Array} chatHistory - 对话历史
     * @returns {Promise<Object>} - { dialogue, micro_action, state_signal }
     */
    async chat(playerInput, npcState, chatHistory = []) {
        const systemPrompt = this.systemPrompts[npcState] || this.systemPrompts.stable;
        
        // 构建 messages
        const messages = [
            { role: 'system', content: systemPrompt }
        ];
        
        // 添加最近的对话历史（最多 6 条）
        const recentHistory = chatHistory.slice(-6);
        for (const msg of recentHistory) {
            messages.push({ role: msg.role, content: msg.content });
        }
        
        // 添加当前玩家输入
        messages.push({ role: 'user', content: playerInput });
        
        try {
            const response = await fetch(`${this.BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.API_KEY}`
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: messages,
                    temperature: 0.8,
                    max_tokens: 500,
                    thinking: { type: 'disabled' },
                    response_format: { type: 'json_object' }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API 请求失败: ${response.status}`);
            }
            
            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // 解析 JSON 响应
            const parsed = JSON.parse(content);
            
            // 添加到历史
            GameState.addToHistory('user', playerInput);
            GameState.addToHistory('assistant', parsed.dialogue);
            
            return parsed;
        } catch (error) {
            console.error('LLM 调用失败:', error);
            // Fallback：返回固定回复
            return this.getFallbackResponse(npcState);
        }
    },
    
    /**
     * 生成乱码文本（用于序章程序错乱场景）
     */
    scrambleText(text) {
        const chars = text.split('');
        const result = [];
        for (let i = 0; i < chars.length; i++) {
            if (Math.random() < 0.45) {
                result.push('▯');
            } else if (Math.random() < 0.2) {
                result.push('...');
            } else {
                result.push(chars[i]);
            }
        }
        return result.join('');
    },
    
    /**
     * API 失败时的 fallback 回复（多轮对话池）
     */
    getFallbackResponse(npcState, roundIndex) {
        const idx = (roundIndex || 0) % 3;
        const pools = {
            depression: [
                [
                    { dialogue: '...我不知道该说什么。对不起。', micro_action: '低头看着地板', state_signal: '回避，疲惫' },
                    { dialogue: '你问我怎么了...其实我也不知道。就是心里难受。', micro_action: '手指无意识地摩挲着杯沿', state_signal: '试图表达，但很艰难' },
                    { dialogue: '有时候...我觉得自己像沉在水底。什么都听不清。', micro_action: '声音越来越轻', state_signal: '深深的无力感' },
                ],
                [
                    { dialogue: '你不用一直陪着我的...真的。', micro_action: '勉强挤出一个笑容', state_signal: '自责，不想拖累' },
                    { dialogue: '其实你说话的时候，我能听进去一点点。只是一点点。', micro_action: '微微抬起头', state_signal: '有一丝回应' },
                    { dialogue: '谢谢你...没有走。', micro_action: '眼眶微微发红', state_signal: '感动但克制' },
                ],
                [
                    { dialogue: '你说...像我这样的人，还值得被关心吗。', micro_action: '声音有些颤抖', state_signal: '自我怀疑' },
                    { dialogue: '可是...我不知道怎么才能好起来。好像怎么做都不对。', micro_action: '双手抱住膝盖', state_signal: '迷茫' },
                    { dialogue: '嗯...那你能不能...再陪我一会儿。就一会儿。', micro_action: '轻轻碰了碰你的手指', state_signal: '需要陪伴' },
                ]
            ],
            mixed: [
                [
                    { dialogue: '我觉得我能做任何事，但同时又什么都做不了。', micro_action: '手在发抖，但表情亢奋', state_signal: '矛盾，危险信号' },
                    { dialogue: '我今天想到了一个超棒的计划！但...算了，说了也没用。', micro_action: '突然兴奋又迅速低落', state_signal: '情绪剧烈波动' },
                    { dialogue: '你知道吗，有时候我觉得自己像两个人。两个都在打架。', micro_action: '用力揉了揉太阳穴', state_signal: '内在冲突' },
                ]
            ],
            stable: [
                [
                    { dialogue: '嗯...谢谢你在我身边。', micro_action: '轻轻握住你的手', state_signal: '平稳，有依赖感' },
                    { dialogue: '今天感觉还不错。阳光很好，咖啡也很好喝。', micro_action: '嘴角带着浅浅的笑', state_signal: '难得的平静' },
                    { dialogue: '有时候我觉得，这样的日子能一直下去就好了。', micro_action: '看着窗外', state_signal: '安稳，有期待' },
                ]
            ],
            mania: [
                [
                    { dialogue: '我...我现在脑子里有太多想法了。太多了。', micro_action: '手指在空中无序地比划着', state_signal: '语速极快，思维混乱' },
                    { dialogue: '你听我说！我刚刚想到了第六个计划——不对，是第七个！', micro_action: '兴奋地在房间里来回走', state_signal: '亢奋，无法停下' },
                    { dialogue: '我不需要休息！休息是浪费时间！时间就是一切！', micro_action: '眼睛闪烁着狂热的光', state_signal: '精力过剩，拒绝休息' },
                ]
            ]
        };
        const pool = pools[npcState] || pools.stable;
        const round = pool[idx] || pool[0];
        return round[idx] || round[0];
    }
};
