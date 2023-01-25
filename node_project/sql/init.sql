/*
 Navicat Premium Data Transfer

 Source Server         : root
 Source Server Type    : MySQL
 Source Server Version : 50731
 Source Host           : localhost:3306
 Source Schema         : node_project

 Target Server Type    : MySQL
 Target Server Version : 50731
 File Encoding         : 65001

 Date: 26/01/2023 01:43:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `class_id` int(32) NOT NULL AUTO_INCREMENT,
  `parent_id` int(32) DEFAULT NULL,
  `tel` varchar(11) NOT NULL,
  `class_name` varchar(64) NOT NULL,
  PRIMARY KEY (`class_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of category
-- ----------------------------
BEGIN;
INSERT INTO `category` (`class_id`, `parent_id`, `tel`, `class_name`) VALUES (7, NULL, '13388110101', 'eat');
INSERT INTO `category` (`class_id`, `parent_id`, `tel`, `class_name`) VALUES (8, NULL, '13388110101', 'life');
INSERT INTO `category` (`class_id`, `parent_id`, `tel`, `class_name`) VALUES (9, NULL, '13388110101', 'ii');
COMMIT;

-- ----------------------------
-- Table structure for items
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `tel` varchar(11) NOT NULL,
  `item_id` int(32) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 NOT NULL,
  `note` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `class_id` int(32) DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of items
-- ----------------------------
BEGIN;
INSERT INTO `items` (`tel`, `item_id`, `title`, `note`, `start`, `end`, `class_id`) VALUES ('13388110101', 3, '恰饭', '', NULL, '2023-03-25 13:02:23', NULL);
INSERT INTO `items` (`tel`, `item_id`, `title`, `note`, `start`, `end`, `class_id`) VALUES ('13388110101', 4, '恰饭', '', '2023-03-25 13:02:23', '2023-01-02 00:37:39', NULL);
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `tel` varchar(11) NOT NULL,
  `password` varchar(32) NOT NULL,
  `session` varchar(64) NOT NULL,
  PRIMARY KEY (`tel`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`tel`, `password`, `session`) VALUES ('13308110101', '123', '');
INSERT INTO `users` (`tel`, `password`, `session`) VALUES ('13388110101', '123', '62254276139997901674668427720');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
