# yeyouzi-cropper

### 介绍
一个简洁的微信小程序裁剪图片组件

### 组件预览

#### 1.双指放大缩小

![双指放大缩小示例](https://github.com/yeyouzi-0/image/blob/main/suofang.gif)
#### 2.单指拖动图片

![单指拖动图片示例](https://github.com/yeyouzi-0/image/blob/main/yidong.gif)
#### 3.拖动裁剪框

![拖动裁剪框示例](https://github.com/yeyouzi-0/image/blob/main/caijiankuang.gif)
#### 4.旋转图片

![旋转图片示例](https://github.com/yeyouzi-0/image/blob/main/xuanzhuan.gif)
#### 5.旋转90度

![旋转90度示例](https://github.com/yeyouzi-0/image/blob/main/xuanzhuan90.gif)
#### 6.图片镜像+还原

![图片镜像+还原示例](https://github.com/yeyouzi-0/image/blob/main/jingxiang.gif)
#### 7.生成图片

![生成图片示例](https://github.com/yeyouzi-0/image/blob/main/shengcheng.gif)

### 安装教程

1.  下载整个仓库
2.  在小程序文件夹中新建components文件夹
3.  将文件夹yeyouzi-cropper复制到components文件夹中

### 使用说明

按照小程序自定义组件使用方法使用即可

1.  在json文件中修改usingComponents
```
"usingComponents": {
   "yeyouzi-cropper": "/components/yeyouzi-cropper/yeyouzi-cropper"
}
```
2.  将组件写入到wxml文件中
```
<yeyouzi-cropper id="yeyouzi-cropper" style="width: 100%;height: 100%;"></yeyouzi-cropper>
```
3.  在js文件中，通过id获取组件，并使用init函数初始化裁剪工具，通过回调函数获取临时路径
```
this.cropper = this.selectComponent("#yeyouzi-cropper");
this.cropper.init({
    imgPath: path,  //imgPath是需要裁剪图片的图片路径，只支持本地或临时路径
    success(res){
        console.log(res) //res即裁剪成功后的图片临时路径
    },
    fail(error){
        console.log(error) //有两种:cancel代表点击了叉，fail代表wx.canvasToTempFilePath生成图片失败
    }        
});
```

### 组件试用

#### 使用微信直接扫描以下二维码可以试用该组件
</br>

![试用组件二维码](https://github.com/yeyouzi-0/image/blob/main/erweima~1.jpg)

#### 想要体验更多功能也可以扫描以下二维码，谢谢😘
</br>

![更多功能二维码](https://github.com/yeyouzi-0/image/blob/main/2weima.jpg)

