<template>
    <div class="compare-container">
        <div class="header-container">
            <h1>花工電子科程式比對程式</h1>
            <div class="result-display">
                <p>{{ displayName }}</p>
                <p>{{ displayDetails }}</p>
            </div>
        </div>
        <div class="code-input-section">
            <div class="code-wrapper">
                <pre id="user-line-numbers" class="line-numbers"></pre>
                <textarea v-model="userCode" class="code-input" placeholder="請輸入您的程式碼..."
                    @input="updateLineNumbers('userCode', 'user-line-numbers')"></textarea>
            </div>
            <div v-if="resultMessage" class="result-message" v-html="resultMessage"></div>
            <h2 style="color: #00a8d2;">原稿資料</h2>
            <div class="code-wrapper">
                <pre id="reference-line-numbers" class="line-numbers"></pre>
                <textarea v-model="referenceCode" class="code-input" readonly
                    @input="updateLineNumbers('referenceCode', 'reference-line-numbers')"
                    @change="updateLineNumbers('referenceCode', 'reference-line-numbers')"></textarea>
            </div>
            <button @click="submitCode" class="pushable">
                <span class="shadow"></span>
                <span class="edge"></span>
                <span class="front"> 提交 </span>
            </button>
        </div>
    </div>
    <div class="footer-copyright">© 2024 - {{ Year }} 花蓮高工電子科保留所有權利。 屬名：octikcok</div>
</template>

<script>
export default {
    data() {
        return {
            userCode: '',
            referenceCode: '',
            resultMessage: '',
            displayName: `姓名: ${this.$route.params.name} | 你選的題目是: ${this.$route.params.question}-${this.$route.params.score}-${this.$route.params.answer}`,
            displayDetails: `崗位: ${this.$route.params.positionNumber} | 日期：${new Date().toLocaleDateString()} | 術科編號：${Math.floor(1000 + Math.random() * 9000)}`,
            errors: [],
            score: 100,
            Year: new Date().getFullYear(),
        };
    },
    methods: {
        async submitCode() {
            const questionPath = `/data/${this.$route.params.question}/${this.$route.params.score}/${this.$route.params.question}-${this.$route.params.score}-${this.$route.params.answer}.txt`;
            try {
                const response = await fetch(questionPath);
                if (!response.ok) throw new Error('文件未找到');
                this.referenceCode = await response.text();
                this.compareCodes();
                this.updateLineNumbers('referenceCode', 'reference-line-numbers');
            } catch (error) {
                this.resultMessage = error.message;
            }
        },
        compareCodes() {
            const originalLines = this.referenceCode.split('\n');
            const userLines = this.userCode.split('\n');
            this.errors = [];
            this.score = 100;

            let originalLineIndex = 0; // 用於追蹤原稿行的索引
            let userLineIndex = 0; // 用於追蹤用戶行的索引
            let hasUserInput = false; // 用於檢查用戶是否有輸入

            userLines.forEach((userLine) => {
                const userLineTrimmed = userLine.trim();

                // 找到下一個非空的原稿行
                while (originalLineIndex < originalLines.length && originalLines[originalLineIndex].trim() === '') {
                    originalLineIndex++; // 跳過空行
                }

                // 如果原稿行已經用完，則報告錯誤
                if (originalLineIndex >= originalLines.length) {
                    if (userLineTrimmed !== '') {
                        this.errors.push(`第 ${userLineIndex + 1} 行錯誤，但原稿行已經用完`); // 記錄錯誤行
                    }
                    userLineIndex++; // 增加用戶行索引
                    return; // 跳過當前行，檢查下一行
                }

                // 檢查用戶行是否為空
                if (userLineTrimmed === '') {
                    userLineIndex++; // 增加用戶行索引
                    originalLineIndex++; // 同時增加原稿行索引
                    return; // 跳過當前行，檢查下一行
                }

                // 標記用戶有輸入
                hasUserInput = true;

                const originalLineTrimmed = originalLines[originalLineIndex].trim();

                // 比較原稿行和用戶行
                if (originalLineTrimmed !== userLineTrimmed) {
                    this.errors.push(`第 ${userLineIndex + 1} 行錯誤，用戶輸入為 "${userLineTrimmed}"`); // 記錄錯誤行
                    this.score = 0; // 只要有一個錯誤就設置為 0 分
                }

                // 增加原稿行索引和用戶行索引
                originalLineIndex++;
                userLineIndex++;
            });

            // 檢查用戶是否有輸入
            if (!hasUserInput) {
                this.errors.push('用戶未輸入任何內容，請填寫程式碼。');
                this.score = 0; // 如果沒有輸入，設置為 0 分
            } else if (userLines.length < originalLines.length) { // 檢查用戶行數是否小於原稿行數
                this.errors.push('用戶輸入的行數少於原稿行數，請檢查。');
                this.score = 0; // 如果行數不夠，設置為 0 分
            }

            // 更新結果信息
            if (this.errors.length > 0) {
                this.resultMessage = '比對結果:<br>' + this.errors.join('<br>'); // 使用 Vue 的數據綁定
            } else {
                this.resultMessage = '無錯誤！';
            }

            // 顯示分數
            this.resultMessage += `<br>你的分數是: ${this.score} 分`; // 更新分數信息
        },
        updateLineNumbers(textareaId, lineNumbersId) {
            const textarea = this[textareaId];
            const lineNumbers = document.getElementById(lineNumbersId);
            const numberOfLines = textarea.split('\n').length;
            let lineNumberText = '';
            for (let i = 1; i <= numberOfLines; i++) {
                lineNumberText += i + '\n';
            }
            lineNumbers.textContent = lineNumberText;
        },
    },
    mounted() {
        // 使用 Vue 的方法來處理 hover 事件
        const hoverElements = document.querySelectorAll('.hover');
        hoverElements.forEach(element => {
            element.addEventListener('mouseleave', function () {
                this.classList.remove('hover');
            });
        });
    },
};
</script>

