# 采用alpine官方镜像做为运行时镜像
FROM alpine:3.13

# 安装基础命令
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
&& apk add --update --no-cache ca-certificates nodejs npm curl tzdata && \
    rm -f /var/cache/apk/*

# 设置时区
RUN ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo Asia/Shanghai > /etc/timezone

# 设置应用工作目录
WORKDIR /app

# 将包管理文件拷贝到运行时的工作目录中
COPY package*.json /app/

# npm 源，选用国内淘宝镜像源以提高下载速度
RUN npm config set registry https://registry.npm.taobao.org/

# 暴露端口
# 此处端口必须与构建小程序服务端时填写的服务端口和探活端口一致，不然会部署失败
EXPOSE 80

# npm 安装依赖
RUN npm install

# 将当前目录下所有文件都拷贝到工作目录下
COPY . /app

# 执行启动命令
CMD ["npm", "start"]