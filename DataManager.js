// DataManager.js

class DataManager {
    constructor() {
        this.STORAGE_KEY = 'felotusAppData';
        this.appData = {};
        
        this.initialData = {
            userProfiles: [
                { id: 'default', name: '用户', isDefault: true, avatar: 'https://i.imgur.com/uG2g8xX.png', gender: '女', birthday: '', age: '', settings: '', isGlobal: true, boundCharacterId: null }
            ],
            activeUserProfileId: 'default',
            prompts: [
                { id: `prompt_${Date.now()}_1`, name: '聊天默认提示词', settings: { maxContext: 99000, maxResponse: 9000, temperature: 0.75, topP: 0.75, ability: 'auto', mode: 'chat' }},
                { id: `prompt_${Date.now()}_2`, name: '剧情默认提示词', settings: { maxContext: 199000, maxResponse: 30000, temperature: 0.85, topP: 0.85, ability: 'auto', mode: 'story' }}
            ],
            activePromptId: `prompt_${Date.now()}_1`,
            globalSignature: '', 
            characters: [],
            weather: { options: ['☀️', '⛅️', '☁️', '🌧️', '❄️', '⚡️'], selected: '☀️' },
            locations: [],
            status: { options: ['在线', '离开', '请勿打扰', '听歌中', 'emo中', '恋爱中', '睡觉中'], selected: '在线' },
            injectionSettings: { maxContext: 99000, maxResponse: 9000, temperature: 0.75, topP: 0.75, ability: 'auto', mode: 'chat' }
        };
    }

    load() {
        try {
            const savedData = localStorage.getItem(this.STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                // 使用 initialData 作为默认值，防止旧数据缺少新字段
                this.appData = { ...this.initialData, ...parsedData };
                
                // 确保关键数组存在，避免因旧数据格式问题导致错误
                this.appData.userProfiles = parsedData.userProfiles && parsedData.userProfiles.length > 0 
                    ? parsedData.userProfiles 
                    : [...this.initialData.userProfiles];
                this.appData.characters = parsedData.characters || [];
                this.appData.prompts = parsedData.prompts && parsedData.prompts.length > 0
                    ? parsedData.prompts
                    : [...this.initialData.prompts];

            } else {
                this.appData = { ...this.initialData };
                this.save(); // 首次加载时保存初始数据
            }
        } catch (error) {
            console.error('加载数据时出错，将使用初始数据:', error);
            this.appData = { ...this.initialData };
        }
        // 为了兼容性，暂时将数据挂载到 window，后续可以移除
        window.appData = this.appData; 
    }

    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.appData));
        } catch (error) {
            console.error('保存数据时出错:', error);
        }
    }

    getActiveUserProfile() {
        return this.appData.userProfiles.find(p => p.id === this.appData.activeUserProfileId) || this.appData.userProfiles[0];
    }
    
    getCharacters() {
        return this.appData.characters || [];
    }

    // 我们可以将所有 localStorage 操作集中到这里
    loadChatHistoryFromStorage() {
        return localStorage.getItem('felotus_chat_history');
    }

    saveChatHistoryToStorage(allChats) {
        localStorage.setItem('felotus_chat_history', JSON.stringify(allChats));
    }
}