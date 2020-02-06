/**
 * 附件上传
 * @param {arr} validFileType 支持上传的附件类型
 * @param {arr|obj} fileList 附件
 * @param {number} maxCount 最大上传个数
 * @param {number} maxSize 文件最大上传大小，单位为”M“
 * 特别要注意的是我们在手动清空列表的时候需要传"空数组[]";
 */
import React, { Component } from 'react';
import { Upload, message, Icon } from 'antd';
import { isEqual } from 'lodash';

const Dragger = Upload.Dragger;
const MAX_COUNT = 10; // 默认最大上传十条附件
const MAX_SIZE = 20; // 默认最大上传文件大小20M
const VALID_FILE_TYPE = ['doc', 'docx', 'pdf', 'jpg', 'jpeg', 'gif', 'psd', 'png', 'swf', 'avi']; // 默认支持附件上传的格式

export default class UploadDragger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: this.formatData(props.fileList)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.fileList && !isEqual(this.formatData(nextProps.fileList), this.state.fileList)) {
            this.setState({ fileList: this.formatData(nextProps.fileList) });
        }
    }

    // 格式化参数(手动添加uid)
    formatData = data => {
        if (!data) return [];
        return Array.isArray(data)
            ? data.map(
                  item =>
                      (item = {
                          uid: item.uid || item.id || item.nosKey,
                          name: item.appendixName || item.name,
                          ...item
                      })
              )
            : [
                  {
                      uid: data.uid || data.id || data.nosKey,
                      name: data.appendixName || data.name,
                      ...data
                  }
              ];
    };

    /**
     * 附件上传前的钩子函数
     * return false 还是会触发一次onFileChange
     */
    beforeUpload = (file, fileList) => {
        const { validFileType = VALID_FILE_TYPE, maxCount = MAX_COUNT, maxSize = MAX_SIZE } = this.props;
        const myfileTypeList = file.name.split('.');
        const myfileType = myfileTypeList[myfileTypeList.length - 1];
        this.isContinue = true; // 是否继续上传
        // 最多展示附件数
        if (fileList.length > maxCount) {
            message.error(`最多只能上传${maxCount}个附件哦`);
            this.isContinue = false;
            return false;
        }

        // 校验文件格式
        if (validFileType && (!myfileType || !validFileType.includes(myfileType.toLowerCase()))) {
            message.error('不支持该格式的附件哦');
            this.isContinue = false;
            return false;
        }

        // 校验文件大小
        if (file.size > maxSize * 1024 * 1024) {
            message.error(`文件大小不能超过${maxSize}M哦`);
            this.isContinue = false;
            return false;
        }
        return true;
    };

    // 附件上传
    onFileChange = info => {
        const { onChange } = this.props;
        const { status, name } = info.file;
        let fileList = info.fileList;

        if (!this.isContinue) return;
        if (status === 'done') {
            // 读取远程路径并显示链接。
            message.success(`${name} 文件上传成功`);
            fileList = fileList.map(file => {
                if (file.response) {
                    let data = file.response.data;
                    file.url = data.url;
                    file.appendixKey = data.nosKey;
                }
                return file;
            });
        } else if (status === 'error') {
            message.error(`${name} 文件上传失败`);
        }

        this.setState({ fileList }, () => onChange && onChange(fileList));
    };

    render() {
        const { children } = this.props;
        const { fileList } = this.state;
        const fileProps = {
            name: 'file',
            fileList,
            action: '/mock/test/api/campuspc/file/uploadFile',
            beforeUpload: this.beforeUpload,
            onChange: this.onFileChange
        };

        return (
            <Dragger {...fileProps}>
                {children ? (
                    children
                ) : (
                    <>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">点击或将文件拖拽到这里</p>
                        <p className="ant-upload-hint">支持doc、docx、pdf、jpg、jpeg、gif、psd、png、swf、avi格式大小不能超过20M</p>
                    </>
                )}
            </Dragger>
        );
    }
}
