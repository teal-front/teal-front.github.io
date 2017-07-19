## 使用手册
### 步骤
1. 把`createPackage.bat`和`7za.exe`复制把svn的`Jumi`目录下，与`trunk`目录同级

2. 设置svn的hook，见下图
![step1](http://i.imgur.com/VgMFhwe.png)

  ![step2](http://i.imgur.com/yeZwnzj.png)

### 使用
  每次提交到`trunk`下时，会自动把`Jumi/trunk/node`目录下的提交文件，打包到`Packages`（若node目录下有文件更改，会自动打开`Packages`资源浏览器目录）