import { CKEditor } from "@ckeditor/ckeditor5-react";
import React, { useRef, useEffect } from "react";
import axios from "axios";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { IMAGE_UPLOADER_STORAGE } from "constants/ApiConstant";

export const MyEditor = (props) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.editor;
      if (editorInstance) {
        const editorElement = editorInstance.ui.getEditableElement();
        editorElement.setAttribute("contenteditable", "false");
      }
    }
  }, []);

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          var formData = new FormData();
          loader.file.then((file) => {
            formData.append("file", file);
            axios
              .post(IMAGE_UPLOADER_STORAGE, formData)
              .then((res) => {
                resolve({
                  default: res.data.secure_url,
                });
              })
              .catch((err) => {
                console.log(err);
                reject(err);
              });
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={props.data ? props.data : ""}
      style={{ height: "150em" }}
      config={{
        // plugins: [ImageResize],
        // toolbar:false,
        // isReadOnly:true ,
        ...props.config,
        extraPlugins: [uploadPlugin],
      }}
      onReady={(editor) => {
        // console.log('Editor is ready to use!', editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        props.setState(data);
      }}
      onBlur={(event, editor) => {
        console.log("Blur.", editor);
      }}
      onFocus={(event, editor) => {
        console.log("Focus.", editor);
      }}
    />
  );
};
