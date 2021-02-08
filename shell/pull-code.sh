#!/bin/bash

:<<EOF
此脚本用来批量拉取代码，用法
1. 将push-code.sh文件置于代码目录上1层(与上一层同目录，如：AiXiao/api，AiXiao/app，AiXiao/pull-code.sh)
2. 进入目录(如：cd AiXiao)，执行命令：sh pull-code.sh即可以实现批量拉取代码
2.1 非目录/空目录会自动跳过
EOF

# 当前目录
curr_dir=$(pwd)
# 获取所有目录下项目，切换master分支，拉取代码
dir_arrs=$(ls $curr_dir)
for dir_path in $dir_arrs
do
    tmp_dir_path="$curr_dir/$dir_path"
    # 判断是否是目录
    if [ -d $tmp_dir_path ]; then
        if [ "`ls -A $tmp_dir_path`" != "" ]; then
            # 获取项目
            projects=$(ls $tmp_dir_path)
            for item in $projects
            do
                echo "==========开始拉取：$tmp_dir_path/$item"
                cd "$tmp_dir_path/$item"

                echo "仓库地址：git remote -v"
                git remote -v

                echo "切换分支: master, 命令: git checkout master"
                git checkout master

                echo "拉取代码: master, 命令: git pull origin master"
                git pull origin master
                
                echo "==========完成拉取：$tmp_dir_path/$item"

                echo "\n"
            done
            echo "$tmp_dir_path 目录所有代码更新完成"
        fi
    fi
done

echo "$curr_dir 目录所有代码更新完成"