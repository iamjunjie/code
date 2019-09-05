#!/bin/bash

# 根目录
root_dir=$(cd `dirname $0`; pwd)
api_dir="$root_dir/api"
cli_dir="$root_dir/cli"
# '.xiaohe.com' '.xiaohe.com' '.xiaohe.com'

# 项目代码目录
dir_arr=("$api_dir/newapi.xiaohe.com" "$api_dir/apiaixiao.xiaohe.com" "$api_dir/apiparent.xiaohe.com" "$api_dir/apiapphome.xiaohe.com" "$api_dir/apimarket.xiaohe.com" "$api_dir/apibusiness.xiaohe.com" "$api_dir/apicore.xiaohe.com" "$cli_dir/crontab_3.0")

for dir_item in ${dir_arr[*]} 
do
    # 如果没有传入分支号，默认为v6.0.0
    branch_num=$1
    if [ "$branch_num" = '' ]
    then 
        branch_num='v6.0.0'
    fi
    
    # apicore.xaohe.com 推送 master 分支代码
    if [[ "$dir_item" == "$api_dir/apicore.xiaohe.com" ]]
    then 
        branch_num='master'
    fi
    
    echo "[$dir_item]开始推送代码"
        
    echo "进入目录：$dir_item"
    cd "$dir_item"
    echo -e
    
    echo "切换分支：$branch_num，命令：git checkout $branch_num"
    git checkout $branch_num
    echo -e

    echo "拉取代码：$branch_num，命令：git pull origin $branch_num"
    git pull origin $branch_num
    echo -e

    echo "推送代码：$branch_num，命令：git push xiwangmeishu $branch_num"
    git push xiwangmeishu $branch_num

    echo "[$dir_item]推送代码结束"

    echo -e
    echo -e
    echo -e
    echo -e

done

echo "${dir_arr[*]} 代码推送完成"