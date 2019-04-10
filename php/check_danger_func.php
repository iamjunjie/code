<?php
/**
 * 检测项目中使用到的PHP危险函数
 * 
 * 使用方法：
 * 1. 把此文件放到要检测的目录下
 * 2. 执行 php check_danger_func.php
 * 3. 在被检测的目录下会生成check_danger_func.log文件，记录哪个文件哪行使用了哪个危险函数
 */

ini_set('memory_limit', '2048M');

// 危险函数数组
$danger_func = [
    // 'phpinfo(',
    'passthru(',
    'exec(',
    'system(',
    'chroot(',
    'scandir(',
    'chgrp(',
    'shell_exec(',
    'proc_open(',
    'proc_get_status(',
    'error_log(',
    'ini_alter(',
    // 'ini_set(',
    'ini_restore(',
    'dl(',
    'pfsockopen(',
    'syslog(',
    'readlink(',
    'symlink(',
    'popen(',
    'stream_socket_server(',
    'putenv(',
];

// 处理路径，日志文件
$dirname = dirname(__FILE__);
$logfile = $dirname . DIRECTORY_SEPARATOR . 'check_danger_func.log';

// 所有被处理的文件
$filepath_arr = getDirFile($dirname);
$filepath_num = count($filepath_arr);

// 循环处理
foreach ($filepath_arr as $key => $file) {
    $counter = $key + 1;
    echo "Total number of files:{$filepath_num}. Being processed:{$counter}. \r\n";
    checkFileDangerFunc($file, $danger_func);
}

/**
 * 获取目录所有文件
 *
 * @param string $dirpath 文件夹路径
 */
function getDirFile($dirpath)
{
    // 文件路径
    static $filepath_arr = [];
    if (is_dir($dirpath)) {
        $filename = scandir($dirpath);
        foreach ($filename as $item) {
            if (in_array($item, ['.', '..', 'check_danger_func.php', 'check_danger_func.log'])) {
                continue;
            }
            $item_filepath = $dirpath . DIRECTORY_SEPARATOR . $item;
            if (is_dir($item_filepath)) {
                getDirFile($item_filepath);
            } else {
                $filepath_arr[] = $item_filepath;
            }
        }
    }
    return $filepath_arr;
}

/**
 * 检测某个文件是否包含危险函数
 *
 * @param string $filepath 文件路径
 * @param mixed $func 危险函数
 */
function checkFileDangerFunc($filepath, $func)
{
    if (file_exists($filepath)) {
        // 读取文件所有内容
        $line_str_arr = file($filepath);
        // 函数数组
        $func_arr = (array) $func;
        // 遍历文件所有行
        foreach ($line_str_arr as $key => $line_str) {
            // 遍历所有危险函数
            foreach ($func_arr as $func_str) {
                if (checkStr($line_str, $func_str)) {
                    $lineno = $key + 1;
                    file_put_contents($GLOBALS['logfile'], "[{$filepath}] 文件第 [{$lineno}] 行用了 [$func_str] 危险函数。\r\n", FILE_APPEND);
                }
            }
        }
    }
}

/**
 * 检测字符串是否包含危险函数
 *
 * @param string $str 字符串
 * @param string $func 危险函数名
 * 
 * @return boolean true是，false否
 */
function checkStr($str, $func)
{
    $str = trim($str);
    // 注释代码过滤
    if (substr($str, 0, 1) == '*') {
        return false;
    }
    if (substr($str, 0, 2) == '//') {
        return false;
    }
    // curl_exec方法过滤
    if (strpos($str, 'curl_exec') !== false) {
        return false;
    }
    return strpos($str, $func) !== false;
}