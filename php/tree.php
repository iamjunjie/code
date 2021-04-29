<?php

/**
 * 公共函数库-数据树
 * 
 * 1. 作用是将数据结果集处理成树状结构
 * 2. 使用方法如下
 * $lists = \DataTree::getTree([
 * 	'data' => $lists, 
 * 	'pid' => 'pid', 
 * 	'id' => 'id', 
 * 	'name' => 'name', 
 * 	'char' => getArrVal($data, 'tree_char'), 
 * 	'style' => getArrVal($data, 'tree_style')
 * ]);
 * 3. 注意name、char、style 这三个字段是配合使用的
 * 
 * @author wuming 2021-04-29
 */
class DataTree
{
	/**
	 * 原始数据
	 * 
	 * @var array
	 */
	private static $data = [];

	/**
	 * 父字段名
	 * 
	 * @var string
	 */
	private static $pid = null;

	/**
	 * 主键字段名
	 * 
	 * @var string
	 */
	private static $id = null;

	/**
	 * 文本字段名
	 * 
	 * @var string 
	 */
	private static $name = null;

	/**
	 * 填充字符
	 * 
	 * @var string
	 */
	private static $char = '—';

	/**
	 * 树的风格
	 * 
	 * 1. 名字根据层级填充设置的填充字符，适用于select下拉框
	 * 2. 树状结构，叶子数据包含在subs里
	 * 
	 * @var int
	 */
	private static $style = 2;

	/**
	 * 结果数据
	 * 
	 * @var array
	 */
	private static $tree = [];

	/**
	 * 获取树
	 * 
	 * @param string $params['id'] 主键字段名
	 * @param string $params['pid'] 父节点字段名
	 * @param array $params['data'] 数据
	 * @param string $params['name'] 文本字段名
	 * @param string $params['char'] 填充字符串，默认-
	 * @param string $params['style'] 风格(1:试用与select下拉框，2:数组)
	 * 
	 * @return array
	 * 
	 * @author wuming 2021-04-29
	 */
	public static function getTree($params)
	{
		self::$id = $params['id'];
		self::$pid = $params['pid'];
		self::$data = $params['data'];
		self::$name = getArrVal($params, 'name');
		$char = getArrVal($params, 'char');
		self::$char = $char ? $char : self::$char;
		$style = getArrVal($params, 'style');
		self::$style = $style ? $style : self::$style;
		// 获取数据结果集中的根数据
		if ($root = self::getRoot()) {
			// 找寻根下的叶子数据
			foreach ($root as $value) {
				$level = 1;
				$value['depth'] = 0;
				switch (self::$style) {
					case 1:
						self::$tree[] = $value;
						self::buildLeaf($value, $level);
						break;
					case 2:
						$value['subs'] = [];
						self::buildLeaf($value, $level);
						self::$tree[] = $value;
						break;
					default:
						self::$tree[] = $value;
						self::buildLeaf($value, $level);
						break;
				}
			}

			return self::$tree;
		}

		return self::$data;
	}

	/**
	 * 获取根
	 * 
	 * @return array
	 * 
	 * @author wuming 2021-04-29
	 */
	private static function getRoot()
	{
		$root = [];
		foreach (self::$data as $key => $value) {
			if (empty($value[self::$pid])) {
				unset(self::$data[$key]);
				$root[] = $value;
			}
		}

		return $root;
	}

	/**
	 * 构建叶子
	 * 
	 * @param mixed $item 数据项
	 * @param int $level 层级数
	 * 
	 * @author wuming 2021-04-29
	 */
	private static function buildLeaf(&$item, $level)
	{
		if (self::$data) {
			foreach (self::$data as $key => $value) {
				$value['depth'] = $level;
				if ($value[self::$pid] != $item[self::$id]) {
					continue;
				}
				unset(self::$data[$key]);
				switch (self::$style) {
					case 1:
						self::$name && $value[self::$name] = str_repeat(self::$char, $level * 2) . $value[self::$name];
						self::$tree[] = $value;
						self::buildLeaf($value, $level + 1);
						break;
					case 2:
						$value['subs'] = [];
						self::buildLeaf($value, $level + 1);
						array_push($item['subs'], $value);
						break;
					default:
						self::$name && $value[self::$name] = str_repeat(self::$char, $level * 2) . $value[self::$name];
						self::$tree[] = $value;
						self::buildLeaf($value, $level + 1);
						break;
				}
			}
		}
	}
}