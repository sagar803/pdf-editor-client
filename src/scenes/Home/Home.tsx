import { useState } from "react";
import Navbar from "../../components/Navbar";
import PDFViewer from "../../utils/PdfViewer";
import { MdCancel } from "react-icons/md";
import { HomeProps } from "../../type";

export const Home = ({user, isAuth, setIsAuth} : HomeProps) => {

    const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [modificationResponse, setModificationResponse] = useState<any>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (file) {
        setSelectedPages(new Set());
        setSelectedFile(file);
        setModificationResponse(null)
      }
    };
    
    const handleUpload = async (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append("pdf", selectedFile);
          formData.append("selectedPages", JSON.stringify(Array.from(selectedPages)));
          if (user && user.userId) formData.append('userId', user.userId);

          const res = await fetch('http://localhost:6001/files/upload', {method: "POST", body: formData});
          
          if (res.ok) {
            const data = await res.json();

            // const pdfBlob = await res.blob();
            // const pdfFile = new File([pdfBlob], 'extracted_pdf.pdf', { type: 'application/pdf' });
            // setModifiedFile(pdfFile);
            console.log(data.savedFileDate)
            setModificationResponse(data.savedFileDate)
          } else {
            throw new Error('Server error');
          }
        } catch (error) {
          console.log(error);
        }
      } else {
          alert("Please select a file to upload.");
      }
    }
  
    return (  
        <div className="w-[100%] h-[100%]">
            <Navbar user={user} setIsAuth={setIsAuth} />
            <div className="w-[100%] h-[100%]">
            {
              (selectedFile == null) ? (
                <div className="w-[100%] h-[100%] flex items-center justify-center">
                  <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id="file-input"
                  />
                  <label htmlFor="file-input" className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer">
                      Select PDF File
                  </label>
                </div>
              ) : (
                <div className="h-[90%]" >
                    {
                      modificationResponse ? (
                        <div className="flex justify-center items-center h-[100%]">
                          <a
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded m-2 cursor-pointer" 
                            target="_blank"
                            href={`http://localhost:6001/${modificationResponse.modifiedToFilePath}`}
                            download
                          >
                            Download Modified File
                          </a>
                          <input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                              id="file-input"
                          />
                          <label 
                              htmlFor="file-input" 
                              className="bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                          >
                              Edit New PDF File
                          </label>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-around">
                            <div className="flex items-center">
                              <p>Selected File: {selectedFile.name}</p>
                              <MdCancel aria-describedby="cancel" className="cursor-pointer" onClick={() => setSelectedFile(null)}/>
                            </div>

                            <button onClick={handleUpload} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 cursor-pointer">
                                Upload
                            </button>
                          </div>
                          <PDFViewer selectedPages={selectedPages} setSelectedPages={setSelectedPages} pdfFile={selectedFile}/>
                        </>
                      )
                    }
                </div>
              )
            }
            </div>
        </div>
    );  
}
