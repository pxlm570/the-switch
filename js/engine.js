/**
 * 视觉小说核心引擎
 * 负责场景管理、对话播放、选择处理、自由对话、转场特效
 */

const Engine = {
    // DOM 引用
    elements: {},
    
    // 当前场景数据
    currentScene: null,
    
    // 是否正在播放对话
    isPlaying: false,
    
    // 打字机定时器
    typewriterTimer: null,
    
    // 初始化
    init() {
        this.elements = {
            titleScreen: document.getElementById('title-screen'),
            gameScreen: document.getElementById('game-screen'),
            sceneBg: document.getElementById('scene-bg'),
            colorOverlay: document.getElementById('color-overlay'),
            characterArea: document.getElementById('character-area'),
            characterImg: document.getElementById('character-img'),
            speakerName: document.getElementById('speaker-name'),
            dialogText: document.getElementById('dialog-text'),
            dialogIndicator: document.getElementById('dialog-indicator'),
            stateSignal: document.getElementById('state-signal'),
            dialogBox: document.querySelector('.dialog-box'),
            choicesArea: document.getElementById('choices-area'),
            choicesContainer: document.getElementById('choices-container'),
            freechatArea: document.getElementById('freechat-area'),
            freechatInput: document.getElementById('freechat-input'),
            freechatSend: document.getElementById('freechat-send'),
            freechatHint: document.getElementById('freechat-hint'),
            innerThought: document.getElementById('inner-thought'),
            fullscreenText: document.getElementById('fullscreen-text'),
            effectsLayer: document.getElementById('effects-layer'),
            // 首页菜单
            btnNewGame: document.getElementById('btn-newgame'),
            btnLoad: document.getElementById('btn-load'),
            btnAbout: document.getElementById('btn-about'),
            btnExit: document.getElementById('btn-exit'),
            aboutPanel: document.getElementById('about-panel'),
            btnAboutClose: document.getElementById('btn-about-close'),
            savePanel: document.getElementById('save-panel'),
            saveSlots: document.getElementById('save-slots'),
            btnSaveClose: document.getElementById('btn-save-close'),
            confirmDialog: document.getElementById('confirm-dialog'),
            confirmMessage: document.getElementById('confirm-message'),
            btnConfirmYes: document.getElementById('btn-confirm-yes'),
            btnConfirmNo: document.getElementById('btn-confirm-no'),
            // 暂停菜单
            pauseMenu: document.getElementById('pause-menu'),
            btnPauseSave: document.getElementById('btn-pause-save'),
            btnPauseLoad: document.getElementById('btn-pause-load'),
            btnPauseReturn: document.getElementById('btn-pause-return'),
            btnPauseResume: document.getElementById('btn-pause-resume'),
            // 设置菜单（左上角齿轮）
            btnSettings: document.getElementById('btn-settings'),
            settingsMenu: document.getElementById('settings-menu'),
            btnSettingsSave: document.getElementById('btn-settings-save'),
            btnSettingsLoad: document.getElementById('btn-settings-load'),
            btnSettingsAbout: document.getElementById('btn-settings-about'),
            btnSettingsExit: document.getElementById('btn-settings-exit'),
            btnSettingsClose: document.getElementById('btn-settings-close')
        };
        
        // 绑定事件
        this.bindEvents();
    },
    
    // 绑定事件
    bindEvents() {
        // 新游戏
        this.elements.btnNewGame.addEventListener('click', () => {
            this.showScreen('game');
            this.startGame();
        });
        
        // 读取存档
        this.elements.btnLoad.addEventListener('click', () => {
            this.showSavePanel('load');
        });
        
        // 游戏说明
        this.elements.btnAbout.addEventListener('click', () => {
            this.elements.aboutPanel.classList.remove('hidden');
        });
        
        this.elements.btnAboutClose.addEventListener('click', () => {
            this.elements.aboutPanel.classList.add('hidden');
            if (this._aboutNextNode) {
                const next = this._aboutNextNode;
                this._aboutNextNode = null;
                this.loadScene(next);
            }
        });
        
        // 退出游戏
        this.elements.btnExit.addEventListener('click', () => {
            this.showConfirm('确定要退出游戏吗？', () => {
                window.close();
            });
        });
        
        // 存档面板关闭
        this.elements.btnSaveClose.addEventListener('click', () => {
            this.hideSavePanel();
        });
        
        // 暂停菜单
        this.elements.btnPauseResume.addEventListener('click', () => {
            this.hidePauseMenu();
        });
        
        this.elements.btnPauseSave.addEventListener('click', () => {
            this.hidePauseMenu();
            this.showSavePanel('save');
        });
        
        this.elements.btnPauseLoad.addEventListener('click', () => {
            this.hidePauseMenu();
            this.showSavePanel('load');
        });
        
        this.elements.btnPauseReturn.addEventListener('click', () => {
            this.hidePauseMenu();
            this.showConfirm('返回标题画面？未保存的进度将丢失。', () => {
                this.returnToTitle();
            });
        });
        
        // 设置菜单（左上角齿轮）
        this.elements.btnSettings.addEventListener('click', () => {
            const menu = this.elements.settingsMenu;
            if (menu.classList.contains('hidden')) {
                menu.classList.remove('hidden');
            } else {
                menu.classList.add('hidden');
            }
        });
        
        this.elements.btnSettingsClose.addEventListener('click', () => {
            this.elements.settingsMenu.classList.add('hidden');
        });
        
        this.elements.btnSettingsSave.addEventListener('click', () => {
            this.elements.settingsMenu.classList.add('hidden');
            this.showSavePanel('save');
        });
        
        this.elements.btnSettingsLoad.addEventListener('click', () => {
            this.elements.settingsMenu.classList.add('hidden');
            this.showSavePanel('load');
        });
        
        this.elements.btnSettingsAbout.addEventListener('click', () => {
            this.elements.settingsMenu.classList.add('hidden');
            this.elements.aboutPanel.classList.remove('hidden');
        });
        
        this.elements.btnSettingsExit.addEventListener('click', () => {
            this.elements.settingsMenu.classList.add('hidden');
            this.showConfirm('确定要退出游戏吗？', () => {
                window.close();
            });
        });
        
        // 对话框点击继续
        this.elements.dialogBox.addEventListener('click', (e) => {
            if (e.target.closest('.choice-btn') || 
                e.target.closest('.freechat-input') || 
                e.target.closest('.freechat-send')) {
                return;
            }
            this.onDialogClick();
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // ESC 逻辑
            if (e.code === 'Escape') {
                // 设置菜单打开时关闭
                if (!this.elements.settingsMenu.classList.contains('hidden')) {
                    this.elements.settingsMenu.classList.add('hidden');
                    return;
                }
                // 游戏说明面板关闭（如果在游戏中有后续节点则跳转）
                if (!this.elements.aboutPanel.classList.contains('hidden')) {
                    this.elements.aboutPanel.classList.add('hidden');
                    if (this._aboutNextNode) {
                        const next = this._aboutNextNode;
                        this._aboutNextNode = null;
                        this.loadScene(next);
                    }
                    return;
                }
                // 存档面板打开时优先关闭
                if (!this.elements.savePanel.classList.contains('hidden')) {
                    this.hideSavePanel();
                    return;
                }
                // 确认框打开时关闭
                if (!this.elements.confirmDialog.classList.contains('hidden')) {
                    this.hideConfirm();
                    return;
                }
                // 游戏中打开暂停菜单
                if (GameState.gamePhase !== 'title') {
                    if (this.elements.pauseMenu.classList.contains('hidden')) {
                        this.showPauseMenu();
                    } else {
                        this.hidePauseMenu();
                    }
                }
                return;
            }
            
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                if (this.isPlaying) {
                    this.skipTypewriter();
                } else {
                    this.onDialogClick();
                }
            }
            
            // S 键快速存档
            if (e.code === 'KeyS' && e.ctrlKey && GameState.gamePhase !== 'title') {
                e.preventDefault();
                SaveSystem.save(0);
            }
        });
        
        // 自由对话发送
        this.elements.freechatSend.addEventListener('click', () => {
            this.onFreeChatSend();
        });
        
        this.elements.freechatInput.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                e.preventDefault();
                this.onFreeChatSend();
            }
        });
    },
    
    // 切换画面
    showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        if (screen === 'title') {
            this.elements.titleScreen.classList.add('active');
            GameState.gamePhase = 'title';
        } else if (screen === 'game') {
            this.elements.gameScreen.classList.add('active');
        }
    },
    
    // 返回标题
    returnToTitle() {
        this.clearTypewriter();
        this.hideChoices();
        this.hideFreeChat();
        this.hideInnerThought();
        this.hideFullscreenText();
        this.isPlaying = false;
        this.showScreen('title');
    },
    
    // 开始新游戏
    startGame() {
        GameState.reset();
        this.loadScene('prologue_title');
        // 自动存档到第一个空槽位
        setTimeout(() => SaveSystem.autoSave(), 500);
    },
    
    // 从存档加载
    loadFromSave(saveData) {
        GameState.npcState = saveData.npcState;
        GameState.variables = saveData.variables;
        GameState.gamePhase = saveData.gamePhase;
        this.loadScene(saveData.nodeId);
    },
    
    // 加载场景
    loadScene(nodeId) {
        const scene = ScriptData.scenes[nodeId];
        if (!scene) {
            console.error(`场景节点不存在: ${nodeId}`);
            return;
        }
        
        this.currentScene = scene;
        GameState.currentNodeId = nodeId;
        
        // 根据节点ID自动更新游戏进度
        if (nodeId.startsWith('prologue')) GameState.gamePhase = 'prologue';
        else if (nodeId.startsWith('chapter1')) GameState.gamePhase = 'chapter1';
        else if (nodeId.startsWith('chapter2')) GameState.gamePhase = 'chapter2';
        else if (nodeId.startsWith('chapter3')) GameState.gamePhase = 'chapter3';
        else if (nodeId.startsWith('ending')) GameState.gamePhase = 'ending';
        
        // 设置背景
        if (scene.bg) {
            this.elements.sceneBg.style.backgroundImage = `url(${scene.bg})`;
        }
        
        // 设置色调叠加
        if (scene.overlay) {
            this.elements.colorOverlay.className = 'color-overlay ' + scene.overlay;
        } else {
            this.elements.colorOverlay.className = 'color-overlay';
        }
        
        // 设置角色立绘
        if (scene.charImg) {
            this.elements.characterImg.src = scene.charImg;
            this.elements.characterImg.classList.remove('hidden');
        } else {
            this.elements.characterImg.classList.add('hidden');
        }
        
        // 设置角色位置
        this.elements.characterArea.className = 'character-area';
        if (scene.charPosition) {
            this.elements.characterArea.classList.add(scene.charPosition);
        }
        
        // 更新 NPC 状态
        if (scene.npcState) {
            GameState.setNpcState(scene.npcState);
        }
        
        // 处理特效
        if (scene.effect) {
            this.playEffect(scene.effect);
        }
        
        // 处理音效
        if (scene.sfx) {
            this.playSfx(scene.sfx);
        }
        
        // 隐藏选择区和输入区
        this.hideChoices();
        this.hideFreeChat();
        this.hideInnerThought();
        this.hideFullscreenText();
        
        // onEnter 特殊处理（如游戏中弹出说明面板）
        if (scene.onEnter === 'showAboutInGame') {
            this.showAboutInGame(scene.next);
            return;
        }
        
        // 播放对话序列
        if (scene.dialogues && scene.dialogues.length > 0) {
            this.playDialogues(scene.dialogues, 0, () => {
                this.onDialoguesComplete(scene);
            });
        } else {
            // 无对话场景：纯特效/纯画面过渡，自动延时跳转
            setTimeout(() => {
                this.onDialoguesComplete(scene);
            }, scene.autoDelay || 2000);
        }
    },
    
    // 播放对话序列
    playDialogues(dialogues, index, onComplete) {
        if (index >= dialogues.length) {
            if (onComplete) onComplete();
            return;
        }
        
        const d = dialogues[index];
        
        // 章节标题（幕布提示，点击继续）
        if (d.type === 'chapter_title') {
            this.showChapterTitle(d.text, d.sub);
            this.showIndicator();
            this.isPlaying = true;
            this._continueCallback = () => {
                this.hideChapterTitle();
                this.hideIndicator();
                this.playDialogues(dialogues, index + 1, onComplete);
            };
            return;
        }
        
        // 内心独白（点击继续）
        if (d.type === 'thought') {
            this.showInnerThought(d.text);
            this.showIndicator();
            this.isPlaying = true;
            this._continueCallback = () => {
                this.hideInnerThought();
                this.hideIndicator();
                this.playDialogues(dialogues, index + 1, onComplete);
            };
            return;
        }
        
        // 全屏字幕（点击继续）
        if (d.type === 'fullscreen') {
            this.showFullscreenText(d.text, d.sub);
            this.showIndicator();
            this.isPlaying = true;
            this._continueCallback = () => {
                this.hideFullscreenText();
                this.hideIndicator();
                this.playDialogues(dialogues, index + 1, onComplete);
            };
            return;
        }
        
        // 动作描述（无说话者，环境描述）
        if (d.type === 'action') {
            this.elements.speakerName.textContent = '';
            this.elements.speakerName.className = 'speaker-name system';
            this.typewriter(d.text, () => {
                this.showIndicator();
            });
            this.isPlaying = true;
            // 等待用户点击继续
            this._continueCallback = () => {
                this.hideIndicator();
                this.playDialogues(dialogues, index + 1, onComplete);
            };
            return;
        }
        
        // 普通对话
        this.elements.speakerName.textContent = d.speaker || '';
        this.elements.speakerName.className = 'speaker-name';
        if (d.speaker === '系统' || d.speaker === '字幕') {
            this.elements.speakerName.className = 'speaker-name system';
        }
        
        this.typewriter(d.text, () => {
            this.showIndicator();
        });
        
        // 微动作效果
        if (d.action === 'shake') {
            this.elements.characterImg.classList.add('shake');
            setTimeout(() => this.elements.characterImg.classList.remove('shake'), 300);
        }
        
        this.isPlaying = true;
        this._continueCallback = () => {
            this.hideIndicator();
            this.playDialogues(dialogues, index + 1, onComplete);
        };
    },
    
    // 对话播放完成后的处理
    onDialoguesComplete(scene) {
        this.isPlaying = false;
        this._continueCallback = null;
        
        // 自由对话节点
        if (scene.freeChat) {
            this.startFreeChat(scene);
            return;
        }
        
        // 选择节点
        if (scene.choices && scene.choices.length > 0) {
            this.showChoices(scene.choices);
            return;
        }
        
        // 自动跳转
        if (scene.next) {
            setTimeout(() => this.loadScene(scene.next), 500);
            return;
        }
        
        // 结束
        if (scene.end) {
            this.showEnding(scene);
        }
    },
    
    // 打字机效果
    typewriter(text, onComplete) {
        this.clearTypewriter();
        this.hideIndicator();
        this.elements.dialogText.textContent = '';
        
        let index = 0;
        const speed = 40; // 每个字 40ms
        
        this.typewriterTimer = setInterval(() => {
            if (index < text.length) {
                this.elements.dialogText.textContent += text[index];
                // 每隔几个字播放轻击音效
                if (index % 4 === 0 && text[index] !== ' ' && text[index] !== '\n') {
                    if (typeof AudioFX !== 'undefined') AudioFX.play('typewriter');
                }
                index++;
            } else {
                this.clearTypewriter();
                if (onComplete) onComplete();
            }
        }, speed);
    },
    
    // 跳过打字机
    skipTypewriter() {
        if (this.typewriterTimer) {
            this.clearTypewriter();
            // 获取当前正在播放的对话
            if (this.currentScene && this.currentScene.dialogues) {
                // 找到当前未完成的对话
                const currentText = this.elements.dialogText.textContent;
                // 无法精确跳过，直接用继续逻辑
            }
            if (this._continueCallback) {
                this._continueCallback();
            }
        }
    },
    
    // 清除打字机
    clearTypewriter() {
        if (this.typewriterTimer) {
            clearInterval(this.typewriterTimer);
            this.typewriterTimer = null;
        }
    },
    
    // 对话框点击
    onDialogClick() {
        if (this.isPlaying) {
            // 跳过当前打字机动画
            this.clearTypewriter();
            if (this._continueCallback) {
                this._continueCallback();
            }
        }
    },
    
    // 显示/隐藏继续提示
    showIndicator() {
        this.elements.dialogIndicator.classList.remove('hidden');
    },
    
    hideIndicator() {
        this.elements.dialogIndicator.classList.add('hidden');
    },
    
    // === 选择系统 ===
    showChoices(choices) {
        this.elements.choicesContainer.innerHTML = '';
        this.elements.choicesArea.classList.remove('hidden');
        
        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', () => {
                this.onChoiceSelected(choice, index);
            });
            this.elements.choicesContainer.appendChild(btn);
        });
    },
    
    hideChoices() {
        this.elements.choicesArea.classList.add('hidden');
        this.elements.choicesContainer.innerHTML = '';
    },
    
    onChoiceSelected(choice, index) {
        // 记录选择
        GameState.recordChoice(GameState.currentNodeId, index);
        
        // 更新变量
        if (choice.var) {
            for (const [key, delta] of Object.entries(choice.var)) {
                GameState.updateVariable(key, delta);
            }
        }
        
        // 隐藏选择
        this.hideChoices();
        
        // 跳转
        if (choice.next) {
            this.loadScene(choice.next);
        }
    },
    
    // === 自由对话系统 ===
    startFreeChat(scene) {
        this.hideIndicator();
        this.elements.dialogText.textContent = '';
        this.elements.speakerName.textContent = '';
        
        const fc = scene.freeChat;
        GameState.freeChatRounds = 0;
        GameState.freeChatTotalRounds = 0;
        
        // 设置模式
        if (fc.mode === 'scramble') {
            this.elements.freechatInput.classList.add('scramble-mode');
            this.elements.freechatHint.textContent = fc.hint || '你想说什么...？';
        } else {
            this.elements.freechatInput.classList.remove('scramble-mode');
            this.elements.freechatHint.textContent = fc.hint || `你可以自由对话 (${fc.maxRounds || 3} 轮)`;
        }
        
        this.elements.freechatInput.value = '';
        this.elements.freechatInput.disabled = false;
        this.elements.freechatSend.disabled = false;
        this.elements.freechatArea.classList.remove('hidden');
        this.elements.freechatInput.focus();
        
        // 存储当前自由对话配置
        this._freeChatConfig = {
            mode: fc.mode,
            maxRounds: fc.maxRounds || 3,
            npcState: fc.npcState || GameState.npcState,
            npcExpression: fc.npcExpression,
            transition: scene.transition || scene.next,
            dynamicState: fc.dynamicState || false,
            stateTransitions: fc.stateTransitions || null,
            expressions: fc.expressions || null
        };
    },
    
    hideFreeChat() {
        this.elements.freechatArea.classList.add('hidden');
        this.elements.freechatInput.value = '';
        this.elements.stateSignal.classList.remove('visible');
        this._freeChatConfig = null;
    },
    
    async onFreeChatSend() {
        const input = this.elements.freechatInput.value.trim();
        if (!input) return;
        
        const config = this._freeChatConfig;
        if (!config) return;
        
        GameState.freeChatRounds++;
        
        // 乱码模式
        if (config.mode === 'scramble') {
            const scrambled = LLM.scrambleText(input);
            this.elements.speakerName.textContent = '莉雅';
            this.elements.speakerName.className = 'speaker-name';
            
            // 打字机显示乱码
            this.typewriter(scrambled, () => {
                // 阿林在说话，但听不清
                setTimeout(() => {
                    if (config.npcExpression) {
                        this.elements.characterImg.src = config.npcExpression;
                    }
                    this.elements.speakerName.textContent = '阿林';
                    this.elements.dialogText.textContent = '阿林在说什么，但你听不清。';
                    
                    // 第二次发送后过渡
                    if (GameState.freeChatRounds >= config.maxRounds) {
                        setTimeout(() => {
                            this.hideFreeChat();
                            this.elements.dialogText.textContent = '';
                            // 显示内心独白
                            this.showInnerThought('...我怎么了？');
                            setTimeout(() => {
                                this.hideInnerThought();
                                if (config.transition) {
                                    this.loadScene(config.transition);
                                }
                            }, 2000);
                        }, 1500);
                    } else {
                        this.elements.freechatInput.value = '';
                        this.elements.freechatInput.focus();
                        this.elements.freechatHint.textContent = '再试一次...？';
                    }
                }, 800);
            });
            
            this.elements.freechatInput.value = '';
            return;
        }
        
        // 正常自由对话模式
        this.elements.freechatInput.disabled = true;
        this.elements.freechatSend.disabled = true;
        this.elements.freechatHint.textContent = '等待阿林回复...';
        
        try {
            const response = await LLM.chat(input, config.npcState, GameState.chatHistory);
            
            // 动态状态切换
            if (config.dynamicState && config.stateTransitions) {
                GameState.freeChatTotalRounds++;
                const transitions = config.stateTransitions;
                const currentState = config.npcState;
                
                if (transitions[currentState] && 
                    GameState.freeChatTotalRounds >= transitions[currentState].threshold) {
                    const nextState = transitions[currentState].next;
                    if (nextState) {
                        config.npcState = nextState;
                        GameState.setNpcState(nextState);
                        // 更新立绘
                        if (config.expressions && config.expressions[nextState]) {
                            config.npcExpression = config.expressions[nextState];
                            this.elements.characterImg.src = config.npcExpression;
                        }
                        // 更新色调
                        if (nextState === 'stable') {
                            this.elements.colorOverlay.className = 'color-overlay amber';
                        } else if (nextState === 'mixed') {
                            this.elements.colorOverlay.className = 'color-overlay warm';
                        }
                        this.elements.freechatHint.textContent = '阿林的状态似乎有些变化...';
                    }
                }
            }
            
            // 显示阿林立绘
            if (config.npcExpression) {
                this.elements.characterImg.src = config.npcExpression;
            }
            
            // 显示阿林的回复（含微动作和状态线索）
            this.elements.speakerName.textContent = '阿林';
            this.elements.speakerName.className = 'speaker-name';
            
            // 显示状态线索
            if (response.state_signal) {
                this.elements.stateSignal.textContent = response.state_signal;
                this.elements.stateSignal.classList.add('visible');
            } else {
                this.elements.stateSignal.classList.remove('visible');
            }
            
            let displayText = response.dialogue;
            if (response.micro_action) {
                displayText += `\n\n<span class="micro-action">${response.micro_action}</span>`;
            }
            
            this.typewriter(displayText, () => {
                this.showIndicator();
            });
            this.isPlaying = true;
            this._continueCallback = () => {
                this.hideIndicator();
                GameState.freeChatRounds++;
                
                if (GameState.freeChatRounds >= config.maxRounds) {
                    // 自由对话结束，过渡
                    this.hideFreeChat();
                    if (config.transition) {
                        this.loadScene(config.transition);
                    }
                } else {
                    this.elements.freechatInput.disabled = false;
                    this.elements.freechatSend.disabled = false;
                    this.elements.freechatInput.value = '';
                    this.elements.freechatInput.focus();
                    const remaining = config.maxRounds - GameState.freeChatRounds;
                    this.elements.freechatHint.textContent = `还可以对话 ${remaining} 轮`;
                }
            };
        } catch (error) {
            console.error('自由对话失败:', error);
            const fallback = LLM.getFallbackResponse(config.npcState, GameState.freeChatRounds);
            this.elements.speakerName.textContent = '阿林';
            this.elements.speakerName.className = 'speaker-name';
            
            // 显示状态线索
            if (fallback.state_signal) {
                this.elements.stateSignal.textContent = fallback.state_signal;
                this.elements.stateSignal.classList.add('visible');
            }
            
            let displayText = fallback.dialogue;
            if (fallback.micro_action) {
                displayText += `\n\n<span class="micro-action">${fallback.micro_action}</span>`;
            }
            
            this.typewriter(displayText, () => {
                this.showIndicator();
            });
            this.isPlaying = true;
            this._continueCallback = () => {
                this.hideIndicator();
                GameState.freeChatRounds++;
                if (GameState.freeChatRounds >= config.maxRounds) {
                    this.hideFreeChat();
                    if (config.transition) {
                        this.loadScene(config.transition);
                    }
                } else {
                    this.elements.freechatInput.disabled = false;
                    this.elements.freechatSend.disabled = false;
                    this.elements.freechatInput.value = '';
                    this.elements.freechatInput.focus();
                    this.elements.freechatHint.textContent = `还可以对话 ${config.maxRounds - GameState.freeChatRounds} 轮`;
                }
            };
        }
        
        this.elements.freechatInput.value = '';
    },
    
    // === 特效系统 ===
    playEffect(effect) {
        const layer = this.elements.effectsLayer;
        layer.classList.remove('hidden', 'flash', 'glitch', 'shake');
        
        // 强制回流
        void layer.offsetWidth;
        
        switch (effect) {
            case 'flash':
                layer.classList.remove('hidden');
                layer.classList.add('flash');
                setTimeout(() => {
                    layer.classList.add('hidden');
                    layer.classList.remove('flash');
                }, 200);
                break;
            case 'glitch':
                layer.classList.remove('hidden');
                layer.classList.add('glitch');
                setTimeout(() => {
                    layer.classList.add('hidden');
                    layer.classList.remove('glitch');
                }, 400);
                break;
            case 'shake':
                layer.classList.remove('hidden');
                layer.classList.add('shake');
                setTimeout(() => {
                    layer.classList.add('hidden');
                    layer.classList.remove('shake');
                }, 600);
                break;
        }
    },
    
    // === 音效 ===
    playSfx(sfxId) {
        // 优先使用Web Audio API生成的音效
        if (typeof AudioFX !== 'undefined') {
            AudioFX.play(sfxId);
        }
    },
    
    // === 内心独白 ===
    showInnerThought(text) {
        this.elements.innerThought.textContent = text;
        this.elements.innerThought.classList.remove('hidden');
    },
    
    hideInnerThought() {
        this.elements.innerThought.classList.add('hidden');
    },
    
    // === 全屏字幕 ===
    showFullscreenText(text, sub) {
        let html = text;
        if (sub) {
            html += `<div class="small">${sub}</div>`;
        }
        this.elements.fullscreenText.innerHTML = html;
        this.elements.fullscreenText.classList.remove('hidden');
        this.elements.fullscreenText.style.pointerEvents = 'auto';
        this.elements.fullscreenText.onclick = () => this.onDialogClick();
    },
    
    hideFullscreenText() {
        this.elements.fullscreenText.classList.add('hidden');
        this.elements.fullscreenText.style.pointerEvents = 'none';
        this.elements.fullscreenText.onclick = null;
    },
    
    // === 章节标题（幕布提示） ===
    showChapterTitle(title, subtitle) {
        const el = this.elements.fullscreenText;
        let html = `<div class="chapter-title-main">${title}</div>`;
        if (subtitle) {
            html += `<div class="chapter-title-sub">${subtitle}</div>`;
        }
        el.innerHTML = html;
        el.classList.add('chapter-title-mode');
        el.classList.remove('hidden');
        // 绑定点击事件：全屏层也可点击继续
        el.style.pointerEvents = 'auto';
        el.onclick = () => this.onDialogClick();
    },
    
    hideChapterTitle() {
        const el = this.elements.fullscreenText;
        el.classList.add('hidden');
        el.classList.remove('chapter-title-mode');
        el.style.pointerEvents = 'none';
        el.onclick = null;
        el.innerHTML = '';
    },
    
    // === 结局画面 ===
    showEnding(scene) {
        this.hideIndicator();
        this.elements.dialogText.textContent = '';
        this.elements.speakerName.textContent = '';
        
        if (scene.endingBg) {
            this.elements.sceneBg.style.backgroundImage = `url(${scene.endingBg})`;
        }
        if (scene.endingOverlay) {
            this.elements.colorOverlay.className = 'color-overlay ' + scene.endingOverlay;
        }
        
        this.elements.characterImg.classList.add('hidden');
        
        const endingText = scene.endingText || '';
        const subText = scene.endingSub || '';
        
        this.showFullscreenText(endingText, subText);
        
        // 结束后可以点击回到标题
        setTimeout(() => {
            document.addEventListener('click', function goTitle() {
                document.removeEventListener('click', goTitle);
                Engine.showScreen('title');
            }, { once: true });
        }, 2000);
    },
    
    // === 存档系统 ===
    showSavePanel(mode) {
        this.elements.savePanel.classList.remove('hidden');
        this.renderSaveSlots(mode);
    },
    
    hideSavePanel() {
        this.elements.savePanel.classList.add('hidden');
    },
    
    renderSaveSlots(mode) {
        const slots = SaveSystem.getAll();
        let html = '';
        
        for (let i = 0; i < 5; i++) {
            const slot = slots[i];
            if (slot && slot.nodeId) {
                const date = new Date(slot.timestamp);
                const timeStr = `${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
                const progress = slot.progress || '游戏中';
                html += `
                    <div class="save-slot">
                        <div class="save-slot-info">
                            <div class="save-slot-name">存档 ${i + 1}</div>
                            <div class="save-slot-detail">${progress}</div>
                            <div class="save-slot-time">${timeStr}</div>
                        </div>
                        <div class="save-slot-actions">
                            ${mode === 'load' ? 
                                `<button class="save-slot-btn" onclick="Engine.loadSlotConfirm(${i})">读取</button>` :
                                `<button class="save-slot-btn save" onclick="Engine.saveSlotConfirm(${i})">覆盖保存</button>`
                            }
                            <button class="save-slot-btn delete" onclick="Engine.deleteSlotConfirm(${i}, '${mode}')">删除</button>
                        </div>
                    </div>`;
            } else {
                html += `
                    <div class="save-slot empty">
                        <div class="save-slot-info">
                            <div class="save-slot-name">存档 ${i + 1}</div>
                            <div class="save-slot-detail">— 空 —</div>
                        </div>
                        ${mode === 'save' && GameState.gamePhase !== 'title' ? 
                            `<button class="save-slot-btn save" onclick="Engine.saveSlotConfirm(${i})">保存到此</button>` :
                            ''
                        }
                    </div>`;
            }
        }
        
        this.elements.saveSlots.innerHTML = html;
        this._saveMode = mode;
    },
    
    // 带确认的保存
    saveSlotConfirm(index) {
        this.showConfirm('确定保存到存档 ' + (index + 1) + ' 吗？', () => {
            if (SaveSystem.save(index)) {
                this.renderSaveSlots(this._saveMode || 'save');
            }
        });
    },
    
    // 带确认的读取
    loadSlotConfirm(index) {
        const saved = SaveSystem.load(index);
        if (!saved) return;
        this.showConfirm('确定读取存档 ' + (index + 1) + ' 吗？当前未保存的进度将丢失。', () => {
            this.hideSavePanel();
            this.showScreen('game');
            this.loadFromSave(saved);
        });
    },
    
    // 带确认的删除
    deleteSlotConfirm(index, mode) {
        this.showConfirm('确定删除存档 ' + (index + 1) + ' 吗？此操作不可撤销。', () => {
            SaveSystem.delete(index);
            this.renderSaveSlots(mode);
        });
    },
    
    // === 确认对话框 ===
    showConfirm(message, onYes) {
        this.elements.confirmMessage.textContent = message;
        this.elements.confirmDialog.classList.remove('hidden');
        
        this.elements.btnConfirmYes.onclick = () => {
            this.hideConfirm();
            if (onYes) onYes();
        };
        
        this.elements.btnConfirmNo.onclick = () => {
            this.hideConfirm();
        };
    },
    
    hideConfirm() {
        this.elements.confirmDialog.classList.add('hidden');
    },
    
    // === 游戏中弹出说明面板 ===
    showAboutInGame(nextNodeId) {
        this.elements.aboutPanel.classList.remove('hidden');
        this._aboutNextNode = nextNodeId;
    },
    
    // === 暂停菜单 ===
    showPauseMenu() {
        this.elements.pauseMenu.classList.remove('hidden');
    },
    
    hidePauseMenu() {
        this.elements.pauseMenu.classList.add('hidden');
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    Engine.init();
});
