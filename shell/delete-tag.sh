#!/bin/bash

:<<EOF
此脚本用来批量删除远程和本地tag，用法
1. 将delete-tag文件置于代码目录(如：/Users/wangjunjie/Workspace/xiaohe/vip/xiwangmeishu/apibusiness/delete-tag.sh)
2. 进入目录(如：cd /Users/wangjunjie/Workspace/xiaohe/vip/xiwangmeishu/apibusiness)，执行命令：sh delete-tag.sh即可以实现批量删除tag
2.1 保留最新的5个版本
EOF

echo "拉取代码：git pull"
git pull

# 删除 测试 tag
release_tag_arr=($(git tag --sort=taggerdate | grep "release*"))
release_tag_len=${#release_tag_arr[*]}
for(( i=0; i<$release_tag_len - 5; i++)) 
do
    tag_name=${release_tag_arr[i]}
    
    echo "删除远程tag：$tag_name, 命令: git push origin --delete tag $tag_name"
    git push origin --delete tag $tag_name

    echo "删除本地tag：$tag_name, 命令：git tag -d $tag_name"
    git tag -d $tag_name
done

release_tag_arr=$(git tag --sort=taggerdate | grep "release*")
for tag_name in $release_tag_arr
do
    echo "保留tag：$tag_name"
done

# 删除 稳定 tag
stable_tag_arr=($(git tag --sort=taggerdate | grep "stable*"))
stable_tag_len=${#stable_tag_arr[*]}
for(( i=0; i<$stable_tag_len - 5; i++)) 
do
    tag_name=${stable_tag_arr[i]}
    
    echo "删除远程tag：$tag_name, 命令: git push origin --delete tag $tag_name"
    git push origin --delete tag $tag_name

    echo "删除本地tag：$tag_name, 命令：git tag -d $tag_name"
    git tag -d $tag_name
done

stable_tag_arr=$(git tag --sort=taggerdate | grep "stable*")
for tag_name in $stable_tag_arr
do
    echo "保留tag：$tag_name"
done