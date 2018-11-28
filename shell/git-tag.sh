#!/bin/bash

if [ -z "$1" ]
then
    echo "请输入被合并的分支名称，仿真为：develop，生产为：master"
    exit
fi

if [ -z "$2" ]
then
    echo "请输入要合并的分支名称"
    exit
fi

if [ -z "$3" ]
then
    echo "请输入tag名称"
    exit
fi

echo "1. 切到 $2：git checkout $2"
git checkout $2

echo "2. 拉取 $2：git pull"
git pull

echo "3. 切到 $1：git checkout $1"
git checkout $1

echo "4. 拉取 $1：git pull"
git pull

echo "5. 合并 $2 到 $1：git merge $2 -m '合并本地$2'"
git merge $2 -m "合并本地 $2"

echo "6. 推送：git push"
git push

echo "添加tag $3：git tag -a $3 -m 'add new tag：$3'"
git tag -a $3 -m "add new tag：$3"

echo "推送tag $3：git push origin $3"
git push origin $3

echo "完成"


