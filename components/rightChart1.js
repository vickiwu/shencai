var ElementView = require("comjs:element-ui-view");
var echarts = require('comjs:echarts');
const DefaultXAxis = ["国三", "国四", "国五", "国六"],
  DefaultPieData = [{
    name: "国三",
    value: 6
  }, {
    name: "国四",
    value: 9
  }, {
    name: "国五",
    value: 3
  }, {
    name: "国六",
    value: 3
  }],
  DefaultTotal = 0;

class Page extends ElementView {
  constructor(xAxis = DefaultXAxis, pieData = DefaultPieData, total = DefaultTotal) {
    super();
    !Array.isArray(pieData) && (pieData = DefaultPieData);
    !Array.isArray(xAxis) && (xAxis = DefaultXAxis)

    this.xAxis = xAxis;
    this.pieData = pieData;
    this.total = total
  }
  onCreate() {
    this.setDefine(require, exports, module);

    var me = this;

    var template = `<div>
  <div id="right-chart1"></div>
  <div class="show-no-data" v-if="!showRightChartData1">暂无数据</div>
</div>`;

    var vueConfig = {
      template: template,
      data() {
        return {
          loading: false,
          showRightChartData1: (me.xAxis.length !== 0),
          rightChartData1: {
            XAxis: me.xAxis,
            pieData: me.pieData,
            total: me.total
          },
          height: "200px",
          chart: null

        }
      },
      methods: {
        initRightEchart1(xAxis, pieData, total) {
          xAxis === null && (xAxis = [])
          pieData === null && (pieData = [])
          total === null && (total = 0)

          this.chart = echarts.init(document.getElementById('right-chart1'))
          var color = ['#55E0B6', '#64A3FF', '#FBD178', '#F52A64']
          var myPieData = []
          for (var i = 0; i < pieData.length; i++) {
            myPieData.push({
              value: pieData[i].value,
              name: pieData[i].name,
              itemStyle: {
                normal: {
                  borderWidth: 2, //3,
                  borderColor: color[i]
                }
              }
            }, {
              value: 0, //total * 0.01,
              name: '',
              itemStyle: {
                normal: {
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  color: 'rgba(0, 0, 0, 0)',
                  borderColor: 'rgba(0, 0, 0, 0)',
                  borderWidth: 0
                }
              }
            })
          }

          this.chart.setOption({
            tooltip: {
              trigger: 'item'
              // formatter: "{a} <br/>{b}: {c} ({d}%)",
            },
            color: color,
            legend: {
              orient: 'vertical',
              right: '10%',
              bottom: '10%',
              data: xAxis,
              textStyle: {
                color: "#a6aebd",
              }
            },
            // color: ["#4f81bd", "#c0504d", "9bbb59", "8064a2"],

            series: [{
              // name: '面积模式',
              type: 'pie',
              radius: ['60%', '80%'],
              center: ['35%', '50%'],
              data: myPieData,
              label: {
                show: false
              }
            }]
          })
        },
        chartResize() {
          var thisVue = this;
          var height = me.fitHeight() + 'px';
          thisVue.height = height
          thisVue.chart.resize({
            height: thisVue.height
          })

        }
      },
      created: function () {},
      mounted() {
        var thisVue = this;
        thisVue.initRightEchart1(thisVue.rightChartData1.XAxis, thisVue.rightChartData1.pieData, thisVue.rightChartData1.total)
      }
    };
    me.createVue(vueConfig);
    var myParams = me.getParams();
  }
  onInit() {
    var me = this;
    // me.getParent().getVue().title = 'ssss'
    me.getVue().chartResize()
  }
  onResize() {
    var me = this;
    me.getVue().chartResize()
  };
}

module.exports = Page;
