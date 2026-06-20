/**
 * 存档系统模块
 * 使用 localStorage 管理 5 个存档槽
 */
const SaveSystem = {
    STORAGE_KEY: 'the_switch_saves',
    MAX_SLOTS: 5,
    
    // 进度名称映射
    phaseNames: {
        'prologue': '序章',
        'chapter1': '第一章·躁狂爆发',
        'chapter2': '第二章·闪回',
        'chapter3': '第三章·抉择',
        'ending': '尾声'
    },
    
    /**
     * 获取当前进度名称
     */
    getCurrentProgress() {
        const nodeId = GameState.currentNodeId || '';
        if (nodeId.startsWith('prologue')) return '序章·袭击';
        if (nodeId.startsWith('chapter1')) return '第一章·躁狂爆发';
        if (nodeId.startsWith('chapter2')) return '第二章·闪回';
        if (nodeId.startsWith('chapter3')) return '第三章·抉择';
        if (nodeId.startsWith('ending')) return '尾声';
        return '游戏中';
    },
    
    /**
     * 保存游戏到指定槽位
     */
    save(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.MAX_SLOTS) return false;
        if (GameState.gamePhase === 'title') return false;
        
        const saveData = {
            slotIndex: slotIndex,
            timestamp: Date.now(),
            nodeId: GameState.currentNodeId,
            npcState: GameState.npcState,
            gamePhase: GameState.gamePhase,
            progress: this.getCurrentProgress(),
            variables: { ...GameState.variables },
            chatHistory: [...GameState.chatHistory.slice(-20)]
        };
        
        const allSaves = this.getAll();
        allSaves[slotIndex] = saveData;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allSaves));
        
        Engine.renderSaveSlots('save');
        
        return true;
    },
    
    /**
     * 新游戏自动存档到第一个空槽位
     */
    autoSave() {
        const allSaves = this.getAll();
        for (let i = 0; i < this.MAX_SLOTS; i++) {
            if (!allSaves[i] || !allSaves[i].nodeId) {
                return this.save(i);
            }
        }
        // 所有槽位都满了，覆盖第一个
        return this.save(0);
    },
    
    /**
     * 读取指定槽位的存档
     */
    load(slotIndex) {
        const allSaves = this.getAll();
        return allSaves[slotIndex] || null;
    },
    
    /**
     * 删除指定槽位的存档
     */
    delete(slotIndex) {
        const allSaves = this.getAll();
        allSaves[slotIndex] = null;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allSaves));
    },
    
    /**
     * 获取所有存档
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            const saves = data ? JSON.parse(data) : [];
            while (saves.length < this.MAX_SLOTS) {
                saves.push(null);
            }
            return saves.slice(0, this.MAX_SLOTS);
        } catch (e) {
            return new Array(this.MAX_SLOTS).fill(null);
        }
    },
    
    /**
     * 获取最新存档
     */
    getLatest() {
        const saves = this.getAll();
        let latest = null;
        let latestTime = 0;
        for (const save of saves) {
            if (save && save.timestamp > latestTime) {
                latest = save;
                latestTime = save.timestamp;
            }
        }
        return latest;
    },
    
    /**
     * 检查是否有任何存档
     */
    hasAny() {
        return this.getLatest() !== null;
    }
};
