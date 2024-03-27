import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
    pdfFile: File,
    selectedPages: Set<number> ,
    setSelectedPages: React.Dispatch<React.SetStateAction<Set<number>>>
}

const PDFViewer = ({ pdfFile, selectedPages, setSelectedPages }: Props) => {
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    
    const togglePageSelection = (selectedPages : Set<number>, pageNumber: number) => {
        const newSet = new Set(selectedPages);
        if(newSet.has(pageNumber)) newSet.delete(pageNumber);
        else newSet.add(pageNumber);
        setSelectedPages(newSet);
    }

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    return (
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <style>
                {`
                    .react-pdf__Page__textContent {
                        display: none;
                    }
                    .react-pdf__Page__annotations {
                        display: none;
                    }
                `}
            </style>
            <div className='flex justify-center'>
                <Document 
                    className='flex' 
                    file={pdfFile} 
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page 
                        height={600}
                        onClick={() => togglePageSelection(selectedPages, pageNumber)} 
                        pageNumber={pageNumber} 
                        renderMode="canvas"
                        className={`border-4 rounded-md before:text-blue-500 before:m-2 ${selectedPages.has(pageNumber) ? "before:content-['Selected'] border-blue-500" : "before:content-['Click-to-select']"}` }
                        />
                </Document>
            </div>
            <p className="text-gray-600 text-center mt-4">
                Page {pageNumber} of {numPages}
            </p>
            <div className="flex justify-center items-center m-1">
                <button
                    className="bg-blue-500 h-10 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mr-2"
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(pageNumber - 1)}
                >
                    Previous
                </button>
                <button
                    className="bg-blue-500 h-10 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(pageNumber + 1)}
                >
                    Next
                </button>
                <div className="flex m-1 items-center">
                    <p>Selected Pages: </p>
                    {selectedPages.size === 0 ? <p>none</p> : (
                        <div className="w-[200px] flex overflow-x-scroll">
                            {Array.from(selectedPages).map((page, index) => (
                                <div  
                                    key={index} 
                                    className="border-2 select-none border-blue-500 text-blue-500 font-bold py-1 px-3 rounded m-1 cursor-pointer"
                                    onClick={() => setPageNumber(page)}
                                >
                                    {page}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;
