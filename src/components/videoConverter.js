import { FFmpeg } from '@ffmpeg/ffmpeg';
import React, { useState, useRef, useEffect } from 'react';
import { toBlobURL, fetchFile } from '@ffmpeg/util';


//TODO
/*
Download the finished video
Show feedback that the video is converting
Show progress updating bar (get from chalance website)

Allow all file types, and choose the output type
*/


export const VideoConverter = () => {

    const [fileName, setFileName] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [progress, setProgress] = useState(0);
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

        //ACCEPTED FILE TYPES ------------------------------------------------------------------TODO
        if(file.type === 'video/mp4'){
            setErrorMsg('');
            transcode(file,'.mp4','.avi').then(data=>{
                downloadVideo(data);
            });
        }
        else{
            setErrorMsg('Only mp4 supported');
        }

    }

    const downloadVideo = (data) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([data.buffer], {type:'video/avi'}));//CHANGE THIS TO UPDATE WITH DIFFERENT FILE TYPES ------TODO
        a.download = fileName + '_converted.avi';

        a.click();
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

    const loadFFmpeg = async () =>{
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

        const ffmpeg = ffmpegRef.current;

        ffmpeg.on('progress', event => {
            // console.log(event.progress * 100);
            setProgress(event.progress * 100);
        })

        await ffmpeg.load({
            coreURL: `${baseURL}/ffmpeg-core.js`,
            wasmURL: `${baseURL}/ffmpeg-core.wasm`,
            workerURL: `${baseURL}/ffmpeg-core.worker.js`,
        });
        setLoaded(true);
    }

    const transcode = async (file, inFileType, outFileType)=>{
        const ffmpeg = ffmpegRef.current;
        const inFileName = 'input'+ inFileType;
        const outFileName = 'output'+ outFileType;
        await ffmpeg.writeFile(inFileName, await fetchFile(file));
        await ffmpeg.exec(['-i',inFileName, outFileName]);
        const data = await ffmpeg.readFile(outFileName);
        // videoRef.current.src = URL.createObjectURL(new Blob([data.buffer],{type:'video/mp4'}));
        return data;
    }



    useEffect(()=>{
        loadFFmpeg();
    },[]);


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
            <p>{progress>0 ? progress.toFixed(1) : ''}</p>
        </div>
    </div>
  )
}