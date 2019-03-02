<?php
/**
 * MySql数据库类
 * 
 * @author wangjunjie <1252547929@qq.com>
 * @date 2019-03-02 10:06
 */
class MySqlDB {

    /**
     * 数据库连接标识
     *
     * @var object
     */
    private $conn = null;

    /**
     * 类实例
     *
     * @var object
     */
    private static $instance = null;
    
    /**
     * 初始化数据库链接标识
     *
     * @param string $conf['host'] 地址
     * @param string $conf['user'] 账号
     * @param string $conf['pwd'] 密码
     * @param string $conf['dbname'] 数据库名
     * 
     * @return void
     */
    private function __construct($conf)
    {
        $this->conn = new mysqli($conf['host'], $conf['user'], $conf['pwd'], $conf['dbname']);
    }

	/**
     * 获取类实例
     *
     * @param string $conf['host'] 地址
     * @param string $conf['user'] 账号
     * @param string $conf['pwd'] 密码
     * @param string $conf['dbname'] 数据库名
     * 
     * @return object
     */
	public static function getInstance($conf){
		if(self::$instance == null){
			self::$instance = new self($conf);
		}
		return self::$instance;
    }
    
    /**
     * 获取数据库所有表名
     *
     * @return array
     */
    public function getTables()
    {
        $query = $this->conn->query('SHOW TABLES');
        $table_arr = [];
        while ($item = $query->fetch_row()) {
            $table_arr[] = $item[0];
        }
        return $table_arr;
    }

    /**
     * 获取表字段
     *
     * @param string $tb_name 表名
     * 
     * @return array
     */
    public function getFields($tb_name)
    {
        $query = $this->conn->query("SHOW FULL COLUMNS FROM {$tb_name}");
        $field_arr = [];
        while ($item = $query->fetch_assoc()) {
            $field_arr[] = $item;
        }
        return $field_arr;
    }

    /**
     * 关闭数据库连接
     */
    public function __destruct()
    {
        $this->conn->close();
    }

    /**
     * 防止克隆
     *
     * @return void
     */
    private function __clone()
    {
        
    }
}

// 数据库配置
$db_conf = [
    'host' => '192.168.1.177',
    'user' => 'crontab2',
    'pwd' => 'ND5R74ocHMJB58JWSLY2kHhvfNuhV6En',
    'dbname' => 'edulogs',
];

// 清空文件
$filename = "{$db_conf['dbname']}.sql";
file_put_contents($filename, '');

// MySql数据库类对象
$obj = MySqlDB::getInstance($db_conf);

// 获取数据库所有表，并处理表字段
$table_arr = $obj->getTables();
foreach ($table_arr as $table) {
    $field_arr = $obj->getFields($table);
    foreach ($field_arr as $field) {
        $name = $field['Field'];
        $type = $field['Type'];
        $comment = $field['Comment'];
        if ($type == 'char(2)') {
            $sql = "ALTER TABLE `{$db_conf['dbname']}`.`{$table}` CHANGE `{$name}` `{$name}` TINYINT(2) UNSIGNED NULL COMMENT '{$comment}';\r\n";
            file_put_contents($filename, $sql, FILE_APPEND);
        }
    }
}

echo 'success';
