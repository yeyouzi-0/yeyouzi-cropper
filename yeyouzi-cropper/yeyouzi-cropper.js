// components/yeyouzi-cropper/yeyouzi-cropper.js
let success;
let fail;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    canvas: '',
    ctx: '',
    dpr: '',
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    k1: 0,
    m1: 0,
    k2: 0,
    m2: 0,
    cutMove: false,
    endCut: {
      x: 0,
      y: 0
    },
    movePoint: '0',
    img: {
      path: '',
      width: 0,
      height: 0,
      type: 1    // 1:横向 2:纵向
    },
    imageWidth: 0,
    imageHeight: 0,
    imageLeft: 0,
    imageTop: 0,
    imgRotate: 0,
    imgMirror: 0,
    originWidthShow: 0.5,
    originHeightShow: 0.5,
    imgMove: false,
    imgStart: {
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      distance: 0,
      width: 0,
      height: 0,
      cutImg: ''
    },
    imgScale: false,

    cutImg: {
      path: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }


  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 公有方法
     */

    //初始化
    init(param){
      success = param.success
      fail = param.fail
      var that = this;
      this.setData({
        img: {
          path: param.imgPath
        }
      })
      const query = wx.createSelectorQuery().in(this)
      query.select('#cutCanvas')
          .fields({node: true, size: true})
          .exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr
            ctx.scale(dpr,dpr)

            var x1 = canvas.width * 0.15 / dpr;
            var y1 = (canvas.height - canvas.width * 0.7) / 2 / dpr;
            var x2 = x1 + canvas.width * 0.7 / dpr;
            var y2 = y1 + canvas.width * 0.7 / dpr;
            var k1 = (y2 -y1) / (x2 - x1);
            var m1 = (x2 * y1 - x1 * y2) / (x2 - x1)
            var k2 = (y1 - y2) / (x2 -x1);
            var m2 = (x2 * y2 - x1 * y1) / (x2 - x1);
            that.setData({
              canvas: canvas,
              ctx: ctx,
              dpr: dpr,
              x1: x1,
              y1: y1,
              x2: x2,
              y2: y2,
              k1: k1,
              m1: m1,
              k2: k2,
              m2: m2
            })
            this._drawCut(x1, y1, x2, y2)
            wx.getImageInfo({
              src: param.imgPath,
              success(img){
                var width = '';
                var height = '';
                var type = 0;
                var x = '';var y = '';var d = '';
                if(img.width > img.height){
                  height = that.data.y2 - that.data.y1;
                  width = (img.width * height) / img.height
                  type = 1
                  d = img.height
                  x = (img.width - d) / 2
                  y = 0
                }else{
                  width = that.data.x2 - that.data.x1;
                  height = (img.height * width) / img.width
                  type = 2
                  d = img.width
                  x = 0
                  y = (img.height - d) / 2
                }
                that.setData({
                  img: {
                    path: param.imgPath,
                    width: img.width,
                    height: img.height,
                    type: type
                  },
                  cutImg: {
                    x: x,
                    y: y,
                    width: d,
                    height: d
                  },
                  imageWidth: ((x2 - x1) / d) * img.width,
                  imageHeight: ((y2 - y1) / d) * img.height,
                  imageLeft: x1 - ((x2 - x1) / d) * x,
                  imageTop: y1 - ((y2 - y1) / d) * y,
                  imgRotate: 0
                })
              }
            })
          })
          
    },

    /**
     * 私有方法
     */
    _drawCut(x1, y1, x2, y2){
      var ctx = this.data.ctx;
      var canvas = this.data.canvas;
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = '0.5'
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = '3'
      ctx.lineCap = 'square'
      ctx.globalAlpha = '1'
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(x1 - 5, y1 - 5, 20, 20)//左上角 1
      ctx.fillRect(x2 - 15, y1 - 5, 20, 20)//右上角 2
      ctx.fillRect(x1 - 5, y2 - 15, 20, 20)//左下角 3
      ctx.fillRect(x2 - 15, y2 - 15, 20 , 20)//右下角 4
      ctx.clearRect(x1, y1, x2 - x1, y2 -y1)
    },

    _touchStart(e){
      //裁剪框是否移动
      var flag = false;
      var point = '0'
      if(e.touches[0].x >= this.data.x1 - 10 && this.data.x1 + 10 >= e.touches[0].x){
        if(e.touches[0].y >= this.data.y1 - 10 && this.data.y1 + 10 >= e.touches[0].y){
          flag = true; point = '1';
          this.setData({
            endCut:{
              x: this.data.x1,
              y: this.data.y1
            }
          })
        }else if(e.touches[0].y >= this.data.y2 - 10 && this.data.y2 + 10 >= e.touches[0].y){
          flag = true; point = '3';
          this.setData({
            endCut:{
              x: this.data.x1,
              y: this.data.y2
            }
          })
        }
      }else if(e.touches[0].x >= this.data.x2 - 10 && this.data.x2 + 10 >= e.touches[0].x){
        if(e.touches[0].y >= this.data.y1 - 10 && this.data.y1 + 10 >= e.touches[0].y){
          flag = true; point = '2'
          this.setData({
            endCut:{
              x: this.data.x2,
              y: this.data.y1
            }
          })
        }else if(e.touches[0].y >= this.data.y2 - 10 && this.data.y2 + 10 >= e.touches[0].y){
          flag = true; point = '4'
          this.setData({
            endCut:{
              x: this.data.x2,
              y: this.data.y2
            }
          })
        }
      }
      this.setData({
        cutMove: flag,
        movePoint: point
      })

      //图片是否移动
      if(e.touches[0].x >= this.data.x1 + 10 && this.data.x2 - 10 >= e.touches[0].x){
        if(e.touches[0].y >= this.data.y1 + 10 && this.data.y2 - 10 >= e.touches[0].y){
          if(e.touches.length == 1){
            this.setData({
              imgMove: true,
              imgStart: {
                x: e.touches[0].x,
                y: e.touches[0].y,
                left: this.data.imageLeft,
                top: this.data.imageTop
              },
              imgScale: false
            })
          }else if(e.touches.length == 2){
            this.setData({
              imgMove: false,
              imgStart: {
                distance: Math.sqrt(Math.pow(e.touches[1].x - e.touches[0].x, 2) + Math.pow(e.touches[1].y - e.touches[0].y, 2)),
                width: this.data.imageWidth,
                height: this.data.imageHeight,
                cutImg: this.data.cutImg
              },
              imgScale: true
            })
          }
        }
      }
    },

    _touchMove(e){
      if(this.data.cutMove){
        var x1;var y1;var x2;var y2;
        if(this.data.movePoint == '1'){
          x1 = e.touches[0].x
          y1 = this.data.k1 * x1 + this.data.m1
          x2 = this.data.x2
          y2 = this.data.y2
          if(x1 > x2 -100){
            x1 = x2 - 100
            y1 = this.data.k1 * x1 + this.data.m1
          }else if(x1 < this.data.x1){
            x1 = this.data.x1
            y1 = this.data.k1 * x1 + this.data.m1
          }
          this.setData({
            endCut:{
              x: x1,
              y: y1
            }
          })
        }else if(this.data.movePoint == '2'){
          x2 = e.touches[0].x
          y1 = this.data.k2 * x2 + this.data.m2
          x1 = this.data.x1
          y2 = this.data.y2
          if(x2 > this.data.x2){
            x2 = this.data.x2
            y1 = this.data.y1
          }else if(x2 < this.data.x1 + 100){
            x2 = this.data.x1 + 100
            y1 = this.data.k2 * x2 + this.data.m2
          }
          this.setData({
            endCut:{
              x: x2,
              y: y1
            }
          })
        }else if(this.data.movePoint == '3'){
          x1 = e.touches[0].x
          y2 = this.data.k2 * x1 + this.data.m2
          x2 = this.data.x2
          y1 = this.data.y1
          if(x1 > x2 - 100){
            x1 = x2 - 100
            y2 = this.data.k2 * x1 + this.data.m2
          }else if(x1 < this.data.x1){
            x1 = this.data.x1
            y2 = this.data.y2
          }
          this.setData({
            endCut:{
              x: x1,
              y: y2
            }
          })
        }else if(this.data.movePoint == '4'){
          x2 = e.touches[0].x
          y2 = this.data.k1 * x2 + this.data.m1
          x1 = this.data.x1
          y1 = this.data.y1
          if(x2 > this.data.x2){
            x2 = this.data.x2
            y2 = this.data.k1 * x2 + this.data.m1
          }else if(x2 < x1 + 100){
            x2 = x1 + 100
            y2 = this.data.k1 * x2 + this.data.m1
          }
          this.setData({
            endCut:{
              x: x2,
              y: y2
            }
          })
        }
        this._drawCut(x1, y1, x2, y2)
      }else if(this.data.imgMove){
        var dx = this.data.imgStart.x - e.touches[0].x
        var dy = this.data.imgStart.y - e.touches[0].y
        var rotate = this.data.imgRotate
        var left = this.data.imgStart.left - dx
        var top = this.data.imgStart.top - dy
        if(this.data.imgMirror == 180){
          dx = -dx
          rotate = -rotate
        }
        var tx = dx * Math.cos(rotate * Math.PI / 180) + dy * Math.sin(rotate * Math.PI / 180)
        var ty = dy * Math.cos(rotate * Math.PI / 180) - dx * Math.sin(rotate * Math.PI / 180)
        var x = (tx + this.data.originWidthShow * this.data.imageWidth) / this.data.imageWidth * this.data.img.width - this.data.cutImg.width / 2
        var y = (ty + this.data.originHeightShow * this.data.imageHeight) / this.data.imageHeight * this.data.img.height - this.data.cutImg.height / 2
        this.setData({
          cutImg: {
            width: this.data.cutImg.width,
            height: this.data.cutImg.height,
            x: x,
            y: y
          },
          imageLeft: left,
          imageTop: top,
        })
      }else if(this.data.imgScale){
        var nowDistance = Math.sqrt(Math.pow(e.touches[1].x - e.touches[0].x, 2) + Math.pow(e.touches[1].y - e.touches[0].y, 2))
        var m = nowDistance / this.data.imgStart.distance
        var width = this.data.imgStart.width * m
        var height = this.data.imgStart.height * m
        if(this.data.img.type == 1){
          height = height < this.data.y2 - this.data.y1 ? this.data.y2 - this.data.y1 : height
          height = height > (this.data.y2 - this.data.y1)*10 ? (this.data.y2 - this.data.y1)*10 : height
          width = (height * this.data.img.width) / this.data.img.height
        }else{
          width = width < this.data.x2 - this.data.x1 ? this.data.x2 - this.data.x1 : width
          width = width > (this.data.x2 - this.data.x1)*10 ? (this.data.x2 - this.data.x1)*10 : width
          height = (width * this.data.img.height) / this.data.img.width
        }
        var n = width / this.data.imgStart.width
        var cut = {
          x: this.data.imgStart.cutImg.x + ((n - 1) / (2 * n)) * this.data.imgStart.cutImg.width,
          y: this.data.imgStart.cutImg.y + ((n - 1) / (2 * n)) * this.data.imgStart.cutImg.height,
          width: this.data.imgStart.cutImg.width / n,
          height: this.data.imgStart.cutImg.height / n
        }
        var left = this.data.x1 - ((this.data.x2 - this.data.x1) / cut.width) * cut.x
        left = left > this.data.x1 ? this.data.x1 : left
        left = left < this.data.x2 - this.data.imageWidth ? this.data.x2 - this.data.imageWidth :left
        var top = this.data.y1 - ((this.data.y2 - this.data.y1) / cut.height) * cut.y
        top = top > this.data.y1 ? this.data.y1 : top
        top = top < this.data.y2 - this.data.imageHeight ? this.data.y2 - this.data.imageHeight : top
        this.setData({
          imageLeft: left,
          imageTop: top,
          imageWidth: width,
          imageHeight: height,
          cutImg: {
            x: cut.x,
            y: cut.y,
            width: cut.width,
            height: cut.height
          },
        })
      }
    },

    _touchEnd(e){
      if(this.data.cutMove){
        var dx;var dy;var d;
        var movePoint = this.data.movePoint
        if(movePoint % 2 == 0){
          d = ((this.data.endCut.x - this.data.x1) * this.data.cutImg.width) / (this.data.x2 - this.data.x1)
          if(this.data.imgMirror == 180){
            dx = -(this.data.endCut.x - this.data.x2) / this.data.imageWidth * this.data.img.width /2
            if(movePoint == '2'){
              dy = (this.data.endCut.y - this.data.y1) / this.data.imageHeight * this.data.img.height /2
            }else{
              dy = (this.data.endCut.y - this.data.y2) / this.data.imageHeight * this.data.img.height /2
            }
          }else{
            dx = (this.data.endCut.x - this.data.x2) / this.data.imageWidth * this.data.img.width /2
            if(movePoint == '2'){
              dy = (this.data.endCut.y - this.data.y1) / this.data.imageHeight * this.data.img.height /2
            }else{
              dy = (this.data.endCut.y - this.data.y2) / this.data.imageHeight * this.data.img.height /2
            }
          }
        }else{
          d = ((this.data.x2 - this.data.endCut.x) * this.data.cutImg.width) / (this.data.x2 - this.data.x1)
          if(this.data.imgMirror == 180){
            dx = -(this.data.endCut.x - this.data.x1) / this.data.imageWidth * this.data.img.width /2
            if(movePoint == '1'){
              dy = (this.data.endCut.y - this.data.y1) / this.data.imageHeight * this.data.img.height /2
            }else{
              dy = (this.data.endCut.y - this.data.y2) / this.data.imageHeight * this.data.img.height /2
            }
          }else{
            dx = (this.data.endCut.x - this.data.x1) / this.data.imageWidth * this.data.img.width /2
            if(movePoint == '1'){
              dy = (this.data.endCut.y - this.data.y1) / this.data.imageHeight * this.data.img.height /2
            }else{
              dy = (this.data.endCut.y - this.data.y2) / this.data.imageHeight * this.data.img.height /2
            }
          }
        }
        var rotate = this.data.imgMirror == 180 ? -this.data.imgRotate : this.data.imgRotate
        var x = ((dx * Math.cos(rotate * Math.PI / 180) + dy * Math.sin(rotate * Math.PI / 180)) + this.data.originWidthShow * this.data.img.width) - d / 2
        var y = ((dy * Math.cos(rotate * Math.PI / 180) - dx * Math.sin(rotate * Math.PI / 180)) + this.data.originHeightShow * this.data.img.height) - d / 2
        this.setData({
          cutImg:{
            x: x,
            y: y,
            width: d,
            height: d
          },
          imageWidth: ((this.data.x2 - this.data.x1) / d) * this.data.img.width,
          imageHeight: ((this.data.y2 - this.data.y1) / d) * this.data.img.height,
          imageLeft: this.data.x1 - ((this.data.x2 - this.data.x1) / d) * x,
          imageTop: this.data.y1 - ((this.data.y2 - this.data.y1) / d) * y,
          
        })
        this._drawCut(this.data.x1,this.data.y1,this.data.x2,this.data.y2)
      }
      if(this.data.imgMove){
        var left = this.data.x1 - ((this.data.x2 - this.data.x1) / this.data.cutImg.width) * this.data.cutImg.x
        var top = this.data.y1 - ((this.data.y2 - this.data.y1) / this.data.cutImg.height) * this.data.cutImg.y
        this.setData({
          imageLeft: left,
          imageTop: top,
        })
      }
      this.setData({
        originWidthShow: (this.data.cutImg.x + this.data.cutImg.width / 2) / this.data.img.width,
        originHeightShow: (this.data.cutImg.y + this.data.cutImg.height / 2) / this.data.img.height,
        cutMove: false,
        movePoint: '0',
        imgMove: false,
        imgScale: false
      })
    },

    _rotateChange(e){
      this.setData({
        imgRotate: e.detail.value
      })
    },

    _rotateNinety(){
      var r = this.data.imgRotate + 90 > 180 ? this.data.imgRotate - 270 : this.data.imgRotate + 90
      this.setData({
        imgRotate: r
      })
    },

    _imageMirror(){
      var m = this.data.imgMirror == 180 ? 0 : 180
      this.setData({
        imgMirror: m,
      })
    },

    _imgRestore(){
      this.setData({
        canvas: '',
        ctx: '',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        k1: 0,
        m1: 0,
        k2: 0,
        m2: 0,
        cutMove: false,
        endCut: {
          x: 0,
          y: 0
        },
        movePoint: '0',
        imageWidth: 0,
        imageHeight: 0,
        imageLeft: 0,
        imageTop: 0,
        imgRotate: 0,
        imgMirror: 0,
        originWidthShow: 0.5,
        originHeightShow: 0.5,
        imgMove: false,
        imgStart: {
          x: 0,
          y: 0,
          left: 0,
          top: 0,
          distance: 0,
          width: 0,
          height: 0,
          cutx: 0,
          cuty: 0
        },
        imgScale: false,

        cutImg: {
          path: '',
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      })
      this.init(this.data.img.path)
    },

    _cancelCut(){
      this._restoreData()
      if(fail){
        fail('cancel')
      }
    },

    _confirmCut(){
      wx.showLoading({
        title: '裁剪中...',
        mask: true
      })
      var that = this
      const query = wx.createSelectorQuery().in(this)
      query.select('#imgCanvas')
          .fields({node: true, size: true})
          .exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            canvas.width = that.data.cutImg.width
            canvas.height = that.data.cutImg.height
            ctx.translate(canvas.width / 2, canvas.height / 2)
            ctx.rotate((that.data.imgRotate >= 0 ? that.data.imgRotate : that.data.imgRotate + 360) * Math.PI / 180)
            if(that.data.imgMirror == 180){
              ctx.scale(-1, 1); //左右镜像翻转
            }
            const img = canvas.createImage()
            img.src = that.data.img.path
            img.onload = () => {
              ctx.drawImage(img, 0, 0, that.data.img.width, that.data.img.height, -(that.data.cutImg.x+canvas.width/2), -(that.data.cutImg.y+canvas.height/2), that.data.img.width, that.data.img.height)

              wx.canvasToTempFilePath({
                canvas: canvas,
                success(img){
                  success(img.tempFilePath)
                  that._restoreData()
                  wx.hideLoading({
                    success: (res) => {},
                  })
                },
                fail(){
                  wx.hideLoading({
                    success: (res) => {
                      wx.showToast({
                        title: '裁剪失败',
                        icon: 'error'
                      })
                      if(fail){
                        fail('fail')
                      }
                    },
                  })
                }
              })
              
            }
          })
      
    },
    
    _restoreData(){
      this.setData({
        canvas: '',
        ctx: '',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        k1: 0,
        m1: 0,
        k2: 0,
        m2: 0,
        cutMove: false,
        endCut: {
          x: 0,
          y: 0
        },
        movePoint: '0',
        img: {
          path: '',
          width: 0,
          height: 0,
          type: 1    // 1:横向 2:纵向
        },
        imageWidth: 0,
        imageHeight: 0,
        imageLeft: 0,
        imageTop: 0,
        imgRotate: 0,
        imgMirror: 0,
        originWidthShow: 0.5,
        originHeightShow: 0.5,
        imgMove: false,
        imgStart: {
          x: 0,
          y: 0,
          left: 0,
          top: 0,
          distance: 0,
          width: 0,
          height: 0,
          cutx: 0,
          cuty: 0
        },
        imgScale: false,

        cutImg: {
          path: '',
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      })
    },
  }
})
