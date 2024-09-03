import React, { useState } from 'react'

export const VideoConverter = () => {

    const [fileName, setFileName] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');


    //get the file from drag and drop
    const handleDrop = (e)=>{

        e.preventDefault();
        e.stopPropagation();

        if(!e.dataTransfer){
            setErrorMsg("no files found when dropped");
            return;
        }
        if(e.dataTransfer.files.length > 1){
            setErrorMsg("only drop one file");
            return;
        }

        //get the file
        const file = e.dataTransfer.files[0]

        //set the fileName
        if(file){
            setFileName(file.name);
        }

        if(file.type === 'video/webm'){
            setErrorMsg('');
        }
        else{
            setErrorMsg('Only webM supported');
        }
    }


    //handles the file drag over action
    const handleDragOver = (e)=>{
        e.preventDefault();
    }



  return (
    <div className="tool">
        <h3>Video Converter</h3>

        <div 
            className='dropZone'
            onDrop={(e)=>handleDrop(e)}
            onDragOver={(e)=>handleDragOver(e)}
        >
            <p>{fileName===null?"Drop File" : `File name: ${fileName}`}</p>
            <p>{errorMsg}</p>
        </div>
    </div>
  )
}