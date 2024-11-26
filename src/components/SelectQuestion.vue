<template>
    <div class="app-container">
        <div id="announcement" class="announcement">
            <p>警告！！！<br>本網頁目前只僅提供電腦版本解析度優化，如有不便敬請見諒！</p>
        </div>
        <img class="calligraphy 生" src="/生.png" alt="生" />
        <img class="calligraphy 涯" src="/涯.png" alt="涯" />
        <img class="calligraphy 現" src="/現.png" alt="現" />
        <img class="calligraphy 役" src="/役.png" alt="役" />
        <img class="long-word" src="/技術課.png" alt="技術課" />
        <img class="stamp" src="/印.png" alt="印章" />
        <video autoplay loop muted class="background-video">
            <source src="../assets/E.mp4" type="video/mp4" />
            您的瀏覽器不支持視頻標籤。
        </video>
        <figure class="snip1295 po1"><img src="/dog.jpg"
                alt="sample67" />
            <div class="border one">
                <div></div>
            </div>
            <div class="border two">
                <div></div>
            </div><a href="#"></a>
        </figure>
        <figure class="snip1295 hover po2"><img src="/computer.jpg"
                alt="sample84" />
            <div class="border one">
                <div></div>
            </div>
            <div class="border two">
                <div></div>
            </div><a href="#"></a>
        </figure>
        <figure class="snip1295 po3"><img src="/cat.jpg"
                alt="sample68" />
            <div class="border one">
                <div></div>
            </div>
            <div class="border two">
                <div></div>
            </div><a href="#"></a>
        </figure>
        <div class="container">
            <h1>選擇題目</h1>
            <div class="input-selection">
                <div class="inputBox">
                    <input type="text" v-model="positionNumber" required />
                    <i class="fa-solid fa-map-location-dot" style="color: #63E6BE;"></i>
                    <span>崗位號碼</span>
                </div>
            </div>
            <div class="input-selection">
                <div class="inputBox">
                    <input type="text" v-model="name" required />
                    <i class="fa-regular fa-user"></i>
                    <span>姓名</span>
                </div>
            </div>
            <div class="question-selection">
                <div class="question-option">
                    <label class="radio-button" :class="{ active: selectedQuestion === 'A' }"
                        @click="selectedQuestion = 'A'">
                        A
                    </label>
                </div>
                <h4>或</h4>
                <div class="question-option">
                    <label class="radio-button" :class="{ active: selectedQuestion === 'B' }"
                        @click="selectedQuestion = 'B'">
                        B
                    </label>
                </div>
            </div>
            <div class="score-selection">
                <strong>選擇題號</strong>
                <select v-model="selectedScore" class="select-box" @focus="addFocus" @blur="removeFocus">
                    <option v-for="score in scores" :key="score" :value="score">{{ score }}</option>
                </select>
            </div>
            <div class="answer-selection">
                <strong>選擇類別</strong>
                <select v-model="selectedAnswer" class="select-box" @focus="addFocus" @blur="removeFocus">
                    <option v-for="answer in answers" :key="answer" :value="answer">{{ answer }}</option>
                </select>
            </div>
            <button @click="submit" :disabled="!isFormValid">
                <div class="svg-wrapper-1">
                    <div class="svg-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path fill="currentColor"
                                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z">
                            </path>
                        </svg>
                    </div>
                </div>
                <span>提交</span>
            </button>
            <p class="copyright">© 2024 - {{ Year }} 花蓮高工電子科保留所有權利。 屬名：octikcok</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedQuestion: '',
            selectedScore: '',
            selectedAnswer: '',
            scores: [1, 2, 3, 4, 5],
            answers: ['J', 'K', 'L', 'M', 'N'],
            positionNumber: '',
            name: '',
            Year: new Date().getFullYear(),
        };
    },
    computed: {
        isFormValid() {
            return this.selectedQuestion && this.selectedScore && this.selectedAnswer && this.positionNumber && this.name;
        }
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
    methods: {
        submit() {
            if (this.isFormValid) {
                this.$router.push({
                    name: 'CompareCode',
                    params: {
                        name: this.name,
                        question: this.selectedQuestion,
                        score: this.selectedScore,
                        answer: this.selectedAnswer,
                        positionNumber: this.positionNumber,
                    },
                });
            } else {
                alert('請填寫所有必填字段！'); // 提示用戶填寫必填字段
            }
        },
        addFocus(event) {
            event.target.classList.add('focused');
        },
        removeFocus(event) {
            event.target.classList.remove('focused');
        },
    },
};
</script>

