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
     * @param boolean $is_single 是否单例(true:是 false:否)
     * @return object
     */
	public static function getInstance($conf, $is_single = true){
        if ($is_single) {
            if(self::$instance == null){
                self::$instance = new self($conf);
            }
        } else {
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