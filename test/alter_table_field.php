<?php
// 加载数据库类
$path = dirname(dirname(__FILE__)) . '/php/mysql.php';
require_once($path);

// 数据库信息
$host = '192.168.1.177';
$user = 'crontab2';
$pwd  = 'ND5R74ocHMJB58JWSLY2kHhvfNuhV6En';
$dbname_arr = [
    'edubase',
    'eduwork',
    'edulogs',
];

// 处理数据库字段
foreach ($dbname_arr as $key => $dbname) {
    // 清空SQL文件
    $filename = "{$dbname}.sql";
    file_put_contents($filename, '');

    // MySql数据库类对象
    $obj = MySqlDB::getInstance([
        'host' => $host,
        'user' => $user,
        'pwd' => $pwd,
        'dbname' => $dbname,
    ], false);

    // 获取数据库所有表，并处理表字段
    $table_arr = $obj->getTables();
    foreach ($table_arr as $table) {
        $field_arr = $obj->getFields($table);
        foreach ($field_arr as $field) {
            $name = $field['Field'];
            $type = $field['Type'];
            $default = ($field['Default'] !== null ? "DEFAULT {$field['Default']}" : '');
            $is_null = ($field['Null'] == 'NO' ? 'NOT NULL' : 'NULL');
            $comment = $field['Comment'];
            if ($type == 'char(2)' || $type == 'char(1)' || $type == 'varchar(2)') {
                $sql = "ALTER TABLE `{$dbname}`.`{$table}` CHANGE `{$name}` `{$name}` TINYINT(2) UNSIGNED {$default} {$is_null} COMMENT '{$comment}';\r\n";
                file_put_contents($filename, $sql, FILE_APPEND);
            }
        }
    }
}

echo 'success';