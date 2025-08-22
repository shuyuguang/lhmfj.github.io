// UIManager.js

class UIManager {
    constructor(dataManager, chatManager) {
        this.dataManager = dataManager;
        this.chatManager = chatManager;
        
        this.cropper = null;
        this.currentCropContext = null;
        this.newCharacterAvatarData = null;
        this.newUserAvatarData = null;
        this.currentEditingTextarea = null;
    }

    init() {
        this._queryElements();
        this._bindEventListeners();
        this.renderAll();
    }

    _queryElements() {
        // --- App & Navigation ---
        this.appContainer = document.querySelector('.app-container');
        this.navButtons = document.querySelectorAll('.nav-button');
        this.pages = document.querySelectorAll('.page');

        // --- Sidebar ---
        this.closeSidebarBtn = document.getElementById('close-sidebar-btn');
        this.sidebarOverlay = document.querySelector('.sidebar-overlay');
        this.openSidebarTriggers = document.querySelectorAll('.js-open-sidebar');

        // --- Dynamic Lists & Tabs ---
        this.chatListContainer = document.querySelector('.chat-list');
        this.defaultGroupContactsContainer = document.getElementById('default-group-contacts');
        this.defaultGroupCount = document.getElementById('default-group-count');
        this.contactGroupsContainer = document.querySelector('.contact-groups');
        this.contactTabs = document.querySelectorAll('.contact-tab-btn');
        this.tabContents = document.querySelectorAll('.contact-tab-content');

        // --- Page Overlays ---
        this.userSettingsPage = document.getElementById('page-user-settings');
        this.characterSettingsPage = document.getElementById('page-character-settings');
        this.dataManagementPage = document.getElementById('page-data-management');
        this.apiSettingsPage = document.getElementById('page-api-settings');
        this.injectPage = document.getElementById('page-inject');
        this.favoritesPage = document.getElementById('page-favorites');
        this.beautifyPage = document.getElementById('page-beautify');
        this.walletPage = document.getElementById('page-wallet');
        this.specialPage = document.getElementById('page-special');
        this.chatInterfacePage = document.getElementById('page-chat-interface');
        this.chatInterfaceBackBtn = document.getElementById('chat-interface-back-btn');

        // --- Injection Page Controls ---
        this.injectMaxContextValue = document.getElementById('inject-max-context');
        this.injectMaxContextSlider = document.getElementById('inject-max-context-slider');
        this.injectMaxResponseValue = document.getElementById('inject-max-response');
        this.injectMaxResponseSlider = document.getElementById('inject-max-response-slider');
        this.injectTempSlider = document.getElementById('inject-temp-slider');
        this.injectTempValue = document.getElementById('inject-temp-value');
        this.injectTopPSlider = document.getElementById('inject-top-p-slider');
        this.injectTopPValue = document.getElementById('inject-top-p-value');
        this.injectAbilitySelect = document.getElementById('inject-ability-select');
        this.injectModeSelect = document.getElementById('inject-mode-select');
        this.btnNewPromptIcon = document.getElementById('btn-new-prompt-icon');
        this.btnDeletePrompt = document.getElementById('btn-delete-prompt');
        this.btnSavePrompt = document.getElementById('btn-save-prompt');
        this.promptSelect = document.getElementById('prompt-select');

        // --- User Settings Page Elements ---
        this.sidebarProfileLink = document.getElementById('sidebar-profile-link');
        this.userAvatarPreview = document.getElementById('user-avatar-preview');
        this.userAvatarInput = document.getElementById('user-avatar-input');
        this.sidebarAvatar = document.querySelector('#sidebar-profile-link .avatar');
        this.headerAvatar = document.querySelector('#page-messages .user-info .avatar');
        this.feedAvatar = document.getElementById('feed-avatar');
        this.inputName = document.getElementById('input-name');
        this.inputGender = document.getElementById('input-gender');
        this.inputBirthday = document.getElementById('input-birthday');
        this.inputAge = document.getElementById('input-age');
        this.textareaSettings = document.getElementById('textarea-settings');
        this.inputSignature = document.getElementById('input-signature');
        this.userProfileTagsContainer = document.getElementById('user-profile-tags');
        this.userSettingsDeleteBtn = document.getElementById('user-settings-delete-btn');
        this.userSettingsSaveBtn = document.getElementById('user-settings-save-btn');
        this.addUserProfileBtn = document.getElementById('add-user-profile-btn');
        this.toggleGlobalApply = document.getElementById('toggle-global-apply');
        this.characterBindingContainer = document.getElementById('character-binding-container');
        this.bindCharacterSelect = document.getElementById('bind-character-select');

        // --- Dynamic User Info Display ---
        this.sidebarProfileName = document.querySelector('#sidebar-profile-link .profile-name');
        this.sidebarProfileStatus = document.querySelector('#sidebar-profile-link .profile-status');
        this.headerUsername = document.querySelector('.header-username');
        this.feedUsername = document.querySelector('#page-feed .feed-user-info span');

        // --- Character Settings Page Elements ---
        this.charAvatarPreview = document.getElementById('char-avatar-preview');
        this.charAvatarInput = document.getElementById('char-avatar-input');
        this.boundUserInfoCard = document.getElementById('bound-user-info-card');
        this.boundUserName = document.getElementById('bound-user-name');
        
        this.characterSettingsForm = {
            name: document.getElementById('input-char-name'),
            gender: document.getElementById('input-char-gender'),
            birthday: document.getElementById('input-char-birthday'),
            age: document.getElementById('input-char-age'),
            settings: document.getElementById('textarea-char-settings')
        };

        // --- Character Homepage Page Elements ---
        this.characterHomepagePage = document.getElementById('page-character-homepage');
        this.characterHomepageBackBtn = document.getElementById('character-homepage-back-btn');
        this.characterHomepageSaveBtn = document.getElementById('character-homepage-save-btn');
        this.charHomepageAvatarPreview = document.getElementById('char-homepage-avatar-preview');
        this.charHomepageAvatarInput = document.getElementById('char-homepage-avatar-input');
        this.boundUserInfoCardHomepage = document.getElementById('bound-user-info-card-homepage');
        this.boundUserNameHomepage = document.getElementById('bound-user-name-homepage');
        this.characterHomepageForm = {
            name: document.getElementById('input-char-homepage-name'),
            gender: document.getElementById('input-char-homepage-gender'),
            birthday: document.getElementById('input-char-homepage-birthday'),
            age: document.getElementById('input-char-homepage-age'),
            settings: document.getElementById('textarea-char-homepage-settings')
        };


        // --- Data Management Page Elements ---
        this.sidebarDataLink = document.getElementById('sidebar-data-link');
        this.btnClearData = document.getElementById('btn-clear-data');

        // --- New Sidebar Links ---
        this.sidebarInjectLink = document.getElementById('sidebar-inject-link');
        this.sidebarFavoritesLink = document.getElementById('sidebar-favorites-link');
        this.sidebarBeautifyLink = document.getElementById('sidebar-beautify-link');
        this.sidebarWalletLink = document.getElementById('sidebar-wallet-link');
        this.sidebarSpecialLink = document.getElementById('sidebar-special-link');

        // --- API Settings Page Elements ---
        this.sidebarApiLink = document.getElementById('sidebar-api-link');
        this.apiSettingsFormEl = document.getElementById('api-settings-form');
        this.apiConfigSelect = document.getElementById('api-config-select');
        this.apiTypeSelect = document.getElementById('api-type-select');
        this.apiUrlInput = document.getElementById('api-url');
        this.apiKeyInput = document.getElementById('api-key');
        this.modelSelect = document.getElementById('model-select');
        this.btnNewConfig = document.getElementById('btn-new-config-icon');
        this.fetchModelsButtonNew = document.getElementById('fetch-models-button-new');
        this.btnDeleteConfig = document.getElementById('btn-delete-config');
        this.btnSaveConfig = document.getElementById('btn-save-config');
        this.openaiModelsGroup = document.getElementById('openai-models');
        this.geminiModelsGroup = document.getElementById('gemini-models');

        // --- Modals ---
        this.modalContainer = document.getElementById('modal-container');
        this.weatherModal = document.getElementById('weather-modal');
        this.locationModal = document.getElementById('location-modal');
        this.statusModal = document.getElementById('status-modal');
        this.clearDataModal = document.getElementById('clear-data-modal');
        this.openWeatherModalBtn = document.getElementById('btn-open-weather-modal');
        this.openLocationModalBtn = document.getElementById('btn-open-location-modal');
        this.headerStatusTrigger = document.getElementById('header-status-trigger');
        this.headerStatusText = document.getElementById('header-status-text');
        this.weatherOptionsGrid = document.getElementById('weather-options-grid');
        this.locationCardsContainer = document.getElementById('location-cards-container');
        this.statusOptionsGrid = document.getElementById('status-options-grid');
        this.addLocationBtn = document.getElementById('btn-add-location');
        this.closeButtons = document.querySelectorAll('.modal-close-btn');
        this.clearDataConfirmInput = document.getElementById('clear-data-confirm-input');
        this.confirmClearDataBtn = document.getElementById('confirm-clear-data-btn');

        // --- Popovers & Grids ---
        this.actionGrids = document.querySelectorAll('.actions-grid');
        this.headerPlusBtn = document.getElementById('header-plus-btn');
        this.headerPopoverMenu = document.getElementById('header-popover-menu');
        
        // --- Cropper Modal Elements ---
        this.cropperModal = document.getElementById('cropper-modal');
        this.imageToCrop = document.getElementById('image-to-crop');
        this.confirmCropBtn = document.getElementById('confirm-crop-btn');
        this.cancelCropBtn = document.getElementById('cancel-crop-btn');

        // --- Chat Settings Page Elements ---
        this.charChatSettingsPage = document.getElementById('page-char-chat-settings');
        this.charChatSettingsBackBtn = document.getElementById('char-chat-settings-back-btn');
        this.clearChatHistoryBtn = document.getElementById('clear-chat-history-btn');
        this.exportChatHistoryBtn = document.getElementById('export-chat-history-btn');
        this.editCharacterHomepageBtn = document.getElementById('edit-character-homepage-btn');


        // --- Fullscreen Editor Elements ---
        this.fullscreenEditorPage = document.getElementById('page-fullscreen-editor');
        this.fullscreenEditorTextarea = document.getElementById('fullscreen-editor-textarea');
        this.fullscreenEditorBackBtn = document.getElementById('fullscreen-editor-back-btn');
    }

