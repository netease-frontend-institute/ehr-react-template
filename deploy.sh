# 首先将指定node版本添加到PATH中，yarn运行时会调用node命令，公用构建机上默认全局安装的node版本很低，会引起报错
export PATH=/home/appops/static/ehr:$PATH
ln -s /usr/bin/node14 /home/appops/static/ehr/node
yarn1
yarn1 build