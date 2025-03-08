var app = new Vue({
  el: '#app',
  data: {
    //timer関係
    status: "clear",
    time: 0,
    startTime: null,
    stopTime: 0,
    overRunTime: 20,

    //画面遷移関係
    activeScreenNo: 1,

    //ドロワー関係
    drawerVisible: false,
    direction: 'rtl',//ドロワーの方向
    width: window.innerWidth,

    //設定関係
    selectedSettingNo: 0,
    settings: [
      {
        settingName: "ex.4:6メソッド20g300ml",
        pairs: [
          { startTime: 0, targetAmount: 60 },
          { startTime: 40, targetAmount: 120 },
          { startTime: 90, targetAmount: 180 },
          { startTime: 130, targetAmount: 240 },
          { startTime: 160, targetAmount: 300 },
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
  },

  filters: {
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
    drawerWidth: function () {//ページ表示時のウィンドウ幅に応じてダイアログのwidthを計算
      if (this.width < 640)
        return "50%";//モバイル端末のとき
      else
        return "30%";//PCのとき
    },
  },

  methods: {
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
      //設定配列をロード
      let loadValue = localStorage.getItem("settings");
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
      if (newVal > this.autoStopTime)
        this.reset();
    }
  },

  mounted: function () {
    window.addEventListener('resize', this.handleResize)
    this.loadInitialData();
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }

})
