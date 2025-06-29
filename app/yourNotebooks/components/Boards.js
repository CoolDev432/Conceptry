'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Boards = () => {
    const [boards, setBoards] = useState([])
    const router = useRouter()

    function handleRedirection(id, name) {
        router.push(`/conceptboard?id=${id}&name=${name}`)
    }

    async function getBoards() {
        try {
            const res = await fetch(`/api/getBoards`)
            const resJSON = await res.json()

            setBoards(resJSON.documents)
        } catch (error) {
            console.error('Failed to fetch boards:', error)
        }
    }

    useEffect(() => {
        getBoards()
    }, [])

    return (
        <div className='flex justify-center mt-10 flex-wrap w-full'>
            {boards.length > 0 ? (
                boards.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white/10  backdrop-blur-md border ml-10 border-white/20 rounded-2xl p-6 text-white shadow-lg transition-transform transform hover:border-yellow-300 cursor-pointer  hover:scale-105 hover:shadow-xl w-fit"
                        onClick={()=>{
                            handleRedirection(item.$id, item.boardName)
                        }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-xl font-semibold">{item.boardName}</h2>
                        </div>
                        <p className="text-sm text-gray-300">Owner: {item.createdBy}</p>
                    </div>
                ))
            ) : (
                <div>
                    <h1>Loading Boards...</h1>
                </div>
            )}
        </div>
    )
}

export default Boards
