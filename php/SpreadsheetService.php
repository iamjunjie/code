<?php

namespace App\Services;
use Illuminate\Support\Arr;
use App\Contracts\Services\AbstractService;

/**
 * Excel文件操作类
 * 
 * 1. 使用此类，需要暗转扩展: https://packagist.org/packages/phpoffice/phpspreadsheet
 * 
 * @package App\Services
 * @author  wangjunjie <wangjunjie@xiaohe.com>
 * @date    2020-07-19 12:36
 */
class SpreadsheetService extends AbstractService
{
    /**
     * 读取Excel数据
     * 
     * @param string $params['file'] 文件绝对路径
     * @param string $params['keymap'] 键映射，如：[1 => '交易单号', 2 => '商户号', 3 => '商户名称', 4 => '户名']
     * @param int $params['sheet'] sheet，默认0 
     * 
     * @return array
     */
    public static function readExcelData($params) {
        $file = Arr::get($params, 'file');
        self::checkFile($file);
        $sheet = Arr::get($params, 'sheet', 0);
        $keymap = Arr::get($params, 'keymap', []);
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file);
        $worksheet = $spreadsheet->getSheet($sheet);
        $rows = $worksheet->getHighestRow(); // 总行数
        $cols = $worksheet->getHighestColumn(); // 总列数
        $cols = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($cols); // 总列数
        $data = [];
        for ($row = 1; $row <= $rows; $row++) {
            for ($col = 1; $col <= $cols; $col++) {
                $data[$row][ self::getKeyName($keymap, $col, $col) ] = $worksheet->getCellByColumnAndRow($col, $row)->getValue();
            }
        }
        return $data;
    }

    /**
     * 写如Excel文件
     * 
     * @param string $params['file'] 文件绝对路径
     * @param string $params['data'] 数据
     * @param int $params['sheet'] sheet，默认0 
     * @param int $params['title'] sheet标题，默认sheet1
     * 
     * @return array
     */
    public static function writeExcelFile($params) {
        $file = Arr::get($params, 'file');
        $data = Arr::get($params, 'data', []);
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        if ($data) {
            foreach ($data as $key => $value) {
                $sheet = Arr::get($value, 'sheet', 0);
                $title = Arr::get($value, 'title', 'sheet1');
                $datas = Arr::get($value, 'data', []);
                $worksheet = $spreadsheet->createSheet($sheet)->setTitle($title);
                if (!empty($datas)) {
                    $rows = count($datas);
                    for ($row = 1; $row <= $rows; $row++) {
                        $item = array_values($datas[$row - 1]);
                        $cols = \count($item);
                        for ($col = 1; $col <= $cols; $col++) {
                            $worksheet->setCellValueByColumnAndRow($col, $row, $item[$col - 1]);
                        }
                    }
                }

            }
        }        
        $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save($file);
    }

    /**
     * 获取单元格值 - 日期
     */
    public static function getCellValueDate($value) {
        if ($value == date('Y-m-d', strtotime($value))) {
            return $value;
        }
        return date("Y-m-d", \PhpOffice\PhpSpreadsheet\Shared\Date::excelToTimestamp($value));
    }

    /**
     * 检测文件
     * 
     * @return boolean true 文件存在
     */
    private static function checkFile($file) {
        if (!file_exists($file)) {
            exit("{$file} 文件不存在");
        }
        return true;
    }

    /**
     * 获取键名
     * 
     * @param array $keymap 键映射
     * @param int $key 数字键
     * @param int $default 默认键名
     */
    private static function getKeyName($keymap, $key, $default) {
        $keyname = Arr::get($keymap, $key, $default);
        return $keyname;
    }
}
