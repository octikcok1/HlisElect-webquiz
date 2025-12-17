<template>
    <div class="compare-container">
        <div class="containerr">
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
                
                <!-- 新增的表格區域 -->
                <div class="table-section" style="margin-top: 20px;">
                    <h2 style="color: #00a8d2;">{{ questionType }} 題腳位練習</h2>
                    <table class="config-table">
                        <thead>
                            <tr>
                                <th>Node Name</th>
                                <th>Direction</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(node, index) in nodes" :key="index">
                                <td>{{ node.name }}</td>
                                <td>{{ node.direction }}</td>
                                <td>
                                    <!-- 使用 input + datalist 實現下拉 + 輸入過濾 -->
                                    <!-- 使用 input + datalist 實現下拉 + 輸入過濾 -->
                                    <input list="pin-options" v-model="node.location" placeholder="輸入或選擇 PIN" @focus="$event.target.select()" class="dropdown-input">
                                    <datalist id="pin-options">
                                        <option v-for="pin in pinOptions" :key="pin" :value="pin"></option>
                                    </datalist>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- 隱藏的比對結果顯示區 -->
                    <div v-if="showTableResult" class="table-result-message" v-html="tableResultMessage"></div>
                    <!-- 表格提交按鈕 -->
                    <button @click="submitTable" class="pushable" style="margin-top: 10px;">
                        <span class="shadow"></span>
                        <span class="edge"></span>
                        <span class="front"> 提交表格 </span>
                    </button>
                </div>
                
                <img class="imgg" src="/m01.jpg" alt="示範圖">
                <p style="color: white;margin-top: 10px;margin-bottom: 30px;">© 2024 - {{ Year }} 花蓮高工電子科保留所有權利。 屬名：octikcok</p>
            </div>
        </div>
    </div>
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
            // 新增表格相關數據
            nodes: [], // 根據 A/B 題動態載入
            pinOptions: [], // PIN_0 ~ PIN_45
            showTableResult: false, // 初始隱藏結果
            tableResultMessage: '', // 結果訊息
            currentAnswerSet: [], // 儲存當前題目的正確答案（隱藏）
        };
    },
    computed: {
        questionType() {
            return this.$route.params.question === 'A' ? 'A' : 'B';
        },
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
            const originalLines = this.referenceCode.split('\n'); // 原稿行
            const userLines = this.userCode.split('\n'); // 用戶行
            this.errors = [];
            this.score = 100;

            let originalLineIndex = 0; // 用於追蹤原稿行的索引
            let hasUserInput = false; // 用於檢查用戶是否有輸入

            // 過濾掉原稿和用戶輸入中的空行
            const filteredOriginalLines = originalLines.filter(line => line.trim() !== '');
            const filteredUserLines = userLines.filter(line => line.trim() !== '');

            // 檢查用戶行數是否小於原稿行數
            if (filteredUserLines.length < filteredOriginalLines.length) {
                this.errors.push('用戶輸入的行數少於原稿行數，請檢查。');
                this.score = 0; // 如果行數不夠，設置為 0 分
            }

            filteredUserLines.forEach((userLine, userLineIndex) => {
                const userLineTrimmed = userLine.trim();

                // 忽略空行和註釋
                if (userLineTrimmed === '' || userLineTrimmed.startsWith('//')) {
                    return; // 跳過空行和註釋
                }

                hasUserInput = true; // 標記用戶有輸入

                // 找到下一個非空的原稿行，並忽略註釋
                while (originalLineIndex < filteredOriginalLines.length) {
                    const originalLineTrimmed = filteredOriginalLines[originalLineIndex].trim();
                    if (originalLineTrimmed === '' || originalLineTrimmed.startsWith('//')) {
                        originalLineIndex++; // 跳過空行和註釋
                        continue;
                    }
                    break; // 找到非空行，退出循環
                }

                // 如果原稿行已經用完，則報告錯誤
                if (originalLineIndex >= filteredOriginalLines.length) {
                    this.errors.push(`第 ${userLineIndex + 1} 行錯誤，用戶輸入為<br> "${userLineTrimmed}"，原稿已用完。`);
                    return; // 跳過當前行，檢查下一行
                }

                const originalLineTrimmed = filteredOriginalLines[originalLineIndex].trim();

                // 比較原稿行和用戶行，忽略空格
                if (originalLineTrimmed !== userLineTrimmed) {
                    this.errors.push(`第 ${userLineIndex + 1} 行錯誤，用戶輸入為<br> "${userLineTrimmed}"`); // 記錄錯誤行
                    this.score = 0; // 只要有一個錯誤就設置為 0 分
                }

                // 增加原稿行索引
                originalLineIndex++;
            });

            // 檢查用戶是否有輸入
            if (!hasUserInput) {
                this.errors.push('用戶未輸入任何內容，請填寫程式碼。');
                this.score = 0; // 如果沒有輸入，設置為 0 分
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
        // 新增方法：初始化 PIN 選項
        initPinOptions() {
            this.pinOptions = [];
            for (let i = 0; i <= 45; i++) {
                this.pinOptions.push(`PIN_${i}`);
            }
        },
        // 修改方法：載入表格節點根據 A/B 題與分數（題號）
        async loadNodes() {
            const questionType = this.$route.params.question || 'A';
            const questionScore = this.$route.params.score || '1'; // 默認題號 1

            try {
                const response = await fetch('/data/table_answers.json');
                if (!response.ok) throw new Error('無法載入答案檔');
                const allAnswers = await response.json();

                if (allAnswers[questionType] && allAnswers[questionType][questionScore]) {
                    this.currentAnswerSet = allAnswers[questionType][questionScore];
                    // 初始化 UI nodes：複製結構但清空 location (答案)
                    this.nodes = this.currentAnswerSet.map(item => ({
                        name: item.name,
                        direction: item.direction,
                        location: '' // 用戶需填寫的部分，預設為空
                    }));
                } else {
                    this.tableResultMessage = '查無此題號之表格設定';
                    this.nodes = [];
                }
            } catch (error) {
                console.error('載入表格失敗:', error);
                this.tableResultMessage = '載入表格失敗，請檢查網路或檔案。';
            }
        },
        // 修改方法：提交表格並比對
        submitTable() {
            this.showTableResult = true;
            let correctCount = 0;
            let totalCount = this.currentAnswerSet.length;
            let errorDetails = [];

            this.nodes.forEach((userNode, index) => {
                const correctNode = this.currentAnswerSet[index];
                const userLocation = (userNode.location || '').trim().toUpperCase();
                const correctLocation = (correctNode.answer || '').trim().toUpperCase();

                // 若正確答案為空，則視為不需填寫或任意皆可（依需求定，目前假設需精確比對）
                // 如果正確答案是空字串，通常代表該腳位不需要設定，若用戶留空算對
                if (userLocation === correctLocation) {
                    correctCount++;
                } else {
                    errorDetails.push(`腳位 <b>${userNode.name}</b> 錯誤：您填寫 <b>${userLocation || '(空)'}</b>，應為 <b>${correctLocation || '(無)'}</b>`);
                }
            });

            const score = Math.round((correctCount / totalCount) * 100);
            
            let message = `比對完成！<br>分數：${score} 分<br>`;
            if (errorDetails.length > 0) {
                message += `<br>錯誤詳情：<br>${errorDetails.join('<br>')}`;
            } else {
                message += `<br>恭喜！全對！`;
            }
            
            this.tableResultMessage = message;
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
        // 初始化 PIN 選項和表格節點
        this.initPinOptions();
        this.loadNodes();
    },
};
</script>

<style scoped>
/* 原有樣式保持不變，以下新增表格相關樣式 */
.imgg {
    position: relative; 
    left: 25svw;
    width: 50%;
    height: auto;
    margin-top: 30px;
    margin-bottom: 10px;
}

.containerr {
    position: relative;
    width: 95%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.compare-container {
    position: relative;
    top: 0;
    left: 0;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #223243;
    padding-bottom: 20px;
}

.result-display {
    position: relative;
    top: 0;
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

/* ... (其他 pushable 等樣式保持不變) */

.result-message {
    margin-top: 10px;
    font-weight: bold;
    color: red;
}

/* 新增表格樣式 */
.config-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
}

.config-table th, .config-table td {
    border: 1px solid #4a5568;
    padding: 8px;
    text-align: left;
    color: #e0e0e0;
}

.config-table th {
    background-color: #2c3e50;
    color: #ffffff;
}

.config-table input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #555;
    border-radius: 4px;
    font-size: 14px;
    background-color: #16202a;
    color: #fff;
}

/* 確保在 Chrome/Edge 等瀏覽器中顯示下拉箭頭，並設為亮色以可見 */
.config-table input::-webkit-calendar-picker-indicator {
    opacity: 1;
    cursor: pointer;
    margin-left: -10px;
    filter: invert(1);
}

.config-table input:focus {
    outline: 2px solid #00a8d2;
    border-color: #00a8d2;
}

.table-result-message {
    margin-top: 10px;
    font-weight: bold;
    color: red;
    margin-bottom: 10px;
}

.pushable {
    margin-top: 10px;
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
    width: 95%;
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

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px;
}


h1 {
    text-align: center;
    color: #fff;
}
</style>