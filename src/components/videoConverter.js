import { FFmpeg } from '@ffmpeg/ffmpeg';
import React, { useState, useRef } from 'react';
import { toBlobURL } from '@ffmpeg/util';

export const VideoConverter = () => {

    const [fileName, setFileName] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    // const [fileN, setFile] = useState(null);


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



    //-----------ffmpeg stuff-----------
    const[loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);
    const messageRef = useRef(null);

    const load = async () =>{
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({message}) => {
            messageRef.current.innerHTML = message;
            console.log(message);
        })
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);
    }

    const transcode = async (file, inFileType, outFileType)=>{
        const ffmpeg = ffmpegRef.current;
        const inFileName = 'input'+ inFileType;
        const outFileName = 'output'+ outFileType;
        await ffmpeg.writeFile(inFileName, file );
        await ffmpeg.exec(['-i',inFileName, outFileName]);
        const data = await ffmpeg.readFile(outFileName);
        videoRef.current.src = URL.createObjectURL(new Blob([data.buffer],{type:'video/mp4'}));
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