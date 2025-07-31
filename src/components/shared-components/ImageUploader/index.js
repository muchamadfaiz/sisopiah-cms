import { AddAPhoto } from '@material-ui/icons';
import { Image, Upload, message } from 'antd'
import { IMAGE_UPLOADER_STORAGE } from 'constants/ApiConstant';
import React from 'react'

const ImageUploader = ({onChange, imageUrl}) => {

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <AddAPhoto />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  
  return (
    <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={IMAGE_UPLOADER_STORAGE}
        onChange={onChange}
        beforeUpload={beforeUpload}
      >
        {imageUrl ? <Image preview={true} src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
  )
}

export default ImageUploader;