<style>
.app-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container {
    position: absolute;
    left: 50px;
    max-width: 600px;
    width: 100%;
    padding: 20px;
    border-radius: 16px;
    background: rgba(34, 50, 67, 0.73);
    backdrop-filter: blur(6.2px);
    -webkit-backdrop-filter: blur(6.2px);
    padding: 40px;
    border-radius: 20px;
    border: 8px solid #223243;
    box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
        5px 5px 15px rgba(0, 0, 0, 0.35),
        inset -5px -5px 15px rgba(255, 255, 255, 0.1),
        inset 5px 5px 15px rgba(0, 0, 0, 0.35);
}

h1 {
    text-align: center;
    color: #fff;
}

.input-selection {
    margin: 20px 0;
}

.inputBox {
    position: relative;
    max-width: 535px;
    width: 100%;
}

.inputBox input {
    padding: 12px 10px 12px 48px;
    border: none;
    width: 100%;
    background: #223243;
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: #fff;
    font-weight: 300;
    border-radius: 25px;
    font-size: 1em;
    box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
        5px 5px 15px rgba(0, 0, 0, 0.35);
    transition: 0.5s;
    outline: none;
}

.inputBox span {
    position: absolute;
    top: -2.5px;
    left: 0;
    padding: 12px 48px;
    pointer-events: none;
    font-size: 1em;
    font-weight: 300;
    transition: 0.5s;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.5);
    opacity: 1;
}

.inputBox i {
    position: absolute;
    top: 12px;
    left: 16px;
    width: 25px;
    padding: 2px 0;
    padding-right: 2px;
    color: #00dfc4;
    border-right: 1px solid #00dfc4;
}

.inputBox input:valid~span,
.inputBox input:focus~span {
    color: #00dfc4;
    border: 1px solid #00dfc4;
    background: #223243;
    transform: translateX(25px) translateY(-7px);
    font-size: 0.6em;
    padding: 0 8px;
    border-radius: 10px;
    letter-spacing: 0.1em;
    opacity: 1;
}

.inputBox input:valid,
.inputBox input:focus {
    border: 1px solid #00dfc4;
}

.background-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}

/* From Uiverse.io by adamgiebl */
button {
    margin-top: 10px;
    width: 100%;
    font-family: inherit;
    font-size: 20px;
    background: #0077ffde;
    color: white;
    padding: 0.7em 1em;
    padding-left: 0.9em;
    display: flex;
    align-items: center;
    border: none;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
    justify-content: center;
    text-align: center;
}

button span {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
}

button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
}

button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
}

button:hover svg {
    transform: translateX(1.2em) rotate(45deg) scale(1.1);
}

button:hover span {
    transform: translateX(100em);
}

button:active {
    transform: scale(0.95);
}

@keyframes fly-1 {
    from {
        transform: translateY(0.1em);
    }

    to {
        transform: translateY(-0.1em);
    }
}

.select-box {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    color: #333;
}

.score-selection {
    margin: 0;
}

.radio-button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s;
    width: 100%;
}

.radio-button.active {
    background-color: #00dfc4;
    color: #fff;
    width: 100%;
}

