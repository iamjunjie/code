<?php
/**
 * 一键备份数据库结构脚本
 * 
 * 进入目录：cd code/php
 * 修改配置：$dbconf 备份数据库的连接信息配置
 * 执行脚本：php backupdb.php
 */

// 数据库配置
$dbconf = [
    'vclass_base' => [
        'hostname' => '192.168.15.104',
        'hostport' => '13361',
        'database' => 'vclass_base',
        'username' => 'webdev',
        'password' => 'webdev',
    ],
    'vclass_osc' => [
        'hostname' => '192.168.15.104',
        'hostport' => '13361',
        'database' => 'vclass_osc',
        'username' => 'webdev',
        'password' => 'webdev',
    ],
];

// 引入MySQL操作类
require 'mysql.php';
foreach ($dbconf as $key => $value) {
    // 数据库SQL文件名
    $filename = $key . '.sql';
    // 清空文件内容
    file_put_contents($filename, '');
    // 创建操作数据库类对象
    $db = MySqlDB::getInstance($value);
    // 查询数据库所有表
    $tables = $db->getTables();
    $totals = count($tables);
    foreach ($tables as $tk => $tv) {
        printf("数据库{$key}处理进度：%s/%s\r\n", ($tk + 1), $totals);
        $sql = $db->getCreateTableSql($tv) . ";\r\n\r\n";
        file_put_contents($filename, $sql, FILE_APPEND);
    }
}
exit('处理完成');