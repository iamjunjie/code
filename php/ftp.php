<?php
// 地址
$host = '106.14.191.14';
// 端口
$port = '21';
// 时间
$timeout = 120;
// 账号
$user = 'ftp';
// 密码
$password = '12345678a!abc';
// 连接服务器
$link = ftp_connect($host, $port, $timeout);
// 账号登录
ftp_login($link, $user, $password);
// 本地文件
$local = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'ip.php';
// 远程文件
$remote = '/home/mcadmin/futurelinkhttp/ip.php';
// 上传文件
ftp_put($link, $remote, $local, FTP_BINARY);
// 关闭连接
ftp_close($link);
