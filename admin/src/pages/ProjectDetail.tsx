import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { projectService, feedbackService } from '../services/appwrite';
import { format } from 'date-fns';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  if (!id) {
    return <div>Project not found</div>;
  }

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getById(id),
  });

  const { data: feedbackData, isLoading: feedbackLoading } = useQuery({
    queryKey: ['feedbacks', id, statusFilter, page],
    queryFn: () => feedbackService.getByProject(id, {
      status: statusFilter || undefined,
      page,
      limit: 20
    }),
  });

  // no-op

  if (projectLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
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
                <span className="ml-4 text-sm font-medium text-gray-500">{project.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="card mb-6">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9c-5 0-9-4-9-9m9 9V3m0 18c5 0 9-4 9-9" />
                    </svg>
                    <span className="text-sm text-gray-600">{project.domain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-500">
                      Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                {project.description && (
                  <p className="text-gray-700 max-w-2xl">{project.description}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-indigo-600 font-medium mb-1">Total Feedbacks</p>
                <p className="text-3xl font-bold text-indigo-700">
                  {project._count?.feedbacks || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Widget Integration</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Add this code to your website to start collecting feedback:</p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 whitespace-pre">
{`<script src="http://localhost:3000/widget.js"></script>
<script>
  Feed2Dev.init({
    projectId: '${project.id}',
    apiUrl: 'http://localhost:3001'
  });
</script>`}
                </pre>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">API Key:</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-800">{project.apiKey}</code>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Feedbacks</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {feedbackData?.feedbacks.filter(f => f.status === 'NEW').length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-lg font-semibold text-yellow-600">
                    {feedbackData?.feedbacks.filter(f => f.status === 'IN_PROGRESS').length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resolved</span>
                  <span className="text-lg font-semibold text-green-600">
                    {feedbackData?.feedbacks.filter(f => f.status === 'RESOLVED').length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-lg font-semibold text-indigo-600">
                    {(project._count?.feedbacks ?? 0) > 0 
                      ? Math.round(((feedbackData?.feedbacks.filter(f => f.status === 'RESOLVED').length || 0) / (project._count?.feedbacks ?? 1)) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Feedbacks</h2>
                <p className="text-sm text-gray-600">Manage and respond to user feedback</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
              >
                <option value="">All Status</option>
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body p-0">

          {feedbackLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loading">
                <div className="spinner"></div>
                <span className="text-secondary">Loading feedbacks...</span>
              </div>
            </div>
          ) : feedbackData?.feedbacks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedbacks yet</h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                {statusFilter ? 'No feedbacks found with the current filter.' : 'Start collecting feedback by adding the widget to your website.'}
              </p>
              {!statusFilter && (
                <button 
                  onClick={() => setStatusFilter('')}
                  className="btn btn-secondary"
                >
                  View Integration Guide
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {feedbackData?.feedbacks.map((feedback) => (
                  <div key={feedback.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`badge ${feedback.status === 'NEW' ? 'badge-new' : feedback.status === 'IN_PROGRESS' ? 'badge-progress' : feedback.status === 'RESOLVED' ? 'badge-resolved' : 'badge-archived'}`}>
                            {feedback.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(feedback.createdAt), 'MMM d, yyyy HH:mm')}
                          </span>
                          {feedback.email && (
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                              </svg>
                              <span className="text-xs text-gray-500">{feedback.email}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-900 mb-3 font-medium">{feedback.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <span className="truncate max-w-xs">{feedback.url}</span>
                          </div>
                          {feedback.comments && feedback.comments.length > 0 && (
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>{feedback.comments.length} comments</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <Link
                          to={`/feedback/${feedback.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          View Details
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {feedbackData && feedbackData.pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((feedbackData.pagination.page - 1) * feedbackData.pagination.limit) + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(feedbackData.pagination.page * feedbackData.pagination.limit, feedbackData.pagination.total)}</span> of{' '}
                      <span className="font-medium">{feedbackData.pagination.total}</span> results
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="btn btn-secondary btn-sm disabled:opacity-50"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= feedbackData.pagination.totalPages}
                        className="btn btn-secondary btn-sm disabled:opacity-50"
                      >
                        Next
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}