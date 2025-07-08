import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FaCopy } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";
import { FaHourglassEnd } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaFileImage } from "react-icons/fa";

function Home() {
  const [base64Image, setBase64Image] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState('');
  const [file, setFile] = useState(null);
  const [Alert, setAlert] = useState({ show: false, message: '', status: '' });

  const showAlert = (message, status = 'error') => {
    setAlert({ show: true, message: message, status: status })
    setTimeout(() => {
      setAlert({ show: false, message: '', status: '' })
    }, 5000);

  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          setBase64Image(base64);
          setFile(selectedFile);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  });

  const sendToBackend = async () => {
    if (!base64Image) {
      console.log('error');
      showAlert("please Select image  to extract");
      return;
    }
    try {

      setLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/img', {
        image: base64Image,
      });
      showAlert("Extracted sucessfully", 'success');
      setResponseData(response.data?.data);
    } catch (err) {
      showAlert(`Error occur during extrcating ${err.toString()}`);
    } finally {
      setLoading(false);
    }
  };
  function copyClip() {
    navigator.clipboard.writeText(responseData).then(() => { console.log('superb') }).catch((err) => { console.log(err) });
  }

  return (
    <div className="w-full min-h-screen bg-[#e5e7eb] flex flex-col md:flex-row justify-center items-center space-y-4 p-4 relative">
      {Alert.show &&
        <div className={`absolute top-3 left-1/2  shadow-2xl  -translate-x-1/2 rounded-2xl px-6 py-2 flex justify-center items-center  ${Alert.status == 'error' ? 'bg-red-500 text-white' : 'bg-green-500'}`}>
          <p className='font-semibold'>{Alert.message}</p>
        </div>}

      <div className='flex-1 flex justify-center items-center flex-col'>
        <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-10 rounded-2xl hover:scale-105 transition-transform duration-300 text-center cursor-pointer md:w-max">
          <input {...getInputProps()} />
          <p>Drag & drop a .jpg or .png image here, or click to select</p>

        </div>

        {file && (
          <aside className="mt-4 flex flex-col items-center space-y-2">
            <div className='flex justify-center items-center'>  <h4 className="font-bold "><FaFileImage /></h4><p>{file.path}-{file.size}</p></div>
            <img src={URL.createObjectURL(file)} alt="preview" className="max-w-xs max-h-64 rounded shadow" />
          </aside>
        )}

        <div className="w-full flex justify-center space-x-4 items-center mt-4">
          <button
            className="p-2 bg-white border border-black hover:bg-black hover:text-white font-semibold text-black rounded-2xl"
            onClick={sendToBackend}
            disabled={loading}
          >
            {loading ? <FaHourglassEnd /> : <BsFillSendFill />}
          </button>
          <button
            className="p-2 bg-white border border-black hover:bg-black hover:text-white font-semibold text-black rounded-2xl"
            onClick={() => {
              if (!file) {
                showAlert("There is no Image no need to refresh")
              }
              setFile(null);
              setBase64Image('');
              setResponseData('');
            }}
            disabled={loading}
          >
            {loading ? <FaClockRotateLeft /> : <IoMdRefresh />}
          </button>
        </div>
      </div>

      <div className='flex-1'>    {responseData && (
        <div className="mt-4 p-4 bg-white rounded shadow w-full max-w-xl text-center">
          <h2 className="text-lg font-bold mb-2">Extracted Text:</h2>
          <div className="p-5 shadow-2xl text-center max-h-100 overflow-y-auto   rounded bg-white ">
            <p className="whitespace-pre-wrap">{responseData}</p>

          </div>
          <button className='px-3 py-1 mt-2 font-semibold text-black cursor-pointer hover:bg-black hover:text-white rounded-2xl' onClick={copyClip} ><FaCopy /></button>
        </div>
      )}</div>

      {loading && (
        <div className="absolute inset-0 bg-white/60 flex justify-center items-center z-20 text-lg font-bold">
          Processing...
        </div>
      )}
    </div>
  );
}

export default Home;
