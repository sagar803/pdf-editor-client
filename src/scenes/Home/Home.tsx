import { useState } from "react";
import Navbar from "../../components/Navbar";
import PDFViewer from "../../utils/PdfViewer";
import { MdCancel } from "react-icons/md";
import { HomeProps } from "../../type";
import { Loader } from "../Loader/Loader";

export const Home = ({user, isAuth, setIsAuth} : HomeProps) => {

    const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [modificationResponse, setModificationResponse] = useState<any>();
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (file) {
        setSelectedPages(new Set());
        setSelectedFile(file);
        setModificationResponse(null)
      }
    };

    console.log(loading);
    
    const handleUpload = async (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedFile && selectedPages.size > 0) {
        setLoading(true);
        try {
          const formData = new FormData();
          formData.append("pdf", selectedFile);
          formData.append("selectedPages", JSON.stringify(Array.from(selectedPages)));
          if (user && user.userId) formData.append('userId', user.userId);

          const res = await fetch(`${process.env.REACT_APP_API}/files/upload`, {method: "POST", body: formData});
          
          if (res.ok) {
            const data = await res.json();
            setModificationResponse(data.savedFileDate)
          } else {
            throw new Error('Server error');
          }
        } catch (error) {
          console.log(error);
        } finally{
          setLoading(false);
        }
      } else {
          alert("Please select a file and some pages.");
      }
    }
  
    return (  
        <div className="w-[100%] h-[100%]">
            <Navbar user={user} setIsAuth={setIsAuth} />
            <div className="w-[100%] h-[90%]">
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
                loading ? (
                  <Loader />
                ) : (
                  <div className="h-[90%]" >
                      {
                        modificationResponse ? (
                          <>
                            <p>Your File has Successfully Edited</p>
                            <div className="flex justify-center items-center h-[100%]">
                              <a
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded m-2 cursor-pointer" 
                                target="_blank"
                                href={`${process.env.REACT_APP_API}/${modificationResponse.modifiedToFilePath}`}
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
                          </>
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
              )
            }
            </div>
        </div>
    );  
}
