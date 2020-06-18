#!/bin/bash
declare -i count=0   #文件修改数

function changeName(){
    new=`echo $1|sed 's/I/i/g'`
    git mv $1 $new

    count=$count+1
}

function travFolder(){
    if [ "$1"x != ""x ];then
        flist=`ls $1`

        cd $1

        for f in $flist
        do
            if test -d $f
            then
                #echo "dir:$f"
                travFolder $f
            else
                #echo "file:$f"

                if [ "$f"x = "Index.jsx"x ];then
                    echo `pwd`"/$f"
                    changeName $f
                fi
            fi
        done
        cd ../ 
    else
        echo 请在第二个参数传入要开始遍历的目录（推荐以 相对路径 的形式）
    fi
}

travFolder $1

echo - 批量修改了 $count 个文件 -
