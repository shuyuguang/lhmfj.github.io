// script.js (重构后)

class ChatManager {
    constructor(dataManager) {
        this.dataManager = dataManager; // 依赖注入
        this.currentCharacterId = null;
        this.currentCharacter = null;
        this.currentUserProfile = null;
        this.chatHistory = [];
        this.allChats = {};
        this.isAITyping = false;
        
        this.chatArea = null;
        this.chatInput = null;
        this.sendButton = null;
        this.headerName = null;
        this.chatPage = null;
        this.chatInputBar = null;
    }

    init() {
        this.chatArea = document.querySelector('#page-chat-interface .chat-area');
        this.chatInput = document.getElementById('chat-textarea');
        this.sendButton = document.getElementById('chat-send-btn');
        this.headerName = document.getElementById('chat-interface-char-name');
        this.chatPage = document.getElementById('page-chat-interface');
        this.chatInputBar = document.querySelector('#page-chat-interface .chat-input-bar');

        this.loadChatHistory();
        this.setupChatInterface();
        this.bindEvents();
    }

    // ===== 数据管理 =====
    loadChatHistory() {
        const saved = this.dataManager.loadChatHistoryFromStorage();
        if (saved) {
            try { this.allChats = JSON.parse(saved); } catch (e) { this.allChats = {}; }
        }
    }

    saveChatHistory() {
        this.dataManager.saveChatHistoryToStorage(this.allChats);
    }

