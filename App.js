// App.js

class App {
    constructor() {
        // 实例化所有管理器，并处理它们之间的依赖关系
        this.dataManager = new DataManager();
        
        // ChatManager 依赖 DataManager 来读写聊天记录
        this.chatManager = new ChatManager(this.dataManager);
        
        // UIManager 依赖 DataManager 来获取渲染数据，依赖 ChatManager 来触发聊天相关操作
        this.uiManager = new UIManager(this.dataManager, this.chatManager);

        // 为了方便在浏览器控制台调试，可以将实例挂载到 window 上
        window.felotusApp = this;
    }

    init() {
        console.log("Felotus 应用正在初始化...");

        // 1. 首先加载所有数据
        this.dataManager.load();

        // 2. 初始化聊天管理器，让它准备好
        this.chatManager.init();

        // 3. 最后初始化UI管理器，它会使用已加载的数据来渲染整个界面
        this.uiManager.init();

        console.log("Felotus 应用初始化完成！");
    }
}