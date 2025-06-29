'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const Popup = ({ id, onClose }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);

    async function fetchComments() {
        setLoadingComments(true);
        try {
            const res = await fetch(`/api/getComment?id=${id}`);
            if (!res.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await res.json();
            setComments(data.documents);
        } catch (error) {
            console.error("Error fetching comments:", error);
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    }

    async function createComment() {
        if (!comment.trim()) {
            alert('Comment cannot be empty.');
            return;
        }
        setSubmittingComment(true);
        try {
            const res = await fetch(`/api/createComment?comment=${encodeURIComponent(comment)}&id=${id}`);
            if (!res.ok) {
                throw new Error('Failed to create comment');
            }
            setComment(''); 
            await fetchComments(); 
        } catch (error) {
            console.error("Error creating comment:", error);
            alert('Failed to submit comment. Please try again.');
        } finally {
            setSubmittingComment(false);
        }
    }

    useEffect(() => {
        if (id) {
            fetchComments();
        }
    }, [id]);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 rounded-lg p-6 shadow-2xl relative w-full max-w-xl max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 cursor-pointer hover:text-white transition-colors"
                >
                    <X size={24} /> 
                </button>

                <h1 className="text-2xl font-bold text-white mb-4">Comments</h1>

                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
                    {loadingComments ? (
                        <p className="text-gray-400">Loading comments...</p>
                    ) : comments.length > 0 ? (
                        comments.map((c) => (
                            <div key={c.$id} className="bg-gray-700 p-3 rounded-md text-sm">
                                <p className="text-gray-200">{c.comment}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {new Date(c.$createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                    )}
                </div>

                <div className="flex gap-2 mt-4">
                    <input
                        className="p-3 flex-grow font-semibold text-white border border-white/30 rounded-lg bg-transparent placeholder-gray-400 focus:border-white focus:ring-1 focus:ring-white outline-none"
                        placeholder="Type your comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                createComment();
                            }
                        }}
                        disabled={submittingComment}
                    />

                    <Button
                        variant="outline"
                        onClick={createComment}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submittingComment}
                    >
                        {submittingComment ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Popup;