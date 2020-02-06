/**
 * 大附件上传
 * @param {string} type dragger-拖拽上传
 * @param {number} trunkSize 分片附件大小 默认5M（5 * 1024 * 1024）
 * @param {arr} validFileType 支持上传的附件类型
 * @param {arr|obj} fileList 附件
 * @param {number} maxCount 最大上传个数
 * @param {number} size 最大上传文件大小，单位G
 * @param {bool} isNeedDeleteFunc 删除附件是否调用删除接口(true-调用 false-不调用 默认不调用)
 * @param {function} evChangeStatus 分片上传状态变更时调用 1-正在上传 2-上传成功 3-上传失败
 * @param {function} evCompleteCallback 分片上传完成时调用
 * 特别要注意的是我们在手动清空列表的时候需要传"空数组[]";
 */
import React, { Component } from 'react';
import { Upload, message, Button, Icon } from 'antd';
import { isEqual } from 'lodash';
import { multiUploadInit, multiUpload, multiUploadComplete, deleteFile } from '@/axios';

// 默认文件上传样式
const Content = props => (
    <>
        <Button>
            <Icon type="upload" /> 点击上传
        </Button>

        {props.extra && <p className="ant-upload-hint">{props.extra}</p>}
    </>
);

// 默认拖拽上传样式
const DraggerContent = props => (
    <>
        <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">点击或将文件拖拽到这里</p>
        {props.extra && <p className="ant-upload-hint">{props.extra}</p>}
    </>
);

const BlackList = []; // 黑名单
const MAX_COUNT = Infinity; // 默认无限上传
const MAX_SIZE = 5; // 默认最大上传文件大小5G
class UploadChunk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: this.formatData(props.fileList)
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.fileList && !isEqual(this.formatData(this.props.fileList), prevProps.fileList)) {
            this.setState({ fileList: this.formatData(this.props.fileList) });
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

    // 附件上传前的钩子函数
    beforeUpload = (file, fileList) => {
        const { validFileType, size = MAX_SIZE, maxCount = MAX_COUNT, type } = this.props;
        const myfileTypeList = file.name.split('.');
        const myfileType = myfileTypeList[myfileTypeList.length - 1];
        this.isContinue = true; // 是否继续上传

        // 校验文件上传个数（拖拽上传）
        if (type === 'dragger' && this.state.fileList.concat(fileList).length > maxCount) {
            message.error(`最多只能上传${maxCount}个附件哦!`);
            this.isContinue = false;
            return false;
        }

        // 校验文件格式
        if (validFileType && (!myfileType || !validFileType.includes(myfileType.toLowerCase()))) {
            message.error('不支持此格式的附件上传!');
            this.isContinue = false;
            return false;
        }

        // 校验文件大小
        const isLt = file.size / 1024 / 1024 < 1024 * size;
        if (!isLt) {
            message.error('文件大小要小于' + size + 'G!');
            this.isContinue = false;
            return false;
        }
        return true;
    };

    // 分片初始化获取当前文件id
    trunkFileInit = e => {
        const { evChangeStatus } = this.props;
        const { file } = e;
        let { fileList } = this.state;
        let curTrunkCount = 0;
        (fileList || []).push(file);
        this.setState({ fileList });
        evChangeStatus && evChangeStatus({ status: 1, file });
        multiUploadInit()
            .then(data => {
                this.multiUpload(
                    {
                        uploadId: data.uploadId,
                        nosKey: data.nosKey
                    },
                    curTrunkCount,
                    e
                );
            })
            .catch(() => {
                evChangeStatus && evChangeStatus({ status: 3, file });
                message.error(`${file.name} 文件上传失败`);
                e.onError();
            });
    };

    // 分片上传
    multiUpload = (IdNoskey, curTrunkCount, e) => {
        const { file } = e;
        const { evChangeStatus, trunkSize = 5 * 1024 * 1024 } = this.props;
        const trunkCount = Math.ceil(file.size / trunkSize);
        const start = curTrunkCount * trunkSize,
            end = Math.min(file.size, start + trunkSize); //比较size和分片结束位置的值
        let fileBlob = new File([file], file.name); //文件格式化转为blob
        let formData = new FormData();
        formData.append('data', fileBlob.slice(start, end));
        formData.append('uploadId', IdNoskey.uploadId);
        formData.append('partIndex', curTrunkCount + 1);
        formData.append('nosKey', IdNoskey.nosKey);
        multiUpload(formData)
            .then(() => {
                e.onProgress({ percent: Math.round(((curTrunkCount + 1) / trunkCount) * 100) });
                if (curTrunkCount + 1 === trunkCount) {
                    //当前上传是否为最后一片
                    this.multiUploadComplete(
                        {
                            uploadId: IdNoskey.uploadId,
                            nosKey: IdNoskey.nosKey,
                            fileName: file.name,
                            total: trunkCount
                        },
                        e
                    );
                } else if (curTrunkCount + 1 < trunkCount) {
                    curTrunkCount++;
                    !BlackList.includes(file.uid) && this.multiUpload(IdNoskey, curTrunkCount, e);
                }
            })
            .catch(() => {
                evChangeStatus && evChangeStatus({ status: 3, file });
                message.error(`${file.name} 文件上传失败`);
                e.onError();
            });
    };

    // 结束分片
    multiUploadComplete = (params, e) => {
        let { file } = e;
        const { evCompleteCallback, evChangeStatus } = this.props;
        multiUploadComplete(params)
            .then(data => {
                const { url, id, nosKey, appendixName } = data || {};
                file.url = url;
                file.id = id;
                file.nosKey = nosKey;
                file.appendixName = appendixName;
                evChangeStatus && evChangeStatus({ status: 2, file });
                message.success(`${e.file.name} 文件上传成功`);
                evCompleteCallback && evCompleteCallback(file);
                e.onSuccess();
            })
            .catch(() => {
                evChangeStatus && evChangeStatus({ status: 3, file });
                message.error(`${file.name} 文件上传失败`);
                e.onError();
            });
    };

    // 删除文件
    onRemoveFile = e => {
        const { isNeedDeleteFunc = false } = this.props;
        isNeedDeleteFunc && deleteFile({ nosKey: e.nosKey });
    };

    // 文件上传进行中持续调用
    onChangeFile = info => {
        const { onChange } = this.props;
        let { fileList, file } = info;

        if (!this.isContinue) return; // 高版本antd中beforeUpload函数return false 任然会触发一次onChang方法

        if (file.status === 'removed') {
            BlackList.push(file.uid);
        }

        this.setState({ fileList }, () => onChange && onChange(fileList));
    };

    render() {
        const { fileList } = this.state;
        const { children, maxCount = MAX_COUNT, type, ...rest } = this.props;
        const newProps = {
            ...rest,
            fileList,
            onRemove: this.onRemoveFile,
            customRequest: this.trunkFileInit,
            beforeUpload: this.beforeUpload,
            onChange: this.onChangeFile
        };
        return type === 'dragger' ? (
            <Upload.Dragger {...newProps}>{children ? children : <DraggerContent {...this.props} />}</Upload.Dragger>
        ) : (
            <Upload {...newProps}>{fileList.length < maxCount && (children ? children : <Content {...this.props} />)}</Upload>
        );
    }
}

export default UploadChunk;
