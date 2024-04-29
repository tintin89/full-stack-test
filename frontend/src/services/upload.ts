import { ApiUploadResponse, type Data } from "../types";

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`http://localhost:3000/api/files`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      return [new Error(`Failed to upload file: ${res.statusText}`)];
    }
    const json = await res.json() as ApiUploadResponse;
    return  [undefined, json.data];
  } catch (e) {
    if(e instanceof Error) {
    return [e];
  }
    return [new Error("An unknown error occurred")];
    }
};
