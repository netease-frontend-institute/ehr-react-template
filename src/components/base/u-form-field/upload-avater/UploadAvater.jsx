/**
 * 照片上传
 * @param {arr} validFileType 支持上传的附件类型
 * @param {arr|obj} fileList 附件
 * @param {number} maxCount 最大上传个数
 * @param {number} maxSize 文件最大上传大小，单位为”M“
 * 特别要注意的是我们在手动清空列表的时候需要传"空数组[]"
 */
import React, { Component } from 'react';
import { Upload, Icon, Modal, message, Slider } from 'antd';
import AvatarEditor from 'react-avatar-editor';
import { saveAvatar } from '@/axios/api/index';
import { isEqual } from 'lodash';
import './index.less';

const MAX_COUNT = 1; // 默认最大上传一张照片
const MAX_SIZE = 2; // 默认最大上传文件大小2M
const VALID_FILE_TYPE = ['jpg', 'jpeg', 'png', 'gif']; // 默认支持附件上传的格式

export default class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            scale: 1.6,
            previewImage: null, // 预览图片

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
     * return false 还是会触发一次handleChange
     */
    beforeUpload = file => {
        const { validFileType = VALID_FILE_TYPE, maxSize = MAX_SIZE } = this.props;
        const myfileTypeList = file.name.split('.');
        const myfileType = myfileTypeList[myfileTypeList.length - 1];
        this.isContinue = true; // 是否继续上传

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

    // 上传图片
    handleChange = info => {
        if (!this.isContinue || info.file.status === 'removed') return;
        this.getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl, visible: true }));
    };

    // base64 位转码
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    // 预览图片
    handlePreview = file => {
        this.setState({ previewImage: file.url, previewVisible: true });
    };

    // 删除图片
    onRemove = file => {
        let { fileList } = this.state;
        const { onChange } = this.state;
        fileList = fileList.filter(item => item !== file);
        this.setState({ fileList }, () => onChange && onChange(fileList));
    };

    // 放大底片
    handleScale = scale => {
        this.setState({ scale });
    };

    // 取消上传头像
    handleCancel = () => {
        this.setState({ visible: false });
    };

    // 放弃预览
    previewCancel = () => {
        this.setState({ previewVisible: false });
    };

    // 保存头像的功能
    handleOk = () => {
        const { onChange } = this.props;
        if (this.editor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            // If you want the image resized to the canvas size (also a HTMLCanvasElement)
            const canvasScaled = this.editor.getImageScaledToCanvas().toDataURL('image/png', 1.0);
            this.setState({ loading: true });
            saveAvatar({ canvasScaled })
                .then(data => {
                    message.success('上传成功');
                    this.setState({ visible: false }, () => onChange && onChange(data));
                })
                .finally(() => this.setState({ loading: false }));
        }
    };

    render() {
        const { children, maxCount = MAX_COUNT } = this.props;
        const { visible, previewVisible, imageUrl, previewImage, fileList, loading, scale } = this.state;

        const uploadButton = (
            <>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传</div>
            </>
        );

        const props = {
            action: '/',
            name: 'file',
            className: 'upload',
            listType: 'picture-card',
            fileList,
            onChange: this.handleChange, // 上传图片改变时的状态
            onPreview: this.handlePreview, // 点击文件链接或预览图标时的回调
            onRemove: this.onRemove, // 点击移除文件时的回调，返回值为 false 时不移除
            beforeUpload: this.beforeUpload // 图片上传前的钩子函数
        };

        return (
            <div className="m-avatar">
                <Upload {...props}>{fileList.length >= maxCount ? null : children ? children : uploadButton}</Upload>

                <div className="tip">
                    <div>1、建议上传证件照</div>
                    <div>2、最佳尺寸：宽200像素，高300像素</div>
                    <div>3、请上传JPG、JPEG、PNG或者GIF文件，文件大小不要超过2M。</div>
                </div>

                <Modal title="照片预览" visible={previewVisible} onCancel={this.previewCancel} footer={null} bodyStyle={{ textAlign: 'center' }}>
                    <img alt="照片预览" style={{ width: '200px', height: '300px' }} src={previewImage} />
                </Modal>

                <Modal title="裁剪照片" visible={visible} onCancel={this.handleCancel} onOk={this.handleOk} confirmLoading={loading}>
                    <div style={{ textAlign: 'center' }}>
                        <AvatarEditor
                            ref={editor => (this.editor = editor)}
                            image={imageUrl}
                            width={300}
                            height={400}
                            border={40}
                            color={[0, 0, 0, 0.8]} // RGBA
                            scale={parseFloat(scale)}
                            rotate={0}
                        />
                    </div>
                    <Slider onChange={this.handleScale} min={1} max={3} step={0.1} value={scale} style={{ width: 280, margin: '10px auto' }} />
                </Modal>
            </div>
        );
    }
}
