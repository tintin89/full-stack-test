import { useState } from "react";
import "./App.css";
import { uploadFile } from "./services/upload";
import { Toaster,toast } from "sonner";
import { Data } from "./types";


const APP_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  READY_UPLOAD: "ready_upload",
  UPLOADING: "uploading",
  READY_USAGE: "ready_usage",
} as const;

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: "Upload",
  [APP_STATUS.UPLOADING]: "Uploading...",
};

type AppStatus = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
  const [status, setStatus] = useState<AppStatus>(APP_STATUS.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [dataR, setDataR] = useState<Data>([]);

  const showButton =
    status === APP_STATUS.READY_UPLOAD || status === APP_STATUS.UPLOADING;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];
    if (file) {
      setFile(file);
      setStatus(APP_STATUS.READY_UPLOAD);
    }
    
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== APP_STATUS.READY_UPLOAD || !file) return;
    setStatus(APP_STATUS.UPLOADING);

    const [err,data] = await uploadFile(file);    
    if(err) {
      setStatus(APP_STATUS.ERROR);
      toast.error(err.message);
      return;
    }
    console.log(data);
    setStatus(APP_STATUS.READY_USAGE);
    if(data) setDataR(data);
    toast.success("File uploaded successfully");
    
  };

  return (
    <>
      <Toaster />
      <h4>Challenge CSV and Search</h4>
      <form onSubmit={handleSubmit}>      
        <div>
          <label>
            <input
              disabled={status === APP_STATUS.UPLOADING}
              onChange={handleInputChange}
              name="file"
              type="file"
              accept=".csv"
            />
          </label>
          {showButton && (
            <button disabled={status === APP_STATUS.UPLOADING}>
              {BUTTON_TEXT[status]}
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default App;
