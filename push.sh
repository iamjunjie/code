#!/bin/bash

if [ -z "$1" ]
then
    echo "请输入注释"
    exit
fi

echo "1. 拉取：git fetch"
git fetch

echo "2. 合并：git merge"
git merge

echo "3. 添加：git add -A"
git add -A

echo "4. 提交：git commit -m '$1'"
git commit -m "$1"

echo "5. 推送：git push"
git push

echo "6. 完成"

