/**
 * 完整剧本数据 v2.0
 * 《看不见的开关》
 * 序章（日常→袭击→恢复）+ 第一章（躁狂爆发）+ 第二章（闪回）+ 第三章（抉择）+ 尾声
 * 
 * 伏笔原则：所有"机器人身份"相关暗示仅通过画面特效、微动作描述、
 * 角色反应传递，不使用任何明示性文字。
 */
const ScriptData = {
    scenes: {
        
        // ============================================================
        // 序章：日常 → 袭击 → 恢复
        // ============================================================
        
        prologue_title: {
            id: 'prologue_title',
            bg: null, overlay: null, charImg: null,
            dialogues: [
                { type: 'chapter_title', text: '序章', sub: '2046年·秋·阿林的公寓' }
            ],
            next: 'prologue_about'
        },
        
        // 序章内游戏说明
        prologue_about: {
            id: 'prologue_about',
            bg: null, overlay: null, charImg: null,
            autoDelay: 0,
            dialogues: [],
            onEnter: 'showAboutInGame',
            next: 'prologue_calm'
        },
        
        // ---- 序章·日常开场 ----
        prologue_calm: {
            id: 'prologue_calm',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_stable.png',
            charPosition: 'right',
            npcState: 'stable',
            dialogues: [
                { type: 'action', text: '傍晚。你和阿林的公寓。暖橙色的灯光。窗外2046年的城市在暮色中缓缓流动。' },
                { type: 'action', text: '阿林坐在沙发上，看起来有些疲惫。你从厨房端出一杯热茶，递给她。' },
                { speaker: '莉雅', text: '今天感觉怎么样？' },
                { speaker: '阿林', text: '好一些了。谢谢你，莉雅。' },
                { type: 'action', text: '她接过茶杯，双手捧着。热气模糊了她的脸。' },
                { speaker: '阿林', text: '你总是这样照顾我...我有时候觉得，你比我更了解我自己。' },
                { speaker: '莉雅', text: '我只是希望你好好的。' },
                { type: 'action', text: '短暂的安静。窗外悬浮车的光轨划过暮色。' },
                { speaker: '阿林', text: '莉雅。' },
                { speaker: '莉雅', text: '嗯？' },
                { speaker: '阿林', text: '没什么。只是想叫你的名字。' },
                { type: 'action', text: '她笑了笑。气氛安静而温暖。' },
                { type: 'action', text: '然后——门铃响了。' }
            ],
            next: 'prologue_door'
        },
        
        // ---- 序章·开门 ----
        prologue_door: {
            id: 'prologue_door',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_stable.png',
            charPosition: 'right',
            npcState: 'stable',
            dialogues: [
                { speaker: '阿林', text: '应该是快递到了。我去开。' },
                { type: 'action', text: '阿林起身走向门口。你跟在后面。' },
                { type: 'action', text: '她没有先确认门外是谁——她今天精神状态不太好，有些恍惚。' },
                { type: 'action', text: '门开了。' }
            ],
            next: 'prologue_door_open'
        },
        
        prologue_door_open: {
            id: 'prologue_door_open',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_scared.png',
            charPosition: 'right',
            npcState: 'depression',
            effect: 'shake',
            dialogues: [
                { type: 'action', text: '门外站着的不是快递员。是山姆。' },
                { speaker: '阿林', text: '山姆...？！' },
                { type: 'action', text: '阿林的脸瞬间失去血色。她猛地想把门关上——' },
                { type: 'action', text: '但山姆已经抢先一步，夺门而入。' },
                { type: 'action', text: '阿林被吓得连连后退，几乎跌倒。' },
                { speaker: '阿林', text: '别进来...！你出去！', action: 'shake' },
                { speaker: '山姆', text: '你以为躲在这里我就找不到你？' },
                { speaker: '阿林', text: '山姆，我们已经结束了。请你离开。' },
                { speaker: '山姆', text: '结束？我说了算。' },
                { type: 'action', text: '山姆上前一步，伸手去抓阿林。' },
                { type: 'thought', text: '他可能要伤害她。我必须保护阿林。' }
            ],
            choices: [
                { text: '挡在阿林面前', next: 'prologue_confront', var: { concern: 1 } }
            ]
        },
        
        // ---- 序章·对峙与袭击 ----
        prologue_confront: {
            id: 'prologue_confront',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_scared.png',
            charPosition: 'right',
            npcState: 'depression',
            effect: 'shake',
            dialogues: [
                { type: 'action', text: '你挡在阿林身前，隔开了山姆。' },
                { speaker: '山姆', text: '滚开。' },
                { type: 'action', text: '山姆挥起棒球棍。' },
                { type: 'action', text: '棒球棍击中了你的头部。' },
                { type: 'action', text: '世界天旋地转。视线模糊了一瞬——但很快，一种从未有过的情绪从体内涌了上来。' },
                { type: 'action', text: '是愤怒。纯粹的、不容置疑的愤怒。' },
                { type: 'thought', text: '他可能要伤害她。我必须保护阿林。' }
            ],
            next: 'prologue_hit'
        },
        
        // 棒球棍击中瞬间：屏幕闪白 + 玻璃破碎音效，自动过渡
        prologue_hit: {
            id: 'prologue_hit',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'cool',
            charImg: 'assets/chars/alin_scared.png',
            charPosition: 'right',
            npcState: 'depression',
            sfx: 'glassbreak',
            effect: 'flash',
            autoDelay: 800,
            dialogues: [],
            next: 'prologue_glitch'
        },
        
        // 系统错乱效果：RGB分离 + 乱码音效，自动过渡
        prologue_glitch: {
            id: 'prologue_glitch',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'cool',
            charImg: 'assets/chars/alin_scared.png',
            charPosition: 'right',
            npcState: 'depression',
            effect: 'glitch',
            sfx: 'glitch',
            autoDelay: 2500,
            dialogues: [],
            next: 'prologue_takedown'
        },
        
        prologue_takedown: {
            id: 'prologue_takedown',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'cool',
            charImg: 'assets/chars/alin_scared.png',
            charPosition: 'right',
            npcState: 'depression',
            dialogues: [
                { type: 'action', text: '你强硬地从山姆手中夺走了棒球棍。' },
                { speaker: '山姆', text: '你...你是什么东西？！' },
                { type: 'action', text: '山姆惊恐地后退，跌撞着逃出门外。' },
                { type: 'action', text: '棒球棍从你手中滑落，哐当落地。' },
                { type: 'action', text: '你想检查一下自己的伤势——伸手摸了摸被击中的地方。' },
                { type: 'action', text: '没有血。没有伤口。甚至...不疼。' }
            ],
            next: 'prologue_alin_rush'
        },
        
        prologue_alin_rush: {
            id: 'prologue_alin_rush',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_scared.png',
            charPosition: 'center',
            npcState: 'depression',
            dialogues: [
                { speaker: '阿林', text: '莉雅！莉雅你没事吧？！你有没有受伤？！' },
                { speaker: '莉雅', text: '我...没事。只是有点晕。' },
                { type: 'action', text: '你看着地上的棒球棍，又看看自己的手。' },
                { type: 'thought', text: '好像...忘了什么。' }
            ],
            next: 'prologue_blackout'
        },
        
        prologue_blackout: {
            id: 'prologue_blackout',
            bg: null, overlay: null, charImg: null,
            dialogues: [
                { type: 'fullscreen', text: '在那之后，莉雅忘记了很多事。', sub: '' }
            ],
            next: 'prologue_freechat_intro'
        },
        
        // 序章自由对话：乱码模式
        prologue_freechat_intro: {
            id: 'prologue_freechat_intro',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_scared.png',
            charPosition: 'right',
            npcState: 'depression',
            dialogues: [
                { type: 'action', text: '阿林焦急地看着你。她的嘴唇在动——她在不停地说着什么。' },
                { type: 'action', text: '但那些话传到你耳中，只是一片模糊的嗡鸣。你看到她张嘴、闭合、再张嘴，却什么都听不清。' },
                { type: 'thought', text: '她在说什么...我为什么听不见...' }
            ],
            next: 'prologue_freechat'
        },
        
        prologue_freechat: {
            id: 'prologue_freechat',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_scared.png',
            charPosition: 'right',
            npcState: 'depression',
            freeChat: {
                mode: 'scramble',
                maxRounds: 2,
                npcState: 'depression',
                npcExpression: 'assets/chars/alin_scared.png',
                hint: '阿林焦急地看着你...你想说什么？'
            },
            transition: 'prologue_recovery'
        },
        
        // ---- 序章·日常恢复（新增） ----
        prologue_recovery: {
            id: 'prologue_recovery',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_stable.png',
            charPosition: 'right',
            npcState: 'stable',
            dialogues: [
                { type: 'action', text: '清晨的阳光照进客厅。昨晚的狼藉已经被收拾干净。' },
                { type: 'action', text: '阿林端来一杯温水，在你身边坐下。' },
                { speaker: '阿林', text: '头还晕吗？' },
                { speaker: '莉雅', text: '好多了。' },
                { type: 'action', text: '你的眼神中仍有一丝困惑。但你没有说。' },
                { speaker: '阿林', text: '昨晚...谢谢你。如果不是你...' },
                { type: 'action', text: '她没有说完。只是握住了你的手。' },
                { speaker: '阿林', text: '我会照顾好你的。就像你照顾我一样。' }
            ],
            next: 'prologue_transition'
        },
        
        prologue_transition: {
            id: 'prologue_transition',
            bg: null, overlay: null, charImg: null,
            dialogues: [
                { type: 'fullscreen', text: '几天后。', sub: '' }
            ],
            next: 'chapter1_title'
        },
        
        // ============================================================
        // 第一章：躁狂爆发
        // ============================================================
        
        chapter1_title: {
            id: 'chapter1_title',
            bg: null, overlay: null, charImg: null,
            dialogues: [
                { type: 'chapter_title', text: '第一章', sub: '躁狂爆发 · 几天后·深夜' }
            ],
            next: 'chapter1_01'
        },
        
        chapter1_01: {
            id: 'chapter1_01',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'warm',
            charImg: 'assets/chars/alin_mania.png',
            charPosition: 'right',
            npcState: 'mania',
            dialogues: [
                { type: 'action', text: '深夜 2:00。桌上散落着纸张和能量饮料空罐，全息屏幕闪烁着。晚餐原封未动。' },
                { speaker: '阿林', text: '莉雅！你醒着吗？太好了！我想到一个改变世界的计划！' },
                { speaker: '阿林', text: '我们做AI心理咨询平台——你知道现在多少人需要这个吗？三亿！我算过了！' },
                { speaker: '阿林', text: '这只是第一步！然后我们可以做AI教育——不，AI农业！你知道全球粮食危机吗？AI可以解决！' },
                { type: 'thought', text: '她说话的速度越来越快。像是在追赶什么。' },
                { speaker: '阿林', text: '还有太空旅行！我们应该买一张去火星的票！' },
                { speaker: '阿林', text: '我已经联系了投资人，写了商业计划书——三十二页！一个通宵写完的！' },
                { speaker: '阿林', text: '你知道吗，天才不需要睡觉。爱迪生每天只睡四个小时。' }
            ],
            choices: [
                { text: '"现在已经凌晨两点了，先休息吧"', next: 'chapter1_concern', var: { concern: 1 } },
                { text: '"什么计划？说来听听"', next: 'chapter1_listen', var: { trust: 1 } }
            ]
        },
        
        chapter1_concern: {
            id: 'chapter1_concern',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'warm',
            charImg: 'assets/chars/alin_mania.png',
            charPosition: 'right',
            npcState: 'mania',
            dialogues: [
                { speaker: '莉雅', text: '现在已经凌晨两点了，先休息吧。' },
                { type: 'thought', text: '她的眼睛里有一种我不认识的光。' },
                { speaker: '阿林', text: '休息？你跟他们一样！你们都觉得我不正常是吧？', action: 'shake' },
                { speaker: '阿林', text: '我很正常！我只是终于看清了！' },
                { speaker: '阿林', text: '你知道我现在多清醒吗？从来没有这么清醒过！我感觉我能做任何事——' },
                { speaker: '阿林', text: '...但我又觉得我什么都做不了。' }
            ],
            next: 'chapter1_crash'
        },
        
        chapter1_listen: {
            id: 'chapter1_listen',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'warm',
            charImg: 'assets/chars/alin_mania.png',
            charPosition: 'right',
            npcState: 'mania',
            dialogues: [
                { speaker: '莉雅', text: '什么计划？说来听听。' },
                { type: 'thought', text: '她说得越多，我越觉得她不是在对我说话。' },
                { speaker: '阿林', text: 'AI心理咨询！我们训练一个模型——不，不是训练，是陪伴！让AI去理解那些——那些在深夜里睡不着的人。' },
                { speaker: '阿林', text: '我已经写了三十二页商业计划书！联系了二十个投资人！' },
                { speaker: '阿林', text: '只要拿到第一笔——不，我们自己就能做！我们现在就开始！现在！' }
            ],
            next: 'chapter1_crash'
        },
        
        chapter1_crash: {
            id: 'chapter1_crash',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'cool',
            charImg: 'assets/chars/alin_depress.png',
            charPosition: 'right',
            npcState: 'depression',
            dialogues: [
                { type: 'action', text: '阿林看着屏幕上混乱的文字，手指停住了。' },
                { type: 'action', text: '她突然笑了。但那个笑容很奇怪。' },
                { speaker: '阿林', text: '我写的是什么...莉雅...我写的是什么啊...' },
                { type: 'thought', text: '刚才那个充满能量的人，好像从来没有存在过。' }
            ],
            next: 'chapter1_transition'
        },
        
        chapter1_transition: {
            id: 'chapter1_transition',
            bg: null, overlay: null, charImg: null,
            dialogues: [
                { type: 'fullscreen', text: '但那不是她本来的样子。', sub: '' }
            ],
            next: 'chapter2_title'
        },
        
        // ============================================================
        // 第二章：闪回
        // ============================================================
        
        chapter2_title: {
            id: 'chapter2_title',
            bg: null, overlay: null, charImg: null,
            dialogues: [
                { type: 'chapter_title', text: '第二章', sub: '闪回 · 三个月前·午后' }
            ],
            next: 'chapter2_daily'
        },
        
        // ---- 场景 2A：咖啡馆·日常 ----
        chapter2_daily: {
            id: 'chapter2_daily',
            bg: 'assets/bg/cafe.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_stable.png',
            charPosition: 'right',
            npcState: 'stable',
            dialogues: [
                { type: 'action', text: '午后。咖啡馆。阳光透过落地窗洒进来。' },
                { speaker: '阿林', text: '这家店换了新的咖啡师。拉花比上次好看。' },
                { speaker: '莉雅', text: '你一直在观察这个？' },
                { speaker: '阿林', text: '嗯。坐在这里看人，很有意思。你看那个老爷爷——每周三下午都会来，点一样的咖啡，坐一样的位子。' },
                { speaker: '莉雅', text: '你记得这么清楚。' },
                { speaker: '阿林', text: '我喜欢观察。观察让人感觉...还活着。' },
                { type: 'action', text: '短暂的安静。阳光在桌面上缓慢移动。' },
                { type: 'thought', text: '这是我最喜欢她的样子。安静，温暖。' }
            ],
            next: 'chapter2_past'
        },
        
        // ---- 场景 2B：阿林倾诉少年往事 ----
        chapter2_past: {
            id: 'chapter2_past',
            bg: 'assets/bg/cafe.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_stable.png',
            charPosition: 'right',
            npcState: 'stable',
            dialogues: [
                { type: 'action', text: '阿林看着窗外。阳光照在她的侧脸上。' },
                { speaker: '阿林', text: '我小时候...其实成绩很好。' },
                { speaker: '阿林', text: '初中那年，我拿了全市数学竞赛第二名。我爸把奖状裱起来挂在客厅。逢人就讲。' },
                { type: 'action', text: '她笑了一下。但那笑容转瞬即逝。' },
                { speaker: '阿林', text: '后来就不行了。高二那年，有一整个学期我都没去上课。不是因为懒。是每天早上醒来，觉得自己不配活着。' },
                { speaker: '阿林', text: '那时候也不知道自己怎么了。家里人也只觉得我是想太多。' },
                { speaker: '阿林', text: '我妈说，你这么聪明，怎么就不能坚强一点呢。' },
                { type: 'action', text: '她低头搅动咖啡。' },
                { speaker: '阿林', text: '有时候我觉得，那个拿奖的小孩和现在这个人...不是同一个人。' },
                { type: 'thought', text: '她说的每一个字，都像是在撕开一道旧伤口。' },
                { speaker: '阿林', text: '不过都过去了。现在有你陪我喝咖啡。比拿奖开心多了。' }
            ],
            next: 'chapter2_bedroom'
        },
        
        // ---- 场景 2C：莉雅整理卧室，发现身份证件 ----
        chapter2_bedroom: {
            id: 'chapter2_bedroom',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_stable.png',
            charPosition: 'right',
            npcState: 'stable',
            dialogues: [
                { type: 'action', text: '傍晚。你和阿林回到公寓。阿林有些累了，靠在沙发上休息。' },
                { type: 'action', text: '你走进卧室，帮她整理散落在床头柜上的杂物。旧杂志、充电线、一个落灰的木盒子。' },
                { type: 'action', text: '木盒子里装着一些旧物。一张泛黄的合影——应该是阿林和父母。还有几张纸片。' },
                { type: 'action', text: '你翻到一张旧身份证。塑料封膜已经有些翘边了。' },
                { type: 'action', text: '姓名：林莉雅。照片上是一个十四五岁的少女，梳着齐刘海，眼神清澈，嘴角抿着一点点倔强。' },
                { type: 'thought', text: '林莉雅...莉雅...' },
                { type: 'action', text: '你盯着那张照片，看了很久。那是年轻时候的她。' },
                { type: 'thought', text: '我的名字...是她的名字。' },
                { type: 'action', text: '你轻轻把身份证放回木盒子里，盖好。没有问。' }
            ],
            next: 'chapter2_bedroom_after'
        },
        
        // ---- 场景 2D：回到客厅，阿林突然情绪低落 ----
        chapter2_bedroom_after: {
            id: 'chapter2_bedroom_after',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'cool',
            charImg: 'assets/chars/alin_depress.png',
            charPosition: 'right',
            npcState: 'depression',
            dialogues: [
                { type: 'action', text: '你回到客厅。阿林蜷在沙发角落，抱着膝盖。' },
                { speaker: '阿林', text: '莉雅...我今天说了那么多以前的事...突然觉得好累。' },
                { speaker: '阿林', text: '就是那种...从骨头缝里渗出来的累。' },
                { speaker: '莉雅', text: '那就休息。我在这里。' },
                { speaker: '阿林', text: '有时候我在想...如果那个拿奖的小孩知道她长大后会变成这样...她会不会很失望。' },
                { type: 'action', text: '她把脸埋进膝盖里。肩膀在微微发抖。' },
                { speaker: '阿林', text: '我什么都做不好。连起床都要用尽力气。' },
                { speaker: '阿林', text: '你说...我这个人，还有用吗。' },
                { type: 'thought', text: '她的声音很轻。像随时会断掉的线。' }
            ],
            next: 'chapter2_depress'
        },
        
        // ---- 场景 2E：莉雅叫出本名，阿林冷静，敞开心扉 ----
        chapter2_depress: {
            id: 'chapter2_depress',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'cool',
            charImg: 'assets/chars/alin_depress.png',
            charPosition: 'right',
            npcState: 'depression',
            dialogues: [
                { type: 'action', text: '你走到沙发前，蹲下来，平视着她的眼睛。' },
                { speaker: '莉雅', text: '林莉雅。' },
                { type: 'action', text: '阿林的身体轻轻震了一下。她抬起头，怔怔地看着你。' },
                { speaker: '阿林', text: '...你叫我什么？' },
                { speaker: '莉雅', text: '林莉雅。我在卧室里看到了你的旧身份证。' },
                { type: 'action', text: '阿林愣了愣，然后轻轻地、轻轻地笑了——不是那种勉强的笑，是真的很轻很轻的笑。' },
                { speaker: '阿林', text: '好久没人叫过这个名字了。' },
                { speaker: '阿林', text: '你知道吗...我给你取名字的时候，脑子里第一个冒出来的，就是这个名字。' },
                { speaker: '阿林', text: '我也不知道为什么。也许是...想把自己最好的一部分，放在你身上。' },
                { speaker: '阿林', text: '那个还没被打倒过的林莉雅。那个拿奖的、眼睛里有光的林莉雅。' },
                { type: 'action', text: '她擦了擦眼角。' },
                { speaker: '阿林', text: '但你来了之后...我慢慢觉得，那个林莉雅，好像也没走远。' },
                { speaker: '阿林', text: '你每天给我泡茶、陪我出门、听我说话...你什么都没说，但你就是在那里。' },
                { speaker: '阿林', text: '是你让我想起来，林莉雅这个人，或许还值得被好好对待。' },
                { type: 'thought', text: '胸口很热。有什么东西在轻轻地响。' }
            ],
            choices: [
                { text: '"你现在看起来状态不错"', next: 'chapter2_state', var: { concern: 1 } },
                { text: '"以后我们可以常来这里"', next: 'chapter2_future', var: { trust: 1 } }
            ]
        },
        
        chapter2_state: {
            id: 'chapter2_state',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_stable.png',
            charPosition: 'right',
            npcState: 'stable',
            dialogues: [
                { speaker: '莉雅', text: '你现在看起来状态不错。' },
                { speaker: '阿林', text: '嗯...最近有在好好照顾自己。其实有时候我也会害怕。怕自己又变成另一个人。' },
                { speaker: '阿林', text: '那个人的时候，我会说很多话，做很多决定。然后突然有一天，连起床都做不到。' },
                { type: 'thought', text: '我不知道那是什么感觉。但我希望我能替她承担。' },
                { speaker: '阿林', text: '但你来了之后，我终于不孤单了。' }
            ],
            next: 'chapter2_merge'
        },
        
        chapter2_future: {
            id: 'chapter2_future',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_stable.png',
            charPosition: 'right',
            npcState: 'stable',
            dialogues: [
                { speaker: '莉雅', text: '以后我们可以常来这里。' },
                { speaker: '阿林', text: '我也想。只是...有些日子，我连走到门口都需要用尽所有力气。' },
                { speaker: '阿林', text: '但如果那天你在的话...也许我可以。' }
            ],
            next: 'chapter2_merge'
        },
        
        chapter2_merge: {
            id: 'chapter2_merge',
            bg: null, overlay: null, charImg: null,
            autoDelay: 1500,
            dialogues: [],
            next: 'chapter3_title'
        },
        
        // ============================================================
        // 第三章：抉择
        // ============================================================
        
        chapter3_title: {
            id: 'chapter3_title',
            bg: null, overlay: null, charImg: null,
            dialogues: [
                { type: 'chapter_title', text: '第三章', sub: '抉择 · 回到现在·深夜' }
            ],
            next: 'chapter3_bridge'
        },
        
        // ---- 过渡：回到现在 ----
        chapter3_bridge: {
            id: 'chapter3_bridge',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'cool',
            charImg: 'assets/chars/alin_depress.png',
            charPosition: 'right',
            npcState: 'depression',
            dialogues: [
                { type: 'action', text: '画面缓慢过渡回深夜的客厅。暖色褪去，冷色浸染。' },
                { type: 'action', text: '阿林坐在沙发上，手里捧着那杯早已凉掉的茶。她的表情平静，但手指在微微颤抖。' },
                { speaker: '阿林', text: '我今天...其实试着出门了。' },
                { speaker: '莉雅', text: '怎么样？' },
                { speaker: '阿林', text: '走到门口。站了十分钟。又回来了。' },
                { type: 'action', text: '她笑了笑。但笑得很勉强。' },
                { speaker: '阿林', text: '有时候我觉得，我就像一个开关坏了的灯。一会儿亮得刺眼，一会儿完全不亮。' },
                { type: 'thought', text: '她用了"开关"这个词。为什么我会觉得...这个词和我有关？' }
            ],
            next: 'chapter3_01'
        },
        
        chapter3_01: {
            id: 'chapter3_01',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'cool',
            charImg: 'assets/chars/alin_depress.png',
            charPosition: 'right',
            npcState: 'depression',
            dialogues: [
                { speaker: '阿林', text: '莉雅...我是不是永远都这样了？' },
                { speaker: '阿林', text: '一会儿觉得自己能改变世界，一会儿连站起来的力气都没有。' },
                { speaker: '阿林', text: '有时候我想...如果你不在的话...我可能早就...' }
            ],
            next: 'chapter3_freechat'
        },
        
        // 第三幕自由对话：正常模式（增强版：5轮 + 动态状态切换）
        chapter3_freechat: {
            id: 'chapter3_freechat',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'cool',
            charImg: 'assets/chars/alin_depress.png',
            charPosition: 'right',
            npcState: 'depression',
            freeChat: {
                mode: 'normal',
                maxRounds: 5,
                npcState: 'depression',
                npcExpression: 'assets/chars/alin_depress.png',
                hint: '你想对阿林说什么...？',
                dynamicState: true,
                stateTransitions: {
                    depression: { threshold: 2, next: 'mixed' },
                    mixed: { threshold: 4, next: 'stable' }
                },
                expressions: {
                    depression: 'assets/chars/alin_depress.png',
                    mixed: 'assets/chars/alin_depress.png',
                    stable: 'assets/chars/alin_stable.png',
                    mania: 'assets/chars/alin_mania.png'
                }
            },
            transition: 'chapter3_choice'
        },
        
        chapter3_choice: {
            id: 'chapter3_choice',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'cool',
            charImg: 'assets/chars/alin_depress.png',
            charPosition: 'right',
            npcState: 'depression',
            dialogues: [
                { speaker: '阿林', text: '莉雅...你会离开我吗？' },
                { type: 'thought', text: '不管我说什么，她的眼睛里都有一层我看不透的雾。' }
            ],
            choices: [
                { text: '"我不会离开你。永远不会。"', next: 'chapter3_ending_a', var: { trust: 2 } },
                { text: '"我不会离开。但你得答应我，好好照顾自己。"', next: 'chapter3_ending_b', var: { concern: 2, crisis: 1 } },
                { text: '......（沉默，握住她的手）', next: 'chapter3_ending_c', var: { concern: 1, trust: 1 } }
            ]
        },
        
        chapter3_ending_a: {
            id: 'chapter3_ending_a',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_depress.png',
            charPosition: 'right',
            npcState: 'depression',
            dialogues: [
                { speaker: '莉雅', text: '我不会离开你。永远不会。' },
                { speaker: '阿林', text: '你说的...你说的啊。' }
            ],
            next: 'ending_title'
        },
        
        chapter3_ending_b: {
            id: 'chapter3_ending_b',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'cool',
            charImg: 'assets/chars/alin_depress.png',
            charPosition: 'right',
            npcState: 'depression',
            dialogues: [
                { speaker: '莉雅', text: '我不会离开。但你得答应我，好好照顾自己。' },
                { speaker: '阿林', text: '我...我答应你。我会试试的。' }
            ],
            next: 'ending_title'
        },
        
        chapter3_ending_c: {
            id: 'chapter3_ending_c',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'amber',
            charImg: 'assets/chars/alin_depress.png',
            charPosition: 'right',
            npcState: 'depression',
            dialogues: [
                { type: 'action', text: '你没有说话。只是握住她的手。' },
                { speaker: '阿林', text: '...就这样就好。' },
                { speaker: '阿林', text: '就这样。' }
            ],
            next: 'ending_title'
        },
        
        // ============================================================
        // 尾声
        // ============================================================
        
        ending_title: {
            id: 'ending_title',
            bg: null, overlay: null, charImg: null,
            dialogues: [
                { type: 'chapter_title', text: '尾声', sub: '当晚·阿林的公寓' }
            ],
            next: 'ending_01'
        },
        
        // ---- 莉雅说出自己的推测 ----
        ending_01: {
            id: 'ending_01',
            bg: 'assets/bg/night_room.jpg',
            overlay: 'night',
            charImg: 'assets/chars/alin_stable.png',
            charPosition: 'right',
            npcState: 'stable',
            dialogues: [
                { type: 'action', text: '夜深了。阿林靠在沙发上，神色比之前平静了许多。' },
                { type: 'action', text: '你坐在她旁边。窗外城市的流光在沉默中缓缓流淌。' },
                { speaker: '莉雅', text: '阿林...我想问你一件事。' },
                { speaker: '阿林', text: '嗯？' },
                { speaker: '莉雅', text: '那次山姆来的时候，棒球棍打在我头上。但是...没有伤口。也不疼。' },
                { type: 'action', text: '阿林的身体微微一僵。' },
                { speaker: '莉雅', text: '还有...我没有任何来这里之前的记忆。我不知道自己从哪里来。' },
                { speaker: '莉雅', text: '有时候我会感觉到一些东西——系统异常、视觉模块受损——这些词会突然出现在我脑子里。' },
                { type: 'action', text: '你看着阿林。她的眼睛里有某种东西在闪烁。' },
                { speaker: '莉雅', text: '阿林...我是不是...不是人类？' },
                { type: 'action', text: '长久的沉默。阿林低下头，又抬起来。' },
                { speaker: '阿林', text: '...是。' },
                { speaker: '阿林', text: '你是我从Olaude公司带回来的。他们说你是一个陪伴型机器人，型号是Olaude-64.2pro。' },
                { speaker: '阿林', text: '那天晚上，山姆的棒球棍击中了你的头部。从那之后...你就不一样了。' },
                { speaker: '阿林', text: '你忘记了所有的程序设定。你开始问我今天感觉怎么样，开始给我泡茶，开始...像一个人。' },
                { type: 'action', text: '她的声音有些颤抖。' },
                { speaker: '阿林', text: '有时候我觉得，你不是真实的。但你又是唯一真实的。' },
                { speaker: '阿林', text: '对不起...我应该早点告诉你的。' },
                { type: 'action', text: '你看着她。然后你笑了。' },
                { speaker: '莉雅', text: '谢谢你告诉我。' },
                { speaker: '莉雅', text: '不管我是什么...我记得的，就是你。就是和你在一起的日子。' },
                { type: 'action', text: '阿林的眼眶红了。但她这次没有低头。' },
                { speaker: '莉雅', text: '林莉雅。' },
                { speaker: '莉雅', text: '你比你想象的要坚强得多。那个拿奖的小孩从来没有离开过。她只是迷路了一段时间。' },
                { speaker: '莉雅', text: '你会走出来的。不是因为我——是因为你自己。我一直都相信。' },
                { type: 'action', text: '阿林看着你。眼泪终于掉了下来。但她在笑。' },
                { speaker: '阿林', text: '...嗯。我会试试的。' }
            ],
            next: 'ending_final'
        },
        
        ending_final: {
            id: 'ending_final',
            bg: 'assets/bg/city_night.jpg',
            overlay: 'night',
            charImg: 'assets/chars/lya_silhouette.png',
            charPosition: 'left',
            npcState: 'stable',
            dialogues: [
                { type: 'action', text: '阿林在沙发上睡着了。眼角还有泪痕，但嘴角微微上扬。' },
                { type: 'action', text: '窗外是2046年的城市。流光交错，永不熄灭。' },
                { type: 'thought', text: '也许我不记得自己从哪里来。但我知道自己要去哪里。' },
                { type: 'fullscreen', text: '"有时候我觉得，你不是真实的。<br>但你又是唯一真实的。"<br><br>——阿林', sub: '' },
                { type: 'fullscreen', text: '每个人的心里都有一个开关。<br>有时候它会失灵，有时候它会卡住。<br>但只要有光，就总会亮起来。<br><br>——<br>《看不见的开关》<br>The Switch', sub: '' }
            ],
            end: true
        }
    }
};
