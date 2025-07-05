const App = {
  data() {
    return {
      //timer関係
      status: "clear",
      time: 0,
      startTime: null,
      stopTime: 0,
      overRunTime: 20,

      //画面遷移関係
      isFirstTime: true, //初回起動かどうか
      activeScreenNo: 0,

      //ドロワー関係
      drawerVisible: false,
      direction: 'rtl',//ドロワーの方向
      width: window.innerWidth,

      //設定関係
      selectedSettingNo: 0,
      beanQuantity: 20,
      beanQuantityDialogVisible: false,
      settings: [
        {
          settingName: "ex.4:6メソッド20g300ml",
          pairs: [
            { startTime: 0, targetAmount: 60 },
            { startTime: 45, targetAmount: 120 },
            { startTime: 90, targetAmount: 180 },
            { startTime: 135, targetAmount: 240 },
            { startTime: 165, targetAmount: 300 },
          ]
        },
        {
          settingName: "新しい設定#2",
          pairs: [
            { startTime: 0, targetAmount: 0 },
          ]
        },
        {
          settingName: "新しい設定#3",
          pairs: [
            { startTime: 0, targetAmount: 0 },
          ]
        },
        {
          settingName: "新しい設定#4",
          pairs: [
            { startTime: 0, targetAmount: 0 },
          ]
        },
        {
          settingName: "新しい設定#5",
          pairs: [
            { startTime: 0, targetAmount: 0 },
          ]
        },
        {
          settingName: "新しい設定#6",
          pairs: [
            { startTime: 0, targetAmount: 0 },
          ]
        },
        {
          settingName: "新しい設定#7",
          pairs: [
            { startTime: 0, targetAmount: 0 },
          ]
        },
        {
          settingName: "新しい設定#8",
          pairs: [
            { startTime: 0, targetAmount: 0 },
          ]
        },
      ],
    }
  },

  computed: {// 何か処理をした結果をデータとして返す
    getTimerSecondValue: function () {
      return Math.floor(this.time / 1000);
    },
    isOnly1PairItem: function () {
      return this.settings[this.selectedSettingNo].pairs.length === 1;
    },
    autoStopTime: function () {
      return this.settings[this.selectedSettingNo].pairs.at(-1).startTime + this.overRunTime;//末尾要素の時間+overRunTimeを返す
    },

    dripStartTimes: function () {
      let times = [];
      this.settings[this.selectedSettingNo].pairs.forEach(pair => {
        times.push(pair.startTime);
      });
      return times;
    },

    drawerWidth: function () {//ページ表示時のウィンドウ幅に応じてダイアログのwidthを計算
      if (this.width < 640)
        return "50%";//モバイル端末のとき
      else
        return "30%";//PCのとき
    },
    beanQuantityDialogWidth: function () {
      if (this.width < 640)
        return "60%";//モバイル端末のとき
      else
        return "30%";//PCのとき
    }
  },

  methods: {
    //現在の設定に4:6メソッドに基づいた設定値を投入
    fill46Value() {
      let resultArray = new Array();
      let waterQuantity = this.beanQuantity * 15;
      let timeTable = new Array(0, 45, 90, 135, 165);
      for (let i = 1; i <= 5; i++) {
        resultArray.push({ startTime: timeTable[i - 1], targetAmount: waterQuantity / 5 * i });
      }
      this.settings[this.selectedSettingNo].pairs = resultArray;
      this.settings[this.selectedSettingNo].settingName = "豆の量" + this.beanQuantity + "g" + "湯量" + waterQuantity + "ml";
      this.beanQuantityDialogVisible = false;
    },

    //現在のカウント値に基づき各抽出量行の色を変えるためのクラス名を返す
    getRowColor(idx) {
      let row_pairs = this.settings[this.selectedSettingNo].pairs;
      let s_time = row_pairs[idx].startTime;
      let next_row_time = row_pairs.length <= idx + 1 ? 999 : row_pairs[idx + 1].startTime;

      if (this.status !== "start")
        return { "normal-row": true }

      if (s_time <= this.getTimerSecondValue && this.getTimerSecondValue < next_row_time) {
        //デューティー比6:4で明:滅
        if (this.time % 1000 < 600)
          return { "active-row": true }
        else
          return { "normal-row": true }
      } else if (this.getTimerSecondValue < s_time)
        return { "normal-row": true }
      else
        return { "inactive-row": true }
    },

    start() {
      new Audio('sound/start.mp3').play();
      this.status = "start"

      if (this.startTime === null) {
        this.startTime = Date.now()
      }

      const checkTime = () => {
        this.time = Date.now() - this.startTime + this.stopTime
      }
      this.timer = setInterval(checkTime, 10);
    },
    stop() {
      if (this.timer) {
        clearInterval(this.timer);
      }

      this.status = "stop"
      this.startTime = null
      this.stopTime = this.time
    },
    reset() {
      new Audio('sound/reset.mp3').play();
      this.stop()
      this.status = "clear"
      this.time = 0
      this.startTime = null
      this.stopTime = 0
    },
    getTimeStr() {
      // this.time is milliseconds
      // 1秒 = 1000ミリ秒
      // 1分 = 60 * 1000ミリ秒
      // 1時間 = 60 * 60 * 1000ミリ秒
      let milliseconds = this.time % 1000
      let seconds = Math.floor((this.time / 1000) % 60)
      let minutes = Math.floor((this.time / (60 * 1000)) % 60)
      //let hours = Math.floor(this.time / (60 * 60 * 1000))

      let millisecondsMultiplyTen = Math.floor(milliseconds / 10)

      millisecondsMultiplyTen = ("0" + millisecondsMultiplyTen).slice(-2)
      seconds = ("0" + seconds).slice(-2)
      minutes = ("0" + minutes).slice(-2)
      //hours = hours < 100 ? ("0" + hours).slice(-2) : hours

      return `${minutes}:${seconds}.${millisecondsMultiplyTen}`
    },

    handleResize: function () {
      // resizeのたびにやりたいことを記述
      this.width = window.innerWidth;
    },

    loadInitialData() {
      let loadValue = localStorage.getItem("visited");
      if (loadValue !== null)
        this.isFirstTime = false;

      //設定配列をロード
      loadValue = localStorage.getItem("settings");
      if (loadValue !== null)
        this.settings = JSON.parse(loadValue);

      //メイン画面で前回最後に選択していた設定をロード
      loadValue = localStorage.getItem("selectedSettingNo");
      this.selectedSettingNo = loadValue !== null ? parseInt(loadValue) : 0;
    },

    addPairItem() {
      this.settings[this.selectedSettingNo].pairs.push({ startTime: 0, targetAmount: 0 });
    },

    deletePairItem(idx) {
      this.settings[this.selectedSettingNo].pairs.splice(idx, 1);
    }

  },

  watch: {
    selectedSettingNo: function (newVal, oldVal) {
      localStorage.setItem("selectedSettingNo", String(newVal));
    },

    settings: {
      handler(newVal, oldVal) {
        localStorage.setItem("settings", JSON.stringify(newVal));
      },
      deep: true //配列要素の監視時に必要
    },

    getTimerSecondValue: function (newVal, oldVal) {
      //newValが0ではなくかつdripStartTImes内の値のどれかなら注ぎ始めを知らせる音を鳴らす
      if (newVal !== 0 && this.dripStartTimes.some((arrVal) => newVal === arrVal))
        new Audio('sound/next.mp3').play();
      if (newVal > this.autoStopTime)
        this.reset();
    }
  },

  mounted: function () {
    window.addEventListener('resize', this.handleResize)
    this.loadInitialData();
    if (this.isFirstTime) {
      localStorage.setItem("visited", '1');
      this.activeScreenNo = 3;
    }
    else
      this.activeScreenNo = 1;
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }

};
const app = Vue.createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus);
app.mount('#app');
