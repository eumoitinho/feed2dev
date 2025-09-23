import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { feedbackService } from '../services/appwrite';
import { format } from 'date-fns';

export default function FeedbackDetail() {
  const { id } = useParams<{ id: string }>();
  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const queryClient = useQueryClient();

  if (!id) {
    return <div>Feedback not found</div>;
  }

  const { data: feedback, isLoading } = useQuery({
    queryKey: ['feedback', id],
    queryFn: () => feedbackService.getById(id),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => feedbackService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', id] });
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ text, author }: { text: string; author: string }) =>
      feedbackService.addComment(id, text, author),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', id] });
      setNewComment('');
    },
  });

  const handleStatusUpdate = () => {
    if (selectedStatus && selectedStatus !== feedback?.status) {
      updateStatusMutation.mutate(selectedStatus);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addCommentMutation.mutate({
        text: newComment.trim(),
        author: 'Admin' // You might want to get this from auth context
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!feedback) {
    return <div>Feedback not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/projects" className="text-gray-400 hover:text-gray-500">
                Projects
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link to={`/projects/${feedback.projectId}`} className="ml-4 text-gray-400 hover:text-gray-500">
                  Project
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-500">Feedback</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                  {feedback.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(feedback.createdAt), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Feedback #{feedback.id.slice(-8)}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedStatus || feedback.status}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || selectedStatus === feedback.status || updateStatusMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{feedback.description}</p>
              </div>

              {feedback.screenshot && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Screenshot</h3>
                  <img
                    src={feedback.screenshot}
                    alt="Feedback screenshot"
                    className="max-w-full h-auto border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Comments</h3>
                
                <form onSubmit={handleAddComment} className="mb-4">
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Add a comment..."
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || addCommentMutation.isPending}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
                    </button>
                  </div>
                </form>

                <div className="space-y-4">
                  {feedback.comments?.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  ))}
                  {(!feedback.comments || feedback.comments.length === 0) && (
                    <p className="text-gray-500 italic">No comments yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Details</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-xs font-medium text-gray-500">URL</dt>
                    <dd className="text-sm text-gray-900 break-all">
                      <a href={feedback.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                        {feedback.url}
                      </a>
                    </dd>
                  </div>
                  {feedback.email && (
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">
                        <a href={`mailto:${feedback.email}`} className="text-indigo-600 hover:text-indigo-500">
                          {feedback.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {feedback.userAgent && (
                    <div>
                      <dt className="text-xs font-medium text-gray-500">User Agent</dt>
                      <dd className="text-xs text-gray-900 break-all">{feedback.userAgent}</dd>
                    </div>
                  )}
                  {feedback.metadata && (
                    <>
                      {feedback.metadata.browser && (
                        <div>
                          <dt className="text-xs font-medium text-gray-500">Browser</dt>
                          <dd className="text-sm text-gray-900">{feedback.metadata.browser}</dd>
                        </div>
                      )}
                      {feedback.metadata.os && (
                        <div>
                          <dt className="text-xs font-medium text-gray-500">OS</dt>
                          <dd className="text-sm text-gray-900">{feedback.metadata.os}</dd>
                        </div>
                      )}
                      {feedback.metadata.screenResolution && (
                        <div>
                          <dt className="text-xs font-medium text-gray-500">Screen Resolution</dt>
                          <dd className="text-sm text-gray-900">{feedback.metadata.screenResolution}</dd>
                        </div>
                      )}
                      {feedback.metadata.viewport && (
                        <div>
                          <dt className="text-xs font-medium text-gray-500">Viewport</dt>
                          <dd className="text-sm text-gray-900">{feedback.metadata.viewport}</dd>
                        </div>
                      )}
                    </>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}