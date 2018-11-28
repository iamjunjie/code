<?php
/**
 * 根据使用者传入的参数将二维码生成到背景图上
 *
 * 调用示例
 * <img src="http://cs.com.cn/php/qrcode.php?
		bg_img_url=http://file.baonahao.com/image/oms/20160908/01b94624e47dcf0493b6e4a210920d09.jpg
		&qr_data=http://www.baidu.com
		&x=10
		&y=10
		&width=200
		&height=200
   " />
 * 
 * bg_img_url：背景图url地址
 * qr_data：二维码里的数据
 * x：二维码在背景图上的X轴距离
 * y：二维码在背景图上的Y轴距离
 * width：二维码在背景图上的宽
 * height：二维码在背景图上的高
 */


/**
 * 生成二维码
 */
function createQrCode(){
	require_once(dirname(__FILE__) . '/PHPQRCode/phpqrcode.php');
	$data = isset($_GET['qr_data']) ? $_GET['qr_data'] : 'http://www.xiaohe.com';
	QRcode::png($data);
	exit;
}

if (isset($_GET['func'])) {
	$method = $_GET['func'];
	$method();
}

// 二维码在背景图上的X/Y轴距离
$x = isset($_GET['x']) ? $_GET['x'] : '10';
$y = isset($_GET['y']) ? $_GET['y'] : '10';
// 二维码在背景图上的宽高
$width  = isset($_GET['width']) ? $_GET['width'] : '100';
$height = isset($_GET['height']) ? $_GET['height'] : '100';

// 二维码数据
$qr_data = isset($_GET['qr_data']) ? $_GET['qr_data'] : 'http://www.xiaohe.com';
// 背景图路径
$bg_img_url = isset($_GET['bg_img_url']) ? $_GET['bg_img_url'] : 'http://file.baonahao.com/image/oms/20160908/01b94624e47dcf0493b6e4a210920d09.jpg?v=V2.1.6_1';
// 二维码地址
$qr_img_url = "http://{$_SERVER['HTTP_HOST']}/php/qrcode.php?func=createQrCode&qr_data={$qr_data}";

// 设置 Content type
header('Content-Type: image/jpeg');

// 背景图
$bg_img = @imagecreatefromjpeg($bg_img_url);
// 二维码图
list($qr_img_width, $qr_img_height) = getimagesize($qr_img_url);
$qr_img = @imagecreatefrompng($qr_img_url);

// 拷贝部分图像并调整大小
imagecopyresized($bg_img, $qr_img, $x, $y, 0, 0, $width, $height, $qr_img_width, $qr_img_height);

// 输出图
imagejpeg($bg_img);
imagedestroy($bg_img);





