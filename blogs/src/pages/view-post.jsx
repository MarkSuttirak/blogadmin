import React, { useEffect } from 'react';
import { useFrappeGetDoc, useFrappeUpdateDoc } from 'frappe-react-sdk';
import LoadingCircle from '../components/loading';
import { Link, useParams } from 'react-router-dom';
import { HomeSmile } from '@untitled-ui/icons-react';
import { XCircleIcon, CheckCircleIcon, XMarkIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

const ViewPost = () => {
  const { id } = useParams()

  const { data, isLoading, error, mutate } = useFrappeGetDoc('Blog Post', id, {
    fields: ['name', 'title', 'content', 'published_on']
  })

  const { updateDoc } = useFrappeUpdateDoc()

  const publishPost = () => {
    updateDoc('Blog Post', id, ['published', 1])
  }

  const unpublishPost = () => {
    updateDoc('Blog Post', id, ['published', 0])
  }

  useEffect(() => {
    mutate()
  }, [])
  return (
    <>
      <div className='page-section'>
        <nav className="flex mb-5" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <Link to='/' className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  <HomeSmile />
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <Link to='/blog-posts' className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Blog Posts
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                <p className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  {data && data.title}
                </p>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center justify-between mb-8">
          {data ? (
            <>
              <h1 className="main-title">{data.title}</h1>
              <div className='flex gap-x-4'>
                {data.published === 1 ? (
                  <button className="btn primary-btn" onClick={unpublishPost}>
                    Unpublish
                  </button>
                ) : (
                  <button className="btn primary-btn" onClick={publishPost}>
                    Publish
                  </button>
                )}
                <Link to='/blog-posts/edit'
                  className="btn primary-btn"
                >
                  Edit Post
                </Link>
              </div>
            </>
          ) : (
            <h1 className="main-title">Loading...</h1>
          )}
        </div>
        {data && (
          <div dangerouslySetInnerHTML={{__html: data.content}} />
        )}

        {isLoading && (
          <LoadingCircle size={80} innerSize={70}/>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">There was an error loading the single post, please try again.</h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ViewPost