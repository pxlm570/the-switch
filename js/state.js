/**
 * 游戏状态管理模块
 * 维护 NPC 状态、玩家变量、对话历史
 */
const GameState = {
    // NPC 状态
    npcState: 'stable', // 'stable' | 'mania' | 'depression' | 'mixed'
    
    // 玩家变量（为完整版结局系统做准备）
    variables: {
        concern: 0,     // 关心值 0-10
        trust: 0,       // 信任值 0-10
        crisis: 0,      // 危机值 0-10
        revealed: 0,    // 暗示揭露度 0-3
        choiceHistory: []
    },
    
    // 对话历史（用于 LLM 上下文）
    chatHistory: [],
    
    // 当前节点 ID
    currentNodeId: null,
    
    // 自由对话计数
    freeChatRounds: 0,
    
    // 自由对话总轮数（用于动态状态切换）
    freeChatTotalRounds: 0,
    
    // 游戏进度
    gamePhase: 'title', // 'title' | 'prologue' | 'chapter1' | 'chapter2' | 'chapter3' | 'ending'
    
    // 设置 NPC 状态
    setNpcState(state) {
        const validStates = ['stable', 'mania', 'depression', 'mixed'];
        if (validStates.includes(state)) {
            this.npcState = state;
        }
    },
    
    // 更新变量
    updateVariable(key, delta) {
        if (this.variables.hasOwnProperty(key)) {
            this.variables[key] = Math.max(0, Math.min(10, this.variables[key] + delta));
        }
    },
    
    // 记录选择
    recordChoice(nodeId, choiceIndex) {
        this.variables.choiceHistory.push({ nodeId, choiceIndex, timestamp: Date.now() });
    },
    
    // 添加对话到历史
    addToHistory(role, content) {
        this.chatHistory.push({ role, content, timestamp: Date.now() });
        // 只保留最近 30 条
        if (this.chatHistory.length > 30) {
            this.chatHistory = this.chatHistory.slice(-30);
        }
    },
    
    // 重置状态
    reset() {
        this.npcState = 'stable';
        this.variables = { concern: 0, trust: 0, crisis: 0, revealed: 0, choiceHistory: [] };
        this.chatHistory = [];
        this.currentNodeId = null;
        this.freeChatRounds = 0;
        this.freeChatTotalRounds = 0;
        this.gamePhase = 'title';
    }
};