    // ===== 聊天界面管理 =====
    openChat(characterId, characterData, userProfile) {
        this.currentCharacterId = characterId;
        this.currentCharacter = characterData;
        this.currentUserProfile = userProfile;
        
        this.chatHistory = this.allChats[characterId] || [];
        
        if (this.chatHistory.length === 0) {
            this.addWelcomeMessage();
        }
        
        this.renderChatHistory();
        this.updateChatHeader();
        if(this.chatPage) this.chatPage.classList.add('active');
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            id: Date.now(),
            type: 'received',
            content: '你好呀！我们已经是好友了，现在开始聊天吧！',
            timestamp: new Date().toISOString(),
            avatar: this.currentCharacter.avatar
        };
        this.chatHistory.push(welcomeMessage);
        this.saveCurrentChat();
    }

    // ===== 消息处理 =====
    async sendMessage(content) {
        if (!content.trim() || !this.currentCharacterId || this.isAITyping) return;

        const messageContext = {
            character: this.currentCharacter,
            userProfile: this.currentUserProfile,
            chatHistory: [...this.chatHistory]
        };

        const userMessage = {
            id: Date.now(),
            type: 'sent',
            content: content.trim(),
            timestamp: new Date().toISOString(),
            avatar: messageContext.userProfile.avatar
        };

        this.chatHistory.push(userMessage);
        this.saveCurrentChat();
        this.appendMessageToUI(userMessage);
        
        if (this.chatInput) {
            this.chatInput.value = '';
            const event = new Event('input', { bubbles: true });
            this.chatInput.dispatchEvent(event);
        }

        this.showTypingIndicator();
        this.isAITyping = true;

        try {
            const aiResponse = await this.callAI(content, messageContext); 
            const aiMessage = {
                id: Date.now() + 1,
                type: 'received',
                content: aiResponse,
                timestamp: new Date().toISOString(),
                avatar: messageContext.character.avatar
            };
            this.chatHistory.push(aiMessage);
            this.saveCurrentChat();
            this.hideTypingIndicator();
            this.appendMessageToUI(aiMessage);
        } catch (error) {
            console.error('AI调用失败:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'received',
                content: `抱歉，我现在无法回复。\n错误: ${error.message}`,
                timestamp: new Date().toISOString(),
                avatar: messageContext.character.avatar,
                isError: true
            };
            this.hideTypingIndicator();
            this.appendMessageToUI(errorMessage);
        } finally {
            this.isAITyping = false;
        }
    }

    // ===== AI接口调用 =====
    async callAI(userMessage, messageContext) {
        const apiSettings = this.getAPISettings();
        if (!apiSettings || !apiSettings.apiKey || !apiSettings.model) {
            throw new Error('API配置不完整');
        }

        const prompt = this.buildPrompt(userMessage, messageContext);
        
        if (apiSettings.type === 'openai') {
            return await this.callOpenAI(apiSettings, prompt);
        } else if (apiSettings.type === 'gemini') {
            return await this.callGemini(apiSettings, prompt);
        } else {
            throw new Error('不支持的API类型');
        }
    }

    buildPrompt(userMessage, messageContext) {
        const { character, userProfile, chatHistory } = messageContext;

        let systemPrompt = '';
        if (character?.settings) {
            systemPrompt += `# 角色设定\n${character.settings}\n\n`;
        } else {
            systemPrompt += `# 角色设定\n你是${character.name}，请保持角色的一致性。\n\n`;
        }
        if (userProfile?.settings) {
            systemPrompt += `# 用户设定\n${userProfile.settings}\n\n`;
        }
        systemPrompt += `# 基本信息\n角色名: ${character.name}\n`;
        if (character.gender) systemPrompt += `角色性别: ${character.gender}\n`;
        if (character.age) systemPrompt += `角色年龄: ${character.age}\n`;
        systemPrompt += `用户名: ${userProfile.name}\n`;
        if (userProfile.gender) systemPrompt += `用户性别: ${userProfile.gender}\n`;
        if (userProfile.age) systemPrompt += `用户年龄: ${userProfile.age}\n\n`;

        const recentHistory = chatHistory.slice(-8);
        if (recentHistory.length > 1) {
            systemPrompt += `# 对话历史\n`;
            recentHistory.slice(0, -1).forEach(msg => {
                const speaker = msg.type === 'sent' ? userProfile.name : character.name;
                systemPrompt += `${speaker}: ${msg.content}\n`;
            });
            systemPrompt += `\n`;
        }
        systemPrompt += `请以${character.name}的身份回复${userProfile.name}的消息，保持角色一致性。\n\n`;
        systemPrompt += `${userProfile.name}: ${userMessage}`;
        return systemPrompt;
    }

    async callOpenAI(apiSettings, prompt) {
        const injectSettings = this.getInjectSettings();
        const response = await fetch(`${apiSettings.apiUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiSettings.apiKey}`
            },
            body: JSON.stringify({
                model: apiSettings.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: injectSettings.temperature || 0.7,
                max_tokens: injectSettings.maxResponse || 2000,
                top_p: injectSettings.topP || 0.9,
            })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
             throw new Error('OpenAI API返回格式错误');
        }
        return data.choices[0].message.content.trim();
    }

    async callGemini(apiSettings, prompt) {
        const injectSettings = this.getInjectSettings();
        const response = await fetch(
            `${apiSettings.apiUrl}/models/${apiSettings.model}:generateContent?key=${apiSettings.apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: injectSettings.temperature || 0.7,
                        maxOutputTokens: injectSettings.maxResponse || 2000,
                        topP: injectSettings.topP || 0.9
                    }
                })
            }
        );
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Gemini API返回格式错误');
        }
        return data.candidates[0].content.parts[0].text.trim();
    }

    // ===== UI界面更新 =====
    renderChatHistory() {
        if (!this.chatArea) return;
        this.chatArea.innerHTML = '';
        this.chatHistory.forEach(message => { this.appendMessageToUI(message, false); });
        this.scrollToBottom();
    }

    appendMessageToUI(message, shouldScroll = true) {
        if (!this.chatArea) return;
        const messageElement = this.createMessageElement(message);
        this.chatArea.appendChild(messageElement);
        if (shouldScroll) this.scrollToBottom();
    }

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble ${message.type} ${message.isError ? 'error' : ''}`;
        messageDiv.dataset.messageId = message.id;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        const textP = document.createElement('p');
        textP.textContent = message.content;
        contentDiv.appendChild(textP);

        if (message.type === 'received') {
            const avatar = document.createElement('img');
            avatar.src = message.avatar || 'https://i.imgur.com/Jz9v5aB.png';
            avatar.alt = 'avatar';
            avatar.className = 'message-avatar';
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(contentDiv);
        } else if (message.type === 'sent') {
            const avatar = document.createElement('img');
            avatar.src = this.currentUserProfile.avatar || 'https://i.imgur.com/uG2g8xX.png';
            avatar.alt = 'avatar';
            avatar.className = 'message-avatar';
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(avatar);
        }
        
        return messageDiv;
    }

    showTypingIndicator() {
        if (!this.chatArea) return;
        const existingIndicator = this.chatArea.querySelector('.typing-indicator');
        if (existingIndicator) existingIndicator.remove();

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message-bubble received typing-indicator';
        typingDiv.innerHTML = `
            <img src="${this.currentCharacter.avatar}" alt="avatar" class="message-avatar">
            <div class="message-content">
                <p>正在输入<span class="typing-dots">...</span></p>
            </div>
        `;
        this.chatArea.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        if (!this.chatArea) return;
        const typingIndicator = this.chatArea.querySelector('.typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }

    updateChatHeader() {
        if (this.headerName && this.currentCharacter) {
            this.headerName.textContent = this.currentCharacter.name;
        }
    }

    scrollToBottom() {
        if (this.chatArea) {
            setTimeout(() => { this.chatArea.scrollTop = this.chatArea.scrollHeight; }, 100);
        }
    }

    // ===== 事件绑定 =====
    setupChatInterface() {
        if (this.chatInput) {
            this.chatInput.addEventListener('focus', () => {
                if (this.chatPage) {
                    this.chatPage.classList.add('keyboard-active');
                    this.scrollToBottom();
                }
            });

            this.chatInput.addEventListener('blur', () => {
                if (this.chatPage) {
                    this.chatPage.classList.remove('keyboard-active');
                }
            });

            this.chatInput.addEventListener('input', () => {
                const textarea = this.chatInput;
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
                const maxHeight = parseInt(getComputedStyle(textarea).maxHeight, 10);
                if (textarea.scrollHeight >= maxHeight) {
                    textarea.style.overflowY = 'auto';
                } else {
                    textarea.style.overflowY = 'hidden';
                }
            });

            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const message = this.chatInput.value.trim();
                    if (message && !this.isAITyping) {
                        this.sendMessage(message);
                    }
                }
            });
        }

        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => {
                const message = this.chatInput.value.trim();
                if (message && !this.isAITyping) {
                    this.sendMessage(message);
                }
            });
        }
    }

    bindEvents() {
        document.body.addEventListener('click', (e) => {
            const chatItem = e.target.closest('.chat-item[data-char-id]');
            if (chatItem) {
                const mainChatList = document.querySelector('#page-messages .chat-list');
                if (mainChatList && mainChatList.contains(chatItem)) {
                    const charId = chatItem.dataset.charId;
                    const character = this.dataManager.appData.characters.find(c => c.id == charId);
                    const userProfile = this.dataManager.getActiveUserProfile();
                    if (character && userProfile) {
                        this.openChat(charId, character, userProfile);
                    }
                }
            }
        });

        const menuBtn = document.getElementById('chat-interface-menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                if (!this.currentCharacterId) return;
                this.openChatSettings();
            });
        }
    }
    
    // ===== 辅助方法 =====
    saveCurrentChat() {
        if (this.currentCharacterId) {
            this.allChats[this.currentCharacterId] = this.chatHistory;
            this.saveChatHistory();
        }
    }

    getAPISettings() {
        const settings = JSON.parse(localStorage.getItem('aiChatApiSettings_v2') || 'null');
        if (!settings || !settings.configurations || !settings.activeConfigurationId) return null;
        return settings.configurations.find(c => c.id == settings.activeConfigurationId);
    }

    getInjectSettings() {
        const activePromptId = this.dataManager.appData.activePromptId;
        const prompt = this.dataManager.appData.prompts?.find(p => p.id == activePromptId);
        return prompt?.settings || { temperature: 0.7, maxResponse: 2000, topP: 0.9 };
    }
    
    openChatSettings() {
        if (!this.currentCharacter) return;
        
        const charChatSettingsPage = document.getElementById('page-char-chat-settings');
        if (!charChatSettingsPage) return;
        
        const title = document.getElementById('char-chat-settings-title');
        const avatar = document.getElementById('chat-settings-char-avatar-2');
        const name = document.getElementById('chat-settings-char-name-2');
        
        if (title) title.textContent = `${this.currentCharacter.name} - 聊天设置`;
        if (avatar) avatar.src = this.currentCharacter.avatar;
        if (name) name.textContent = this.currentCharacter.name;
        
        charChatSettingsPage.classList.add('active');
    }
    
    // ===== 公共方法 =====
    clearCurrentChat() {
        if (this.currentCharacterId && confirm('确定要清空当前聊天记录吗？')) {
            this.chatHistory = [];
            delete this.allChats[this.currentCharacterId];
            this.saveChatHistory();
            this.addWelcomeMessage();
            this.renderChatHistory();
        }
    }

    exportChatHistory() {
        if (!this.currentCharacterId) return;
        const chatData = {
            character: this.currentCharacter,
            user: this.currentUserProfile,
            messages: this.chatHistory,
            exportTime: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `chat-${this.currentCharacter.name}-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}

// ===================================================================
// ========================== 应用启动入口 ===========================
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 动态加载状态栏
    fetch('statusBar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const container = document.getElementById('status-bar-container');
            if (container) {
                container.innerHTML = html;
            }
            const pageOverlays = document.querySelectorAll('.page-overlay');
            pageOverlays.forEach(overlay => {
                if (!overlay.querySelector('.status-bar')) {
                    const header = overlay.querySelector('.user-settings-header');
                    if (header) {
                        const statusBarDiv = document.createElement('div');
                        statusBarDiv.className = 'status-bar-overlay';
                        statusBarDiv.innerHTML = html;
                        overlay.insertBefore(statusBarDiv, header);
                    }
                }
            });
            // 触发 statusBar.js 中的初始化逻辑
            document.dispatchEvent(new CustomEvent('statusBarLoaded'));
        })
        .catch(error => {
            console.error('无法加载状态栏:', error);
            // 即使失败，也触发事件，以防有其他逻辑依赖它
            document.dispatchEvent(new CustomEvent('statusBarLoaded'));
        });

    // 创建并启动应用
    const app = new App();
    app.init();
});