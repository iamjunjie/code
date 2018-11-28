<?php
/**
 * 获取客户端Ip
 * 
 * @return string
 */
function getClientIp() {
    $real_ip = '';
    $unknown = 'unknown';
    if (isset($_SERVER)) {
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && !empty($_SERVER['HTTP_X_FORWARDED_FOR']) && strcasecmp($_SERVER['HTTP_X_FORWARDED_FOR'], $unknown)) {
            $arr = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            foreach ($arr as $ip) {
                $ip = trim($ip);
                if ($ip != 'unknown') {
                    $real_ip = $ip;
                    break;
                }
            }
        } else if (isset($_SERVER['HTTP_CLIENT_IP']) && !empty($_SERVER['HTTP_CLIENT_IP']) && strcasecmp($_SERVER['HTTP_CLIENT_IP'], $unknown)) {
            $real_ip = $_SERVER['HTTP_CLIENT_IP'];
        } else if (isset($_SERVER['REMOTE_ADDR']) && !empty($_SERVER['REMOTE_ADDR']) && strcasecmp($_SERVER['REMOTE_ADDR'], $unknown)) {
            $real_ip = $_SERVER['REMOTE_ADDR'];
        } else {
            $real_ip = $unknown;
        }
    } else {
        if (getenv('HTTP_X_FORWARDED_FOR') && strcasecmp(getenv('HTTP_X_FORWARDED_FOR'), $unknown)) {
            $real_ip = getenv("HTTP_X_FORWARDED_FOR");
        } else if (getenv('HTTP_CLIENT_IP') && strcasecmp(getenv('HTTP_CLIENT_IP'), $unknown)) {
            $real_ip = getenv("HTTP_CLIENT_IP");
        } else if (getenv('REMOTE_ADDR') && strcasecmp(getenv('REMOTE_ADDR'), $unknown)) {
            $real_ip = getenv("REMOTE_ADDR");
        } else {
            $real_ip = $unknown;
        }
    }
    $real_ip = preg_match("/[\d\.]{7,15}/", $real_ip, $matches) ? $matches[0] : $unknown;
    return $real_ip;
}

/**
 * 获取IP信息
 * 
 * @param  string $ip IP地址
 * 
 * @return array
 */
function getIpLookup($ip = ''){
    if (empty($ip)) {
        $ip = getClientIp();
    }
    // 从新浪获取IP信息
    $ch = curl_init("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip={$ip}");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); //对认证证书来源的检查
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2); //从证书中检查SSL加密算法是否存在
    curl_setopt($ch, CURLOPT_TIMEOUT, 120); //设置超时限制防止死循环
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //获取的信息以文件流的形式返回
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*;q=0.8',
        'Referer:http://www.sina.com.cn/',
        'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    ]);
    $ip_info = curl_exec($ch);
    if ($ip_info) {
        $ip_info = json_decode($ip_info, true);
        if (isset($ip_info['city'])) {
            return $ip_info['city'];
        }
    }
    // 从淘宝获取IP信息
    $ch = curl_init("http://ip.taobao.com/service/getIpInfo.php?ip={$ip}");
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); //对认证证书来源的检查
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2); //从证书中检查SSL加密算法是否存在
    curl_setopt($ch, CURLOPT_TIMEOUT, 120); //设置超时限制防止死循环
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //获取的信息以文件流的形式返回
    $ip_info = curl_exec($ch);
    if ($ip_info) {
        $ip_info = json_decode($ip_info, true);
        if (isset($ip_info['data']['city'])) {
            return $ip_info['data']['city'];
        }
    }
    return false;
}

$ip_info = getIpLookup('49.66.25.113');
var_dump($ip_info);