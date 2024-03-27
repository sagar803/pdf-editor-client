import React, { useEffect, useState } from 'react'
import { File, ProfileProps } from '../../type'
import Navbar from '../../components/Navbar';
import { BsFiletypePdf ,BsDownload  } from "react-icons/bs";
import { MdOutlineArrowForward } from "react-icons/md";



export const Profile = ({user, isAuth, setIsAuth}: ProfileProps) => {
    const [files, setFiles] = useState<any>(null);
    const fetchFiles = async () => {
        try {            
            const response = await fetch(`http://localhost:6001/files/${user?.userId}`, {method: 'GET'});
            if (!response.ok) throw new Error('Failed to fetch files');
            const files = await response.json();
            setFiles(files);
            console.log('Files:', files);            
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [])
    return (
        <div className="w-[100%]">
            <Navbar user={user} setIsAuth={setIsAuth}/>
            <div className="flex p-2 flex-col w-[100%]">
                {files?.map((file: File, index: number) => (
                    <div key={index} className="flex items-center w-[100%]">
                        <div className='flex m-2 w-[500px]'>
                            <BsFiletypePdf  size={50}/>
                            <div>
                                <p className="font-semibold">{file.filePath}</p>
                                <a href={`${process.env.REACT_APP_API}/${file.filePath}`} target='blank' download className="text-blue-600 hover:text-blue-800"><BsDownload /></a>
                            </div>
                        </div>
                        <MdOutlineArrowForward size={25}/>
                        <div className='flex m-2 w-[500px]'>
                            <BsFiletypePdf size={50}/>
                            <div>
                                <p className="font-semibold">{file.modifiedToFilePath}</p>
                                <a href={`${process.env.REACT_APP_API}/${file.modifiedToFilePath}`} target='blank' download className="text-blue-600 hover:text-blue-800"><BsDownload /></a>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

