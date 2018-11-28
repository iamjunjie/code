<?php
/**
 * 生成.csv文件示例代码
 */
// 文件名
$file_name = 'csv-demo.csv';
// 打开句柄
$fp = fopen($file_name, 'a+');
// 写入标题
$title = [
    iconv('UTF-8', 'GBK', '学员序号'),
    iconv('UTF-8', 'GBK', '学员姓名'),
    iconv('UTF-8', 'GBK', '学员手机'),
];
fputcsv($fp, $title);
// 写入数据
$data = [
    ['stu_id' => 1, 'stu_name' => '王某某', 'stu_phone' => '13241262022'],
    ['stu_id' => 2, 'stu_name' => '李某某', 'stu_phone' => '13241262023'],
    ['stu_id' => 3, 'stu_name' => '赵某某', 'stu_phone' => '13241262024'],
];
foreach ($data as $item) {
    fputcsv($fp, [
        'stu_id' => iconv('UTF-8', 'GBK', $item['stu_id']),
        'stu_name' => iconv('UTF-8', 'GBK', $item['stu_name']),
        'stu_phone' => iconv('UTF-8', 'GBK', $item['stu_phone']),
    ]);
}
// 关闭句柄
fclose($fp);