.question-option {
    color: white;
    margin: 10px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    /* From https://css.glass */
    background: rgba(0, 187, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(0, 187, 255, 0.3);
}

.question-selection {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
}

.answer-selection {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.answer-selection select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    color: #333;
}

.copyright {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: -20px;
}

.snip1295 {
    position: relative;
    overflow: hidden;
    margin: 7px;
    padding: 6px;
    min-width: 230px;
    max-width: 315px;
    width: 100%;
    box-shadow: none !important;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-box-sizing: padding-box;
    box-sizing: padding-box;
}

.snip1295 img {
    max-width: 100%;
    vertical-align: top;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}

.snip1295 .border {
    position: absolute;
    opacity: 0.45;
}

.snip1295 .border:before,
.snip1295 .border:after,
.snip1295 .border div:before,
.snip1295 .border div:after {
    background-color: #f5b043;
    position: absolute;
    content: "";
    display: block;
    -webkit-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
}

.snip1295 .border:before,
.snip1295 .border:after {
    width: 0;
    height: 1px;
}

.snip1295 .border div:before,
.snip1295 .border div:after {
    width: 1px;
    height: 0;
}

.snip1295 .border.one {
    left: 0;
    top: 0;
    right: 12px;
    bottom: 12px;
}

.snip1295 .border.one:before,
.snip1295 .border.one div:before {
    left: 0;
    top: 0;
}

.snip1295 .border.one:after,
.snip1295 .border.one div:after {
    bottom: 0;
    right: 0;
}

.snip1295 .border.two {
    left: 12px;
    top: 12px;
    right: 0;
    bottom: 0;
}

.snip1295 .border.two:before,
.snip1295 .border.two div:before {
    right: 0;
    top: 0;
}

.snip1295 .border.two:after,
.snip1295 .border.two div:after {
    bottom: 0;
    left: 0;
}

.snip1295 a {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
    z-index: 1;
}

.snip1295:hover .border:before,
.snip1295.hover .border:before,
.snip1295:hover .border:after,
.snip1295.hover .border:after {
    width: 100%;
}

.snip1295:hover .border div:before,
.snip1295.hover .border div:before,
.snip1295:hover .border div:after,
.snip1295.hover .border div:after {
    height: 100%;
}

.po1 {
    position: absolute;
    top: 1svh;
    right: 1svw;
}

.po2 {
    position: absolute;
    top: 34svh;
    right: 25svw;
}

.po3 {
    position: absolute;
    bottom: 1svh;
    right: 1svw;
}

.announcement {
    background-color: rgba(255, 0, 0, 0.8);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: absolute;
    top: 5svh;
    height: 10svh;
    width: 95%;
    border-radius: 15px;
    animation: announcementIn 2s ease forwards, announcementOut 2s ease forwards 7s;
    z-index: 9999;
}

@keyframes announcementIn {
    0% {
        opacity: 0;
        transform: translateY(-10em);
    }

    20% {
        opacity: 1;
    }

    30% {
        opacity: 0;
    }

    40% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes announcementOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }

    to {
        opacity: 0;
        transform: translateY(-20em);
    }
}

.calligraphy {
    max-width: 10svw;
    max-height: 10svw;
    width: 100%;
    height: 100%;
}

.生 {
    position: absolute;
    top: 2svh;
    right: 37svw;
}

.涯 {
    position: absolute;
    top: 13.5svh;
    right: 25svw;
}

.現 {
    position: absolute;
    bottom: 12svh;
    right: 37svw;
}

.役 {
    position: absolute;
    bottom: 0;
    right: 25svw;
}

.long-word {
    position: absolute;
    margin-bottom: -1.5svh;
    margin-right: -5svh;
    right: 20svw;
    max-height: 35svh;
    max-width: 5svw;
    width: 100%;
    height: 100%;
}

.stamp {
    position: absolute;
    margin-bottom: -14svh;
    margin-right: -5svh;
    right: 15svw;
    max-height: 20svh;
    max-width: 4svw;
    width: 100%;
    height: 100%;
}
</style>