<style>
.compare-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    max-height: 500svh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    background-color: #223243;
    /* color: #00a8d2; */
}

.result-display {
    margin-left: 30px;
    margin-bottom: 5px;
    font-size: 18px;
    color: red;
}

.code-input-section {
    width: 95%;
}

.code-wrapper {
    display: flex;
    margin: 10px 0;
    
}

.line-numbers {
    width: 40px;
    text-align: right;
    padding-right: 10px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-right: none;
    color: #888;
    font-family: monospace;
    padding-top: 12px;
    margin: 0;
    max-height: 210px;
    overflow-y: scroll;
}

.code-input {
    width: 100%;
    height: 200px;
    padding: 10px;
    font-family: monospace;
    font-size: 14px;
    border: 1px solid #ccc;
    border-left: none;
    resize: none;
    line-height: 1.5;
}

/* From Uiverse.io by PriyanshuGupta28 */
.pushable {
    position: relative;
    width: 100%;
    background: transparent;
    padding: 0px;
    border: none;
    cursor: pointer;
    outline-offset: 4px;
    outline-color: deeppink;
    transition: filter 250ms;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    margin-bottom: 60px;
}

.shadow {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: hsl(226, 25%, 69%);
    border-radius: 8px;
    filter: blur(2px);
    will-change: transform;
    transform: translateY(2px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

.edge {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    background: linear-gradient(to right,
            hsl(248, 39%, 39%) 0%,
            hsl(248, 39%, 49%) 8%,
            hsl(248, 39%, 39%) 92%,
            hsl(248, 39%, 29%) 100%);
}

.front {
    display: block;
    position: relative;
    border-radius: 8px;
    background: hsl(248, 53%, 58%);
    padding: 16px 32px;
    color: white;
    width: 100%;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 1rem;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
}

.pushable:hover {
    filter: brightness(110%);
}

.pushable:hover .front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.pushable:active .front {
    transform: translateY(-2px);
    transition: transform 34ms;
}

.pushable:hover .shadow {
    transform: translateY(4px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}

.pushable:active .shadow {
    transform: translateY(1px);
    transition: transform 34ms;
}

.pushable:focus:not(:focus-visible) {
    outline: none;
}


.result-message {
    margin-top: 10px;
    font-weight: bold;
    color: red;
}

/* WebKit 瀏覽器的捲動條樣式 */
::-webkit-scrollbar {
    width: 12px;
    /* 捲動條的寬度 */
    height: 12px;
    /* 水平捲動條的高度 */
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    /* 捲動條的背景 */
    border-radius: 10px;
    /* 圓角 */
}

::-webkit-scrollbar-thumb {
    background: #007a67;
    /* 捲動條的顏色 */
    border-radius: 10px;
    /* 圓角 */
}

::-webkit-scrollbar-thumb:hover {
    background: #005f4f;
    /* 滑鼠懸停時的顏色 */
}

/* Firefox 的捲動條樣式 */
* {
    scrollbar-width: thin;
    /* 捲動條的寬度 */
    scrollbar-color: #007a67 #f1f1f1;
    /* 滑塊顏色和背景顏色 */
}

.footer-copyright {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background-color: black;
    height: 50px;
    margin: 0;
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px;
}
</style>
