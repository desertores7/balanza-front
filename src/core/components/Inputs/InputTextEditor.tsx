import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface InputTextEditorProps {
    value?: string;
    label?: string;
}

export default function InputTextEditor({ 
    value = "", 
    label = "Contenido",
}: InputTextEditorProps) {
    const [editorData, setEditorData] = useState(value);

    useEffect(() => {
        setEditorData(value);
    }, [value]);



    return (
        <div className={"mb-3"}>
            {label && <label className="form-label">{label}</label>}
            <CKEditor 
                editor={ClassicEditor}
                data={editorData}
                config={{
                    ckfinder: {
                        headers: {
                            //'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                    },
                }}
                onReady={(editor) => {
                }}
            />
        </div>
    );
}
