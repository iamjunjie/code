#!/bin/bash

# 希望美术打包代码
if [ -z "$1" ]
then
    echo "请输入分支号，然后进行代码打包"
    exit
fi

if [ -z "$2" ]
then
    echo "请输入标签号，然后进行代码打包"
    exit
fi

# 根目录
root_dir=$(cd `dirname $0`; pwd)
api_dir="$root_dir/vip/xiwangmeishu"

# 项目代码目录
dir_arr=("$api_dir/newapi" "$api_dir/apiaixiao" "$api_dir/apiparent" "$api_dir/apiapphome" "$api_dir/apimarket" "$api_dir/apibusiness" "$api_dir/apicore" "$api_dir/crontab")

for dir_item in ${dir_arr[*]} 
do    
    # apicore.xaohe.com 推送 master 分支代码
    tag_num=$2
    branch_num=$1
    if [[ "$dir_item" == "$api_dir/apicore" ]]
    then 
        branch_num='master'
    fi
    
    echo "[$dir_item]开始打包"
        
    echo "进入目录：$dir_item"
    cd "$dir_item"
    echo -e
    
    echo "切换分支：$branch_num，命令：git checkout $branch_num"
    git checkout $branch_num
    echo -e

    echo "拉取代码：$branch_num，命令：git pull origin $branch_num"
    git pull origin $branch_num
    echo -e

    echo "本地打包：$tag_num，命令：git tag -a $tag_num -m ''"
    git tag -a $tag_num -m ''
    echo -e

    echo "远程推送：$tag_num，命令：git push origin $tag_num"
    git push origin $tag_num
    echo -e

    echo "[$dir_item]打包结束"

    echo -e
    echo -e
    echo -e
    echo -e

done

echo "${dir_arr[*]} 代码打包完成"