    _bindEventListeners() {
        // Initialization Calls
        this.setupUserSettingsAvatarUpload();
        this.setupCharacterSettingsPage();
        this.setupCropperModal();
        this.setupDataManagement();
        this.setupApiSettingsPage();
        this.setupInjectionSettingsPage();
        this.setupFullscreenEditor();
        this.setupCharacterHomepagePage();

        // User Profile Settings
        if(this.addUserProfileBtn) {
            this.addUserProfileBtn.addEventListener('click', () => this.handleNewUserProfile());
        }
        if(this.userSettingsDeleteBtn) {
            this.userSettingsDeleteBtn.addEventListener('click', () => this.handleDeleteUserProfile());
        }
        if(this.userSettingsSaveBtn) {
            this.userSettingsSaveBtn.addEventListener('click', () => {
                this.saveActiveUserProfileDetails();
                alert('设置已保存！');
            });
        }

        // Navigation
        this.navButtons.forEach(button => { 
            button.addEventListener('click', () => this.handleNavClick(button)); 
        });
        if (this.chatInterfaceBackBtn) {
            this.chatInterfaceBackBtn.addEventListener('click', () => {
                if (this.chatInterfacePage) {
                    this.chatInterfacePage.classList.remove('active');
                }
            });
        }
        
        // Sidebar
        this.openSidebarTriggers.forEach(trigger => trigger.addEventListener('click', () => this.appContainer.classList.add('sidebar-open')));
        if (this.closeSidebarBtn) this.closeSidebarBtn.addEventListener('click', () => this.appContainer.classList.remove('sidebar-open'));
        if (this.sidebarOverlay) this.sidebarOverlay.addEventListener('click', () => this.appContainer.classList.remove('sidebar-open'));
        
        // Contact Tabs
        if(this.contactTabs) {
            this.contactTabs.forEach(tab => { 
                tab.addEventListener('click', () => this.handleContactTabClick(tab)); 
            });
        }
        
        // Contact Groups
        if(this.contactGroupsContainer) { 
            this.contactGroupsContainer.addEventListener('click', (e) => { 
                const header = e.target.closest('.group-header'); 
                if (header && header.parentElement.querySelector('.contact-list')) { 
                    header.closest('.group-item').classList.toggle('open'); 
                } 
            }); 
        }
        
        // Modals
        if(this.openWeatherModalBtn) this.openWeatherModalBtn.addEventListener('click', () => this.openModal(this.weatherModal));
        if(this.openLocationModalBtn) this.openLocationModalBtn.addEventListener('click', () => this.openModal(this.locationModal));
        if(this.headerStatusTrigger) this.headerStatusTrigger.addEventListener('click', () => this.openModal(this.statusModal));
        if(this.closeButtons) this.closeButtons.forEach(btn => btn.addEventListener('click', () => this.closeModal()));
        if(this.modalContainer) this.modalContainer.addEventListener('click', (e) => { if (e.target === this.modalContainer) this.closeModal(); });
        if(this.addLocationBtn) this.addLocationBtn.addEventListener('click', () => this.handleAddNewLocation());
        
        // Popover Menu
        if (this.headerPlusBtn && this.headerPopoverMenu) { 
            this.headerPlusBtn.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                this.headerPopoverMenu.classList.toggle('visible'); 
            }); 
            document.addEventListener('click', (e) => { 
                if (!this.headerPopoverMenu.contains(e.target) && !this.headerPlusBtn.contains(e.target)) { 
                    this.headerPopoverMenu.classList.remove('visible'); 
                } 
            }); 
        }
        
        // Page Transitions
        this.setupPageTransition(this.sidebarProfileLink, this.userSettingsPage, () => this.appContainer.classList.add('sidebar-open'));
        this.setupPageTransition(this.sidebarDataLink, this.dataManagementPage, () => this.appContainer.classList.add('sidebar-open'));
        this.setupPageTransition(this.sidebarApiLink, this.apiSettingsPage, () => this.appContainer.classList.add('sidebar-open'));
        this.setupPageTransition(this.sidebarInjectLink, this.injectPage, () => this.appContainer.classList.add('sidebar-open'));
        this.setupPageTransition(this.sidebarFavoritesLink, this.favoritesPage, () => this.appContainer.classList.add('sidebar-open'));
        this.setupPageTransition(this.sidebarBeautifyLink, this.beautifyPage, () => this.appContainer.classList.add('sidebar-open'));
        this.setupPageTransition(this.sidebarWalletLink, this.walletPage, () => this.appContainer.classList.add('sidebar-open'));
        this.setupPageTransition(this.sidebarSpecialLink, this.specialPage, () => this.appContainer.classList.add('sidebar-open'));

        // Generic Action Grids
        if (this.actionGrids) {
            this.actionGrids.forEach(grid => {
                grid.addEventListener('click', (e) => {
                    const actionItem = e.target.closest('.action-item');
                    if (actionItem) {
                        alert('该功能待开发…');
                    }
                });
            });
        }

        // Character Creation/Editing
        const btnCreateCharacter = document.getElementById('btn-create-character');
        if (btnCreateCharacter) {
            btnCreateCharacter.addEventListener('click', () => {
                if (this.headerPopoverMenu) this.headerPopoverMenu.classList.remove('visible');
                this.openCharacterEditor();
            });
        }
        if (this.defaultGroupContactsContainer) {
            this.defaultGroupContactsContainer.addEventListener('click', (e) => {
                const clickedItem = e.target.closest('.chat-item[data-char-id]');
                if (clickedItem) {
                    const charId = clickedItem.dataset.charId;
                    this.openCharacterEditor(charId);
                }
            });
        }
        if (this.editCharacterHomepageBtn) {
            this.editCharacterHomepageBtn.addEventListener('click', () => {
                const charId = this.chatManager.currentCharacterId;
                if (charId) {
                    this.openCharacterHomepage(charId);
                }
            });
        }

        // Scope Settings
        if (this.toggleGlobalApply) {
            this.toggleGlobalApply.addEventListener('change', () => this.handleScopeChange());
        }
        if (this.bindCharacterSelect) {
            this.bindCharacterSelect.addEventListener('change', () => this.handleBindCharacterChange());
        }

        // Chat Settings Page
        if (this.charChatSettingsBackBtn) {
            this.charChatSettingsBackBtn.addEventListener('click', () => {
                if (this.charChatSettingsPage) {
                    this.charChatSettingsPage.classList.remove('active');
                }
            });
        }
        if (this.clearChatHistoryBtn) {
            this.clearChatHistoryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.chatManager.currentCharacterId) {
                    this.chatManager.clearCurrentChat();
                }
            });
        }
        if (this.exportChatHistoryBtn) {
            this.exportChatHistoryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.chatManager.currentCharacterId) {
                    this.chatManager.exportChatHistory();
                }
            });
        }
    }

    renderAll() {
        this.loadUserProfileDetails();
        this.renderUserProfileTags();
        if (this.inputSignature) this.inputSignature.value = this.dataManager.appData.globalSignature || '';
        this.updateHeaderStatus();
        this.renderWeatherOptions();
        this.renderLocationCards();
        this.renderStatusOptions();
        this.renderChatList();
        this.renderContactList();
        this.updateUserDisplayInfo();
    }

    // --- Event Handler Methods ---

    handleNavClick(button) {
        const targetId = button.dataset.target;
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        this.pages.forEach(page => page.classList.remove('active'));
        button.classList.add('active');
        const targetPage = document.getElementById(targetId);
        if (targetPage) targetPage.classList.add('active');
    }

    handleContactTabClick(tab) {
        const targetId = tab.dataset.target;
        this.contactTabs.forEach(t => t.classList.remove('active'));
        this.tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.classList.add('active');
    }

    handleAddNewLocation() {
        this.dataManager.appData.locations.push({ id: Date.now(), name: '', address: '', selected: false });
        this.dataManager.save();
        this.renderLocationCards();
    }

    handleNewUserProfile() {
        const newName = prompt('请输入新设定的名称', `我的设定 ${this.dataManager.appData.userProfiles.length + 1}`);
        if (!newName || newName.trim() === '') return;

        const newProfile = {
            id: `profile_${Date.now()}`,
            name: newName.trim(),
            isDefault: false,
            avatar: 'https://i.imgur.com/uG2g8xX.png',
            gender: '女',
            birthday: '',
            age: '',
            settings: '',
            isGlobal: true,
            boundCharacterId: null
        };

        this.dataManager.appData.userProfiles.push(newProfile);
        this.dataManager.appData.activeUserProfileId = newProfile.id;
        this.dataManager.save();
        this.loadUserProfileDetails();
        this.renderUserProfileTags();
    }

    handleDeleteUserProfile() {
        const profile = this.dataManager.getActiveUserProfile();
        if (!profile || profile.isDefault) return;
        if (confirm(`确定要删除设定 "${profile.name}" 吗？此操作不可撤销。`)) {
            this.dataManager.appData.userProfiles = this.dataManager.appData.userProfiles.filter(p => p.id !== profile.id);
            this.dataManager.appData.activeUserProfileId = 'default';
            this.dataManager.save();
            this.loadUserProfileDetails();
            this.renderUserProfileTags();
        }
    }

    handleScopeChange() {
        const profile = this.dataManager.getActiveUserProfile();
        if (!profile) return;
        
        profile.isGlobal = this.toggleGlobalApply.checked;
        if (profile.isGlobal) {
            profile.boundCharacterId = null;
            this.characterBindingContainer.classList.remove('visible');
        } else {
            this.characterBindingContainer.classList.add('visible');
        }
        this.dataManager.save();
    }

    handleBindCharacterChange() {
        const profile = this.dataManager.getActiveUserProfile();
        if (!profile) return;

        profile.boundCharacterId = this.bindCharacterSelect.value;
        this.dataManager.save();
    }

    // --- UI Rendering Methods ---

    renderUserProfileTags() {
        if (!this.userProfileTagsContainer) return;
        this.userProfileTagsContainer.innerHTML = '';
        this.dataManager.appData.userProfiles.forEach(profile => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = profile.name;
            tag.dataset.id = profile.id;
            if (profile.id === this.dataManager.appData.activeUserProfileId) {
                tag.classList.add('active');
            }
            tag.addEventListener('click', () => {
                this.dataManager.appData.activeUserProfileId = profile.id;
                this.loadUserProfileDetails();
                this.renderUserProfileTags();
            });
            this.userProfileTagsContainer.appendChild(tag);
        });
    }

    loadUserProfileDetails() {
        const profile = this.dataManager.getActiveUserProfile();
        if (!profile) return;
        if (this.inputName) this.inputName.value = profile.name || '';
        if (this.inputGender) this.inputGender.value = profile.gender || '女';
        if (this.inputBirthday) this.inputBirthday.value = profile.birthday || '';
        if (this.inputAge) this.inputAge.value = profile.age || '';
        if (this.textareaSettings) this.textareaSettings.value = profile.settings || '';
        this.updateUserAvatars(profile.avatar);
        if (this.userSettingsDeleteBtn) {
            this.userSettingsDeleteBtn.style.display = profile.isDefault ? 'none' : 'inline-block';
        }
        this.updateUserDisplayInfo();
        this.loadScopeSettingsUI();
    }

    saveActiveUserProfileDetails() {
        const profile = this.dataManager.getActiveUserProfile();
        if (!profile) return;
        if (this.inputName) profile.name = this.inputName.value;
        if (this.inputBirthday) profile.birthday = this.inputBirthday.value;
        if (this.inputAge) profile.age = this.inputAge.value;
        if (this.textareaSettings) profile.settings = this.textareaSettings.value;
        if (this.inputSignature) this.dataManager.appData.globalSignature = this.inputSignature.value;

        if (this.toggleGlobalApply) {
            profile.isGlobal = this.toggleGlobalApply.checked;
            profile.boundCharacterId = profile.isGlobal ? null : (this.bindCharacterSelect ? this.bindCharacterSelect.value : null);
        }

        if (this.newUserAvatarData) {
            profile.avatar = this.newUserAvatarData;
            this.newUserAvatarData = null;
        }
        this.dataManager.save();
        this.renderUserProfileTags();
        this.updateUserDisplayInfo();
    }

    updateUserDisplayInfo() {
        const profile = this.dataManager.getActiveUserProfile();
        if (!profile) return;
        if (this.sidebarProfileName) this.sidebarProfileName.textContent = profile.name;
        if (this.headerUsername) this.headerUsername.textContent = profile.name;
        if (this.feedUsername) this.feedUsername.textContent = profile.name;
        if (this.sidebarProfileStatus) {
            const signature = this.dataManager.appData.globalSignature || '此处展示个性签名';
            this.sidebarProfileStatus.textContent = signature.length > 13 ? signature.substring(0, 13) + '…' : signature;
        }
    }
    
    renderChatList() { 
        if (!this.chatListContainer) return; 
        this.chatListContainer.innerHTML = ''; 
        const groupChatItemHTML = `<div class="chat-item"><div class="avatar-group-logo">LOG</div><div class="chat-details"><div class="chat-title">相亲相爱一家人</div><div class="chat-message">AI助手: @全体成员 今天...</div></div><div class="chat-meta">06/05 <i class="fa-solid fa-bell-slash"></i></div></div>`; 
        this.chatListContainer.insertAdjacentHTML('beforeend', groupChatItemHTML); 
        this.dataManager.appData.characters.forEach(char => { 
            const chatItemHTML = `
                <div class="chat-item" data-char-id="${char.id}">
                    <img src="${char.avatar}" alt="avatar">
                    <div class="chat-details">
                        <div class="chat-title">${char.name}</div>
                        <div class="chat-message">我们已经是好友了，现在开始聊天吧！</div>
                    </div>
                    <div class="chat-meta">${char.creationTime}</div>
                </div>`; 
            this.chatListContainer.insertAdjacentHTML('beforeend', chatItemHTML); 
        }); 
    }

    renderContactList() { 
        if (!this.defaultGroupContactsContainer || !this.defaultGroupCount) return; 
        this.defaultGroupContactsContainer.innerHTML = ''; 
        this.defaultGroupCount.textContent = this.dataManager.appData.characters.length; 
        this.dataManager.appData.characters.forEach(char => { 
            const contactItemHTML = `<div class="chat-item" data-char-id="${char.id}"><img src="${char.avatar}" alt="avatar"><div class="chat-details"><div class="chat-title">${char.name}</div></div></div>`; 
            this.defaultGroupContactsContainer.insertAdjacentHTML('beforeend', contactItemHTML); 
        }); 
    }

    renderStatusOptions() {
        if (!this.statusOptionsGrid) return;
        this.statusOptionsGrid.innerHTML = '';
        this.dataManager.appData.status.options.forEach(statusText => {
            const btn = document.createElement('button');
            btn.className = 'status-option-btn';
            btn.textContent = statusText;
            if (statusText === this.dataManager.appData.status.selected) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                this.dataManager.appData.status.selected = statusText;
                this.dataManager.save();
                this.updateHeaderStatus();
                this.renderStatusOptions();
            });
            this.addLongPressListener(btn, () => {
                if (confirm(`确定要删除状态 "${statusText}" 吗？`)) {
                    this.dataManager.appData.status.options = this.dataManager.appData.status.options.filter(s => s !== statusText);
                    if (this.dataManager.appData.status.selected === statusText) {
                        this.dataManager.appData.status.selected = this.dataManager.appData.status.options[0] || '在线';
                    }
                    this.dataManager.save();
                    this.updateHeaderStatus();
                    this.renderStatusOptions();
                }
            });
            this.statusOptionsGrid.appendChild(btn);
        });
        const addBtn = document.createElement('button');
        addBtn.className = 'status-option-btn add-new';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
            const newStatus = prompt('请输入新状态');
            if (newStatus === null) return;
            if (newStatus.trim() === '') return alert('状态不能为空！');
            if (newStatus.length > 20) return alert('状态内容不能超过20个字！');
            if (this.dataManager.appData.status.options.includes(newStatus)) return alert('此状态已存在！');
            this.dataManager.appData.status.options.push(newStatus);
            this.dataManager.save();
            this.renderStatusOptions();
        });
        this.statusOptionsGrid.appendChild(addBtn);
    }

    renderWeatherOptions() {
        if(!this.weatherOptionsGrid) return;
        this.weatherOptionsGrid.innerHTML = '';
        this.dataManager.appData.weather.options.forEach(icon => {
            const btn = document.createElement('button');
            btn.className = 'weather-option-btn';
            btn.textContent = icon;
            if (icon === this.dataManager.appData.weather.selected) btn.classList.add('active');
            btn.addEventListener('click', () => {
                this.dataManager.appData.weather.selected = icon;
                this.dataManager.save();
                this.renderWeatherOptions();
            });
            this.addLongPressListener(btn, () => {
                if (confirm(`确定要删除天气 "${icon}" 吗？`)) {
                    this.dataManager.appData.weather.options = this.dataManager.appData.weather.options.filter(i => i !== icon);
                    if (this.dataManager.appData.weather.selected === icon) {
                        this.dataManager.appData.weather.selected = this.dataManager.appData.weather.options[0] || null;
                    }
                    this.dataManager.save();
                    this.renderWeatherOptions();
                }
            });
            this.weatherOptionsGrid.appendChild(btn);
        });
        const addBtn = document.createElement('button');
        addBtn.className = 'weather-option-btn add-new';
        addBtn.textContent = '+';
        addBtn.addEventListener('click', () => {
            const newWeather = prompt('请输入天气');
            if (newWeather && !this.dataManager.appData.weather.options.includes(newWeather)) {
                this.dataManager.appData.weather.options.push(newWeather);
                this.dataManager.save();
                this.renderWeatherOptions();
            }
        });
        this.weatherOptionsGrid.appendChild(addBtn);
    }

    renderLocationCards() {
        if (!this.locationCardsContainer) return;
        this.locationCardsContainer.innerHTML = '';
        this.dataManager.appData.locations.forEach(location => {
            const card = document.createElement('div');
            card.className = 'location-card';
            card.innerHTML = `
                <div class="input-group">
                    <label for="loc-name-${location.id}">名称</label>
                    <input type="text" id="loc-name-${location.id}" value="${location.name}" placeholder="如：家">
                </div>
                <div class="input-group">
                    <label for="loc-addr-${location.id}">地址</label>
                    <input type="text" id="loc-addr-${location.id}" value="${location.address}" placeholder="如：XX省XX市">
                </div>
                <div class="location-card-actions">
                    <button class="location-delete-btn" data-id="${location.id}">删除</button>
                    <div class="location-select-indicator ${location.selected ? 'selected' : ''}" data-id="${location.id}">
                        <i class="fa-solid fa-check"></i>
                    </div>
                </div>
            `;
            card.querySelector(`#loc-name-${location.id}`).addEventListener('change', (e) => {
                location.name = e.target.value;
                this.dataManager.save();
            });
            card.querySelector(`#loc-addr-${location.id}`).addEventListener('change', (e) => {
                location.address = e.target.value;
                this.dataManager.save();
            });
            card.querySelector('.location-delete-btn').addEventListener('click', (e) => {
                if (confirm(`确定要删除定位 "${location.name}" 吗？`)) {
                    this.dataManager.appData.locations = this.dataManager.appData.locations.filter(loc => loc.id !== location.id);
                    this.dataManager.save();
                    this.renderLocationCards();
                }
            });
            card.querySelector('.location-select-indicator').addEventListener('click', () => {
                this.dataManager.appData.locations.forEach(loc => loc.selected = (loc.id === location.id) ? !loc.selected : false);
                this.dataManager.save();
                this.renderLocationCards();
            });
            this.locationCardsContainer.appendChild(card);
        });
    }

    // --- Core Logic & Features ---

    updateHeaderStatus() { 
        if(this.headerStatusText) this.headerStatusText.textContent = this.dataManager.appData.status.selected; 
    }

    addLongPressListener(element, callback) { 
        let longPressTimer; 
        const start = (e) => { 
            longPressTimer = setTimeout(callback, 600); 
        }; 
        const cancel = () => clearTimeout(longPressTimer); 
        element.addEventListener('mousedown', start); 
        element.addEventListener('mouseup', cancel); 
        element.addEventListener('mouseleave', cancel); 
        element.addEventListener('touchstart', start, { passive: true });
        element.addEventListener('touchend', cancel); 
    }

    openModal(modalElement) { 
        if (this.modalContainer && modalElement) {
            this.modalContainer.classList.add('visible'); 
            modalElement.classList.add('visible'); 
        }
    }

    closeModal() { 
        if (this.modalContainer) {
            this.modalContainer.classList.remove('visible'); 
            [this.weatherModal, this.locationModal, this.statusModal, this.clearDataModal, this.cropperModal].forEach(m => { 
                if (m) m.classList.remove('visible'); 
            }); 
        }
    }

    setupPageTransition(link, page, onBack) {
        if (!link || !page) return;
        
        const backBtn = page.querySelector('.fa-chevron-left');

        link.addEventListener('click', (e) => {
            e.preventDefault();
            page.classList.add('active');
            if (this.appContainer) this.appContainer.classList.remove('sidebar-open');
        });

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                page.classList.remove('active');
                if (onBack && typeof onBack === 'function') {
                    onBack();
                }
            });
        }
    }

    openCharacterEditor(characterId = null) {
        const pageTitle = this.characterSettingsPage.querySelector('.user-settings-header span');
        const floatingChatBtn = document.getElementById('floating-chat-btn');
        
        Object.values(this.characterSettingsForm).forEach(input => {
            if (input) input.value = '';
        });
        if (this.charAvatarPreview) this.charAvatarPreview.src = 'https://i.imgur.com/Jz9v5aB.png';
        this.newCharacterAvatarData = null;
        if (this.charAvatarInput) this.charAvatarInput.value = null;
        if (this.boundUserInfoCard) this.boundUserInfoCard.classList.add('hidden');

        if (characterId) {
            const characterToEdit = this.dataManager.appData.characters.find(c => c.id == characterId);
            if (!characterToEdit) return;
            
            if (pageTitle) pageTitle.textContent = `编辑 - ${characterToEdit.name}`;
            this.characterSettingsForm.name.value = characterToEdit.name;
            this.characterSettingsForm.gender.value = characterToEdit.gender;
            this.characterSettingsForm.birthday.value = characterToEdit.birthday;
            this.characterSettingsForm.age.value = characterToEdit.age;
            this.characterSettingsForm.settings.value = characterToEdit.settings;
            if (this.charAvatarPreview) this.charAvatarPreview.src = characterToEdit.avatar;

            const boundProfile = this.dataManager.appData.userProfiles.find(p => !p.isGlobal && p.boundCharacterId == characterToEdit.id);
            if (boundProfile && this.boundUserInfoCard && this.boundUserName) {
                this.boundUserName.textContent = boundProfile.name;
                this.boundUserInfoCard.classList.remove('hidden');
            }
            
            if (floatingChatBtn) {
                floatingChatBtn.disabled = false;
                floatingChatBtn.innerHTML = '<span>发消息</span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="send-icon-svg" viewBox="0 0 16 16"><path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/></svg>';
            }
            this.characterSettingsPage.dataset.editingId = characterId;
        } else {
            if (pageTitle) pageTitle.textContent = '创建新角色';
            if (floatingChatBtn) {
                floatingChatBtn.disabled = true;
                floatingChatBtn.innerHTML = '<span>设置后保存</span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="send-icon-svg" viewBox="0 0 16 16"><path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/></svg>';
            }
            delete this.characterSettingsPage.dataset.editingId;
        }
        this.characterSettingsPage.classList.add('active');
    }
    
    openCharacterHomepage(characterId) {
        if (!characterId || !this.characterHomepagePage) return;

        const characterToEdit = this.dataManager.appData.characters.find(c => c.id == characterId);
        if (!characterToEdit) return;

        this.characterHomepageForm.name.value = characterToEdit.name;
        this.characterHomepageForm.gender.value = characterToEdit.gender;
        this.characterHomepageForm.birthday.value = characterToEdit.birthday;
        this.characterHomepageForm.age.value = characterToEdit.age;
        this.characterHomepageForm.settings.value = characterToEdit.settings;
        if (this.charHomepageAvatarPreview) this.charHomepageAvatarPreview.src = characterToEdit.avatar;
        
        const boundProfile = this.dataManager.appData.userProfiles.find(p => !p.isGlobal && p.boundCharacterId == characterToEdit.id);
        if (boundProfile && this.boundUserInfoCardHomepage && this.boundUserNameHomepage) {
            this.boundUserNameHomepage.textContent = boundProfile.name;
            this.boundUserInfoCardHomepage.classList.remove('hidden');
        } else {
            if (this.boundUserInfoCardHomepage) this.boundUserInfoCardHomepage.classList.add('hidden');
        }

        this.characterHomepagePage.dataset.editingId = characterId;
        this.characterHomepagePage.classList.add('active');
        
        setTimeout(() => { this.characterHomepagePage.scrollTop = 0; }, 100);
    }

    setupUserSettingsAvatarUpload() {
        if (this.userAvatarPreview) {
            this.userAvatarPreview.addEventListener('click', () => this.userAvatarInput.click());
        }
        if (this.userAvatarInput) {
            this.userAvatarInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    this.currentCropContext = { target: 'user', previewElement: this.userAvatarPreview };
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.openModal(this.cropperModal);
                        this.imageToCrop.src = e.target.result;
                        if (this.cropper) this.cropper.destroy();
                        this.cropper = new Cropper(this.imageToCrop, {
                            aspectRatio: 1, viewMode: 1, dragMode: 'move', background: false, autoCropArea: 0.8,
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    setupCharacterSettingsPage() {
        if (!this.characterSettingsPage) return;

        const backBtn = document.getElementById('character-settings-back-btn');
        const saveBtn = document.getElementById('character-settings-save-btn');
        const floatingChatBtn = document.getElementById('floating-chat-btn');

        if (this.charAvatarPreview) this.charAvatarPreview.addEventListener('click', () => this.charAvatarInput.click());
        if (this.charAvatarInput) {
            this.charAvatarInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    this.currentCropContext = { target: 'character', previewElement: this.charAvatarPreview };
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.openModal(this.cropperModal);
                        this.imageToCrop.src = e.target.result;
                        if (this.cropper) this.cropper.destroy();
                        this.cropper = new Cropper(this.imageToCrop, {
                            aspectRatio: 1, viewMode: 1, dragMode: 'move', background: false, autoCropArea: 0.8,
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const name = this.characterSettingsForm.name.value.trim();
                if (!name) return alert('角色姓名不能为空！');

                const currentlyEditingCharacterId = this.characterSettingsPage.dataset.editingId;

                if (currentlyEditingCharacterId) {
                    const characterToUpdate = this.dataManager.appData.characters.find(c => c.id == currentlyEditingCharacterId);
                    if (characterToUpdate) {
                        characterToUpdate.name = name;
                        characterToUpdate.gender = this.characterSettingsForm.gender.value;
                        characterToUpdate.birthday = this.characterSettingsForm.birthday.value;
                        characterToUpdate.age = this.characterSettingsForm.age.value;
                        characterToUpdate.settings = this.characterSettingsForm.settings.value;
                        if (this.newCharacterAvatarData) {
                            characterToUpdate.avatar = this.newCharacterAvatarData;
                        }
                        alert(`角色 "${name}" 已成功更新！`);
                    }
                } else {
                    const timeString = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
                    const newCharacter = {
                        id: Date.now(),
                        name: name,
                        gender: this.characterSettingsForm.gender.value,
                        birthday: this.characterSettingsForm.birthday.value,
                        age: this.characterSettingsForm.age.value,
                        settings: this.characterSettingsForm.settings.value,
                        signature: '',
                        avatar: this.newCharacterAvatarData || 'https://i.imgur.com/Jz9v5aB.png',
                        creationTime: timeString
                    };
                    this.dataManager.appData.characters.push(newCharacter);
                    alert(`角色 "${name}" 已成功创建！`);
                }

                this.dataManager.save();
                this.renderChatList();
                this.renderContactList();
                this.characterSettingsPage.classList.remove('active');
                delete this.characterSettingsPage.dataset.editingId;
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.characterSettingsPage.classList.remove('active');
                delete this.characterSettingsPage.dataset.editingId;
            });
        }

        if (floatingChatBtn) {
            floatingChatBtn.addEventListener('click', () => {
                if (floatingChatBtn.disabled) return;
                const currentlyEditingCharacterId = this.characterSettingsPage.dataset.editingId;
                if (currentlyEditingCharacterId) {
                    const character = this.dataManager.appData.characters.find(c => c.id == currentlyEditingCharacterId);
                    const userProfile = this.dataManager.getActiveUserProfile();
                    if (character && userProfile) {
                        this.chatManager.openChat(currentlyEditingCharacterId, character, userProfile);
                    } else {
                        alert('无法找到角色信息，请检查角色设置');
                    }
                } else {
                    alert('请先保存角色后再开始聊天');
                }
            });
        }
    }

    setupCharacterHomepagePage() {
        if (!this.characterHomepagePage) return;

        if (this.charHomepageAvatarPreview) this.charHomepageAvatarPreview.addEventListener('click', () => this.charHomepageAvatarInput.click());
        if (this.charHomepageAvatarInput) {
            this.charHomepageAvatarInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    this.currentCropContext = { target: 'character', previewElement: this.charHomepageAvatarPreview };
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.openModal(this.cropperModal);
                        this.imageToCrop.src = e.target.result;
                        if (this.cropper) this.cropper.destroy();
                        this.cropper = new Cropper(this.imageToCrop, {
                            aspectRatio: 1, viewMode: 1, dragMode: 'move', background: false, autoCropArea: 0.8,
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (this.characterHomepageSaveBtn) {
            this.characterHomepageSaveBtn.addEventListener('click', () => {
                const name = this.characterHomepageForm.name.value.trim();
                if (!name) return alert('角色姓名不能为空！');

                const currentlyEditingCharacterId = this.characterHomepagePage.dataset.editingId;
                if (currentlyEditingCharacterId) {
                    const characterToUpdate = this.dataManager.appData.characters.find(c => c.id == currentlyEditingCharacterId);
                    if (characterToUpdate) {
                        characterToUpdate.name = name;
                        characterToUpdate.gender = this.characterHomepageForm.gender.value;
                        characterToUpdate.birthday = this.characterHomepageForm.birthday.value;
                        characterToUpdate.age = this.characterHomepageForm.age.value;
                        characterToUpdate.settings = this.characterHomepageForm.settings.value;
                        if (this.newCharacterAvatarData) {
                            characterToUpdate.avatar = this.newCharacterAvatarData;
                        }
                        alert(`角色主页信息已成功更新！`);
                    }
                }
                this.dataManager.save();
                this.renderChatList();
                this.renderContactList();
                this.characterHomepagePage.classList.remove('active');
                delete this.characterHomepagePage.dataset.editingId;
            });
        }

        if (this.characterHomepageBackBtn) {
            this.characterHomepageBackBtn.addEventListener('click', () => {
                this.characterHomepagePage.classList.remove('active');
                delete this.characterHomepagePage.dataset.editingId;
            });
        }
    }


    setupCropperModal() {
        if (!this.cropperModal) return;
        this.confirmCropBtn.addEventListener('click', () => {
            if (!this.cropper || !this.currentCropContext) return;
            const canvas = this.cropper.getCroppedCanvas({
                width: 256, height: 256, imageSmoothingQuality: 'high',
            });
            const croppedImageData = canvas.toDataURL('image/png');
            
            if (this.currentCropContext.target === 'character') {
                this.newCharacterAvatarData = croppedImageData;
            } else if (this.currentCropContext.target === 'user') {
                this.newUserAvatarData = croppedImageData;
            }
            
            if (this.currentCropContext.previewElement) {
                this.currentCropContext.previewElement.src = croppedImageData;
            } else if (this.currentCropContext.target === 'user') {
                this.updateUserAvatars(croppedImageData);
            }
            
            this.cropper.destroy();
            this.cropper = null;
            this.currentCropContext = null;
            this.closeModal();
            if (this.charAvatarInput) this.charAvatarInput.value = null;
            if (this.userAvatarInput) this.userAvatarInput.value = null;
            if (this.charHomepageAvatarInput) this.charHomepageAvatarInput.value = null;
        });
        this.cancelCropBtn.addEventListener('click', () => {
            if (this.cropper) this.cropper.destroy();
            this.cropper = null;
            this.currentCropContext = null;
            this.closeModal();
            if (this.charAvatarInput) this.charAvatarInput.value = null;
            if (this.userAvatarInput) this.userAvatarInput.value = null;
            if (this.charHomepageAvatarInput) this.charHomepageAvatarInput.value = null;
        });
    }

    setupDataManagement() {
        const exportBtn = document.getElementById('btn-export-data');
        const importBtn = document.getElementById('btn-import-data');
        const importInput = document.getElementById('import-file-input');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.dataManager.save();
                const jsonString = JSON.stringify(this.dataManager.appData, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `felotus-data-${Date.now()}.json`;
                link.click();
                URL.revokeObjectURL(link.href);
                link.remove();
                alert('数据已成功导出！');
            });
        }
        
        if (importBtn) importBtn.addEventListener('click', () => importInput.click());
        
        if (importInput) {
            importInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        this.dataManager.appData = Object.assign({}, this.dataManager.initialData, importedData);
                        this.dataManager.save();
                        this.renderAll(); // Re-render everything with new data
                        alert('数据导入成功！');
                    } catch (error) {
                        alert('导入失败，请确保上传的是正确的 JSON 数据文件。');
                    } finally {
                        event.target.value = null;
                    }
                };
                reader.readAsText(file);
            });
        }
        
        if(this.btnClearData) {
            this.btnClearData.addEventListener('click', () => this.openModal(this.clearDataModal));
        }
        
        if(this.clearDataConfirmInput) {
            this.clearDataConfirmInput.addEventListener('input', () => {
                this.confirmClearDataBtn.disabled = this.clearDataConfirmInput.value.trim() !== 'delete';
            });
        }
        
        if(this.confirmClearDataBtn) {
            this.confirmClearDataBtn.addEventListener('click', () => {
                if(this.confirmClearDataBtn.disabled) return;
                localStorage.removeItem(this.dataManager.STORAGE_KEY);
                localStorage.removeItem('aiChatApiSettings_v2');
                localStorage.removeItem('felotus_chat_history');
                alert('本地数据已成功清除！应用将重新加载。');
                location.reload();
            });
        }
    }
    
    setupApiSettingsPage() { 
        if (!this.apiSettingsPage) return; 
        const API_SETTINGS_KEY = 'aiChatApiSettings_v2'; 
        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';
        const defaultModels = { openai: {}, gemini: {} }; 
        let apiSettings = {}; 
        
        const getSettings = () => JSON.parse(localStorage.getItem(API_SETTINGS_KEY) || 'null'); 
        const saveSettings = () => { 
            localStorage.setItem(API_SETTINGS_KEY, JSON.stringify(apiSettings)); 
            document.dispatchEvent(new CustomEvent('apiSettingsUpdated')); 
        };

        const updateDeleteButtonVisibility = () => {
            if (this.btnDeleteConfig) {
                const canDelete = apiSettings.configurations.length > 2;
                this.btnDeleteConfig.style.display = canDelete ? 'inline-block' : 'none';
            }
        };
        
        const populateConfigSelector = () => { 
            if (!this.apiConfigSelect) return;
            this.apiConfigSelect.innerHTML = ''; 
            apiSettings.configurations.forEach(config => { 
                const option = document.createElement('option'); 
                option.value = config.id; 
                option.textContent = config.name; 
                if (config.id == apiSettings.activeConfigurationId) { 
                    option.selected = true; 
                } 
                this.apiConfigSelect.appendChild(option); 
            }); 
            updateDeleteButtonVisibility();
        }; 
        
        const updateFormForApiType = (type) => { 
            if (this.apiUrlInput) {
                if (type === 'gemini') {
                    this.apiUrlInput.value = GEMINI_API_URL;
                    this.apiUrlInput.disabled = true;
                } else {
                    this.apiUrlInput.disabled = false;
                }
            }
        }; 
        
        const populateModels = (models, type) => { 
            const group = type === 'openai' ? this.openaiModelsGroup : this.geminiModelsGroup; 
            if (!group) return;
            group.innerHTML = ''; 
            Object.keys(models).forEach(modelId => { 
                const option = document.createElement('option'); 
                option.value = modelId; 
                option.textContent = type === 'gemini' ? models[modelId] : modelId; 
                group.appendChild(option); 
            }); 
        }; 
        
        const loadConfigurationDetails = (configId) => { 
            const config = apiSettings.configurations.find(c => c.id == configId); 
            if (!config) return; 
            if (this.apiTypeSelect) this.apiTypeSelect.value = config.type; 
            if (this.apiKeyInput) this.apiKeyInput.value = config.apiKey || ''; 

            updateFormForApiType(config.type); 
            if (config.type === 'openai' && this.apiUrlInput) {
                this.apiUrlInput.value = config.apiUrl || ''; 
            }
            
            populateModels(defaultModels[config.type], config.type); 
            if(config.model && this.modelSelect) { 
                const tempOption = document.createElement('option'); 
                tempOption.value = config.model; 
                tempOption.textContent = config.model; 
                const group = config.type === 'openai' ? this.openaiModelsGroup : this.geminiModelsGroup; 
                if (group && !group.querySelector(`option[value="${config.model}"]`)) { 
                    group.appendChild(tempOption); 
                } 
                this.modelSelect.value = config.model; 
            } 
        }; 
        
        const handleNewConfig = () => { 
            const name = prompt('请输入新配置的名称:', `我的配置 ${apiSettings.configurations.length + 1}`); 
            if (!name) return; 
            const newConfig = { id: Date.now(), name, type: 'openai', apiUrl: '', apiKey: '', model: '' }; 
            apiSettings.configurations.push(newConfig); 
            apiSettings.activeConfigurationId = newConfig.id; 
            saveSettings(); 
            populateConfigSelector(); 
            loadConfigurationDetails(newConfig.id); 
        }; 
        
        const handleDeleteConfig = () => { 
            if (apiSettings.configurations.length <= 2) {
                alert('默认配置无法删除！');
                updateDeleteButtonVisibility();
                return;
            }
            const configIdToDelete = this.apiConfigSelect ? this.apiConfigSelect.value : null;
            if (!configIdToDelete) return;
            const configToDelete = apiSettings.configurations.find(c => c.id == configIdToDelete); 
            if (confirm(`确定要删除配置 "${configToDelete.name}" 吗？`)) { 
                apiSettings.configurations = apiSettings.configurations.filter(c => c.id != configIdToDelete); 
                if (apiSettings.activeConfigurationId == configIdToDelete) { 
                    apiSettings.activeConfigurationId = apiSettings.configurations[0].id; 
                } 
                saveSettings(); 
                populateConfigSelector(); 
                loadConfigurationDetails(apiSettings.activeConfigurationId); 
            } 
        }; 
        
        const handleSaveConfig = (e) => { 
            e.preventDefault(); 
            const configId = this.apiConfigSelect ? this.apiConfigSelect.value : null;
            if (!configId) return;
            const configToSave = apiSettings.configurations.find(c => c.id == configId); 
            if (!configToSave) return; 
            
            configToSave.type = this.apiTypeSelect.value; 
            configToSave.apiUrl = (configToSave.type === 'gemini') ? GEMINI_API_URL : this.apiUrlInput.value.trim(); 
            if (this.apiKeyInput) configToSave.apiKey = this.apiKeyInput.value.trim(); 
            if (this.modelSelect) configToSave.model = this.modelSelect.value; 
            saveSettings(); 
            alert(`配置 "${configToSave.name}" 已保存！`); 
        }; 
        
        const fetchModels = async () => { 
            const apiKey = this.apiKeyInput ? this.apiKeyInput.value.trim() : '';
            const apiType = this.apiTypeSelect ? this.apiTypeSelect.value : 'openai';
            const baseUrl = this.apiUrlInput ? this.apiUrlInput.value.trim() : '';

            if (!this.fetchModelsButtonNew) return;
            this.fetchModelsButtonNew.textContent = '正在拉取...'; 
            this.fetchModelsButtonNew.disabled = true; 
            
            try { 
                let fetchedModels; 
                if (apiType === 'openai') { 
                    if (!baseUrl || !apiKey) throw new Error('请先填写 API 地址和密钥！'); 
                    const response = await fetch(`${baseUrl}/v1/models`, { headers: { 'Authorization': `Bearer ${apiKey}` } }); 
                    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`); 
                    const data = await response.json(); 
                    fetchedModels = data.data.reduce((acc, model) => ({ ...acc, [model.id]: model.id }), {}); 
                } else {
                    if (!apiKey) throw new Error('请先填写 Gemini API Key！'); 
                    const response = await fetch(`${baseUrl}/models?key=${apiKey}`); 
                    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`); 
                    const data = await response.json(); 
                    fetchedModels = data.models
                        .filter(m => m.supportedGenerationMethods.includes('generateContent'))
                        .reduce((acc, model) => ({ ...acc, [model.name]: model.displayName }), {});
                } 
                defaultModels[apiType] = fetchedModels; 
                populateModels(fetchedModels, apiType); 
                alert('模型列表拉取成功！'); 
            } catch (error) { 
                const errorMsg = `模型列表拉取失败！\n\n${error.message}\n\n如果使用Gemini，可能是以下配置问题，请检查：\n1. API Key是否解除了"应用限制"。\n2. 项目是否启用了"Vertex AI API"。\n3. 项目是否已关联结算账号。`;
                alert(errorMsg); 
                populateModels(defaultModels[apiType], apiType); 
            } finally { 
                this.fetchModelsButtonNew.textContent = '拉取模型'; 
                this.fetchModelsButtonNew.disabled = false; 
            } 
        }; 
        
        apiSettings = getSettings(); 
        if (!apiSettings || !apiSettings.configurations || apiSettings.configurations.length === 0) { 
            if (typeof API_PRESETS !== 'undefined' && API_PRESETS.length > 0) {
                apiSettings = { configurations: JSON.parse(JSON.stringify(API_PRESETS)), activeConfigurationId: API_PRESETS[0].id };
            } else {
                const defaultConfigId = Date.now(); 
                apiSettings = { configurations: [{ id: defaultConfigId, name: '默认配置', type: 'openai', apiUrl: '', apiKey: '', model: '' }], activeConfigurationId: defaultConfigId }; 
            }
            saveSettings(); 
        } 
        
        populateConfigSelector(); 
        loadConfigurationDetails(apiSettings.activeConfigurationId); 
        
        if (this.apiConfigSelect) this.apiConfigSelect.addEventListener('change', (e) => { 
            apiSettings.activeConfigurationId = e.target.value; 
            saveSettings(); 
            loadConfigurationDetails(e.target.value); 
        });
        if (this.apiTypeSelect) this.apiTypeSelect.addEventListener('change', (e) => { 
            const newType = e.target.value; 
            updateFormForApiType(newType); 
            if (newType === 'openai') { 
                const currentConfig = apiSettings.configurations.find(c => c.id == (this.apiConfigSelect ? this.apiConfigSelect.value : null)); 
                if (this.apiUrlInput) this.apiUrlInput.value = currentConfig?.apiUrl || ''; 
            } 
            populateModels(defaultModels[newType], newType); 
        });
        if (this.btnNewConfig) this.btnNewConfig.addEventListener('click', handleNewConfig); 
        if (this.btnDeleteConfig) this.btnDeleteConfig.addEventListener('click', handleDeleteConfig); 
        if (this.apiSettingsFormEl) this.apiSettingsFormEl.addEventListener('submit', handleSaveConfig); 
        if (this.btnSaveConfig) this.btnSaveConfig.addEventListener('click', () => this.apiSettingsFormEl && this.apiSettingsFormEl.requestSubmit());
        if (this.fetchModelsButtonNew) this.fetchModelsButtonNew.addEventListener('click', fetchModels);
        if (this.apiKeyInput) {
            this.apiKeyInput.addEventListener('focus', () => { this.apiKeyInput.type = 'text'; }); 
            this.apiKeyInput.addEventListener('blur', () => { this.apiKeyInput.type = 'password'; });
        }
    }

    setupFullscreenEditor() {
        if (!this.fullscreenEditorPage || !this.fullscreenEditorTextarea || !this.fullscreenEditorBackBtn) return;

        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-expand')) {
                const card = e.target.closest('.settings-card');
                if (!card) return;
                const targetTextarea = card.querySelector('textarea');
                if (!targetTextarea) return;

                this.currentEditingTextarea = targetTextarea;
                this.fullscreenEditorTextarea.value = this.currentEditingTextarea.value;
                this.fullscreenEditorPage.classList.add('active');
                this.fullscreenEditorTextarea.focus();
            }
        });

        this.fullscreenEditorBackBtn.addEventListener('click', () => {
            if (this.currentEditingTextarea) {
                this.currentEditingTextarea.value = this.fullscreenEditorTextarea.value;
            }
            this.fullscreenEditorPage.classList.remove('active');
            this.currentEditingTextarea = null;
            this.fullscreenEditorTextarea.value = '';
        });
    }

    setupInjectionSettingsPage() {
        if (!this.injectPage) return;

        const toggleInjectLock = document.getElementById('toggle-inject-lock');
        const injectSettingsCard = this.injectPage.querySelector('.inject-settings-card');

        const setInjectLockState = (locked) => {
            if (!injectSettingsCard || !toggleInjectLock) return;
            if (locked) {
                injectSettingsCard.classList.add('locked');
                toggleInjectLock.classList.remove('fa-lock-open');
                toggleInjectLock.classList.add('fa-lock');
            } else {
                injectSettingsCard.classList.remove('locked');
                toggleInjectLock.classList.remove('fa-lock');
                toggleInjectLock.classList.add('fa-lock-open');
            }
        };

        if (toggleInjectLock) {
            toggleInjectLock.addEventListener('click', () => {
                const isCurrentlyLocked = injectSettingsCard.classList.contains('locked');
                setInjectLockState(!isCurrentlyLocked);
            });
        }

        const updatePromptDeleteButtonVisibility = () => {
            if (this.btnDeletePrompt) {
                const canDelete = this.dataManager.appData.prompts.length > 2;
                this.btnDeletePrompt.style.display = canDelete ? 'inline-block' : 'none';
            }
        };

        if (!this.dataManager.appData.prompts || this.dataManager.appData.prompts.length === 0) {
            this.dataManager.appData.prompts = JSON.parse(JSON.stringify(this.dataManager.initialData.prompts));
            this.dataManager.appData.activePromptId = this.dataManager.appData.prompts[0].id;
            this.dataManager.save();
        }

        const populatePromptSelector = () => {
            if (!this.promptSelect) return;
            this.promptSelect.innerHTML = '';
            this.dataManager.appData.prompts.forEach(prompt => {
                const option = document.createElement('option');
                option.value = prompt.id;
                option.textContent = prompt.name;
                if (prompt.id == this.dataManager.appData.activePromptId) {
                    option.selected = true;
                }
                this.promptSelect.appendChild(option);
            });
            updatePromptDeleteButtonVisibility();
        };

        const loadPromptDetails = (promptId) => {
            const prompt = this.dataManager.appData.prompts.find(p => p.id == promptId);
            if (!prompt) return;
            const settings = prompt.settings;

            const updateControl = (slider, input, value, isFloat = false) => {
                if (slider && input) {
                    slider.value = value;
                    input.value = isFloat ? parseFloat(value).toFixed(2) : Math.round(value);
                    this.updateSliderTrack(slider);
                }
            };
            
            updateControl(this.injectMaxContextSlider, this.injectMaxContextValue, settings.maxContext);
            updateControl(this.injectMaxResponseSlider, this.injectMaxResponseValue, settings.maxResponse);
            updateControl(this.injectTempSlider, this.injectTempValue, settings.temperature, true);
            updateControl(this.injectTopPSlider, this.injectTopPValue, settings.topP, true);

            if (this.injectAbilitySelect) this.injectAbilitySelect.value = settings.ability;
            if (this.injectModeSelect) this.injectModeSelect.value = settings.mode;
        };

        const saveActivePrompt = () => {
            const activePrompt = this.dataManager.appData.prompts.find(p => p.id == this.dataManager.appData.activePromptId);
            if (!activePrompt) return;
            
            activePrompt.settings = {
                maxContext: parseInt(this.injectMaxContextValue.value, 10),
                maxResponse: parseInt(this.injectMaxResponseValue.value, 10),
                temperature: parseFloat(this.injectTempValue.value),
                topP: parseFloat(this.injectTopPValue.value),
                ability: this.injectAbilitySelect.value,
                mode: this.injectModeSelect.value
            };
            this.dataManager.save();
            alert(`提示词 "${activePrompt.name}" 已保存！`);
        };

        const handleNewPrompt = () => {
            const name = prompt('请输入新提示词的名称:', `我的提示词 ${this.dataManager.appData.prompts.length + 1}`);
            if (!name || name.trim() === '') return;
            const newPrompt = {
                id: `prompt_${Date.now()}`,
                name: name.trim(),
                settings: { ...this.dataManager.initialData.injectionSettings }
            };
            this.dataManager.appData.prompts.push(newPrompt);
            this.dataManager.appData.activePromptId = newPrompt.id;
            this.dataManager.save();
            populatePromptSelector();
            loadPromptDetails(newPrompt.id);
        };
        
        const handleDeletePrompt = () => {
            if (this.dataManager.appData.prompts.length <= 2) {
                alert('默认提示词无法删除！');
                updatePromptDeleteButtonVisibility();
                return;
            }
            const promptToDelete = this.dataManager.appData.prompts.find(p => p.id == this.dataManager.appData.activePromptId);
            if (confirm(`确定要删除提示词 "${promptToDelete.name}" 吗？`)) {
                this.dataManager.appData.prompts = this.dataManager.appData.prompts.filter(p => p.id != this.dataManager.appData.activePromptId);
                this.dataManager.appData.activePromptId = this.dataManager.appData.prompts[0].id;
                this.dataManager.save();
                populatePromptSelector();
                loadPromptDetails(this.dataManager.appData.activePromptId);
                setInjectLockState(true); 
            }
        };

        const setupUIInteractions = () => {
            const linkSliderAndInput = (slider, input, isFloat = false) => {
                if (!slider || !input) return;
                const updateFromSlider = () => {
                    input.value = isFloat ? parseFloat(slider.value).toFixed(2) : Math.round(slider.value);
                    this.updateSliderTrack(slider);
                };
                const updateFromInput = () => {
                    const min = parseFloat(slider.min);
                    const max = parseFloat(slider.max);
                    let value = isFloat ? parseFloat(input.value) : parseInt(input.value, 10);
                    if (isNaN(value)) value = min;
                    slider.value = Math.max(min, Math.min(value, max));
                    input.value = isFloat ? parseFloat(slider.value).toFixed(2) : Math.round(slider.value);
                    this.updateSliderTrack(slider);
                };
                slider.addEventListener('input', updateFromSlider);
                input.addEventListener('change', updateFromInput);
            };
            linkSliderAndInput(this.injectMaxContextSlider, this.injectMaxContextValue);
            linkSliderAndInput(this.injectMaxResponseSlider, this.injectMaxResponseValue);
            linkSliderAndInput(this.injectTempSlider, this.injectTempValue, true);
            linkSliderAndInput(this.injectTopPSlider, this.injectTopPValue, true);
        };

        if (this.promptSelect) {
            this.promptSelect.addEventListener('change', (e) => {
                this.dataManager.appData.activePromptId = e.target.value;
                this.dataManager.save();
                loadPromptDetails(e.target.value);
            });
        }
        if (this.btnNewPromptIcon) this.btnNewPromptIcon.addEventListener('click', handleNewPrompt);
        if (this.btnDeletePrompt) this.btnDeletePrompt.addEventListener('click', handleDeletePrompt);
        if (this.btnSavePrompt) this.btnSavePrompt.addEventListener('click', saveActivePrompt);
        
        populatePromptSelector();
        loadPromptDetails(this.dataManager.appData.activePromptId);
        setupUIInteractions();
        setInjectLockState(true);
    }

    updateSliderTrack(slider) {
        if (!slider) return;
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;
        const clampedVal = Math.max(min, Math.min(val, max));
        const percentage = ((clampedVal - min) * 100) / (max - min);
        slider.style.background = `linear-gradient(to right, var(--primary-blue) ${percentage}%, #ddd ${percentage}%)`;
    }

    loadScopeSettingsUI() {
        const profile = this.dataManager.getActiveUserProfile();
        if (!profile || !this.toggleGlobalApply || !this.characterBindingContainer || !this.bindCharacterSelect) return;

        this.toggleGlobalApply.checked = profile.isGlobal;

        if (profile.isGlobal) {
            this.characterBindingContainer.classList.remove('visible');
        } else {
            this.characterBindingContainer.classList.add('visible');
        }

        this.bindCharacterSelect.innerHTML = '';
        if (this.dataManager.appData.characters.length === 0) {
            const option = document.createElement('option');
            option.textContent = '暂无可选角色';
            option.disabled = true;
            this.bindCharacterSelect.appendChild(option);
        } else {
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = '请选择一个角色';
            this.bindCharacterSelect.appendChild(placeholder);

            this.dataManager.appData.characters.forEach(char => {
                const option = document.createElement('option');
                option.value = char.id;
                option.textContent = char.name;
                this.bindCharacterSelect.appendChild(option);
            });
        }
        
        this.bindCharacterSelect.value = profile.boundCharacterId || '';
    }

    updateUserAvatars(avatarUrl) {
        const activeProfile = this.dataManager.getActiveUserProfile();
        const finalAvatarUrl = avatarUrl || (activeProfile ? activeProfile.avatar : null) || 'https://i.imgur.com/uG2g8xX.png';
        if (this.userAvatarPreview) this.userAvatarPreview.src = finalAvatarUrl;
        if (this.sidebarAvatar) this.sidebarAvatar.src = finalAvatarUrl;
        if (this.headerAvatar) this.headerAvatar.src = finalAvatarUrl;
        if (this.feedAvatar) this.feedAvatar.src = finalAvatarUrl;
    }
}