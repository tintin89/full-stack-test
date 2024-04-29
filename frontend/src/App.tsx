import { useState } from "react";
import "./App.css";

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

  const showButton =
    status === APP_STATUS.READY_UPLOAD || status === APP_STATUS.UPLOADING;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];
    if (file) {
      setFile(file);
      setStatus(APP_STATUS.READY_UPLOAD);
    }
    console.log(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== APP_STATUS.READY_UPLOAD || !file) return;
    setStatus(APP_STATUS.UPLOADING);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h4>Challenge CSV and Search</h4>
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
