/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50617
Source Host           : localhost:3306
Source Database       : waterfall

Target Server Type    : MYSQL
Target Server Version : 50617
File Encoding         : 65001

Date: 2014-08-05 18:17:59
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for qy_product
-- ----------------------------
DROP TABLE IF EXISTS `qy_product`;
CREATE TABLE `qy_product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL COMMENT '所属品牌',
  `imgURI` text COMMENT '现代风格图片',
  `intro` varchar(255) DEFAULT 'nice good infor',
  `viewNum` int(5) DEFAULT '234',
  `commentNum` int(3) DEFAULT '3',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of qy_product
-- ----------------------------
INSERT INTO `qy_product` VALUES ('1', '扬子3', './Public/images/3.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('2', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙4', './Public/images/4.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('3', '安信1', './Public/images/1.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('4', '九创2', './Public/images/2.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('5', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙5', './Public/images/5.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('6', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙6', './Public/images/6.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('7', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙7', './Public/images/7.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('8', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙8', './Public/images/8.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('9', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙9', './Public/images/9.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('10', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙10', './Public/images/10.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('11', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙11', './Public/images/11.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('12', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙12', './Public/images/12.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('13', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙13', './Public/images/13.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('14', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙14', './Public/images/14.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('15', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙15', './Public/images/15.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('16', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙16', './Public/images/16.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('17', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙17', './Public/images/17.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('18', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙18', './Public/images/18.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('19', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙19', './Public/images/19.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('20', '扬子3', './Public/images/3.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('21', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙4', './Public/images/4.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('22', '安信1', './Public/images/1.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('23', '九创2', './Public/images/2.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('24', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙5', './Public/images/5.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('25', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙6', './Public/images/6.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('26', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙7', './Public/images/7.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('27', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙8', './Public/images/8.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('28', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙9', './Public/images/9.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('29', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙10', './Public/images/10.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('30', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙11', './Public/images/11.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('31', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙12', './Public/images/12.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('32', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙13', './Public/images/13.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('33', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙14', './Public/images/14.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('34', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙15', './Public/images/15.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('35', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙16', './Public/images/16.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('36', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙17', './Public/images/17.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('37', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙18', './Public/images/18.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('38', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙19', './Public/images/19.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('39', '扬子3', './Public/images/3.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('40', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙4', './Public/images/4.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('41', '安信1', './Public/images/1.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('42', '九创2', './Public/images/2.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('43', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙5', './Public/images/5.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('44', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙6', './Public/images/6.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('45', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙7', './Public/images/7.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('46', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙8', './Public/images/8.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('47', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙9', './Public/images/9.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('48', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙10', './Public/images/10.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('49', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙11', './Public/images/11.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('50', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙12', './Public/images/12.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('51', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙13', './Public/images/13.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('52', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙14', './Public/images/14.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('53', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙15', './Public/images/15.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('54', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙16', './Public/images/16.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('55', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙17', './Public/images/17.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('56', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙18', './Public/images/18.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('57', '可爱与性感集于一身 来自韩国的荷叶边复古连衣裙19', './Public/images/19.jpg', '12', '234', '3');
INSERT INTO `qy_product` VALUES ('58', '扬子3', './Public/images/3.jpg', '12', '234', '3');
